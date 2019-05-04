
/* IMPORT */

import * as _ from 'lodash';
import CallsBatch from 'calls-batch';
import {remote} from 'electron';
import glob from 'tiny-glob';
import {Container, autosuspend} from 'overstated';
import Config from '@common/config';
import File from '@renderer/utils/file';
import Utils from '@renderer/utils/utils';
import watcher from '@renderer/utils/watcher';

/* ATTACHMENTS */

class Attachments extends Container<AttachmentsState, MainCTX> {

  /* VARIABLES */

  _listener?: import ( 'chokidar' ).FSWatcher;

  /* STATE */

  state = {
    attachments: {} as AttachmentsObj,
    editing: false
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* LIFECYCLE */

  refresh = async () => {

    const attachmentsPath = Config.attachments.path;

    if ( !attachmentsPath || !await File.exists ( attachmentsPath ) ) return;

    const filePaths = Utils.normalizeFilePaths ( await glob ( Config.attachments.glob, { cwd: attachmentsPath, absolute: true, filesOnly: true } ) );

    const attachments = filePaths.reduce ( ( acc, filePath ) => {

      const attachment = this.ctx.attachment.read ( filePath );

      acc[attachment.fileName] = attachment;

      return acc;

    }, {} as AttachmentsObj );

    return this.set ( attachments );

  }

  listen = () => {

    if ( this._listener ) this._listener.close (); // In order to better support HMR

    const batch = new CallsBatch ({
      preflush: () => {
        this.ctx.suspend ();
        this.ctx.suspendMiddlewares ();
      },
      postflush: () => {
        this.ctx.unsuspend ();
        this.ctx.unsuspendMiddlewares ();
      },
      wait: 100
    });

    const isFilePathSupported = ( filePath: string ) => {
      return Config.attachments.re.test ( filePath );
    };

    const add = async ( filePath: string ) => {
      if ( !isFilePathSupported ( filePath ) ) return;
      const attachment = await this.ctx.attachment.read ( filePath );
      if ( !attachment ) return;
      const prevAttachment = this.ctx.attachment.get ( filePath );
      if ( prevAttachment ) return;
      await this.ctx.attachment.add ( attachment );
    };

    const rename = async ( filePath: string, nextFilePath: string ) => {
      if ( !isFilePathSupported ( nextFilePath ) ) return unlink ( filePath );
      const nextAttachment = await this.ctx.attachment.read ( nextFilePath );
      if ( !nextAttachment ) return;
      const attachment = this.ctx.attachment.get ( filePath );
      if ( !attachment ) return add ( nextFilePath );
      await this.ctx.attachment.replace ( attachment, nextAttachment );
    };

    const unlink = async ( filePath: string ) => {
      if ( !isFilePathSupported ( filePath ) ) return;
      const attachment = this.ctx.attachment.get ( filePath );
      if ( !attachment ) return;
      await this.ctx.attachment.delete ( attachment );
    };

    const attachmentsPath = Config.attachments.path;

    if ( !attachmentsPath ) return;

    this._listener = watcher ( attachmentsPath, {}, {
      add: Utils.batchify ( batch, add ),
      rename: Utils.batchify ( batch, rename ),
      unlink: Utils.batchify ( batch, unlink )
    });

  }

  /* API */

  get = (): AttachmentsObj => {

    return this.state.attachments;

  }

  set = ( attachments: AttachmentsObj ) => {

    return this.setState ({ attachments });

  }

  isEditing = (): boolean => {

    return this.state.editing;

  }

  toggleEditing = ( editing: boolean = !this.state.editing ) => {

    return this.setState ({ editing });

  }

  dialog = (): string[] => {

    const filePaths = remote.dialog.showOpenDialog ({
      title: 'Select Files to Add',
      buttonLabel: 'Add',
      properties: ['openFile', 'multiSelections'],
      defaultPath: Config.attachments.path
    });

    return filePaths || [];

  }

}

/* EXPORT */

export default Attachments;
