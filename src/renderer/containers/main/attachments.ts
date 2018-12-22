
/* IMPORT */

import * as _ from 'lodash';
import CallsBatch from 'calls-batch';
import {remote} from 'electron';
import * as globby from 'globby';
import {Container} from 'overstated';
import Config from '@common/config';
import Utils from '@renderer/utils/utils';
import watcher from '@renderer/utils/watcher';

/* ATTACHMENTS */

class Attachments extends Container<AttachmentsState, MainCTX> {

  /* VARIABLES */

  _listener;

  /* STATE */

  state = {
    attachments: {},
    editing: false
  };

  /* LIFECYCLE */

  refresh = async () => {

    const filePaths = Utils.globbyNormalize ( await globby ( Config.attachments.globs, { cwd: Config.attachments.path, absolute: true } ) );

    const attachments = filePaths.reduce ( ( acc, filePath ) => {

      const attachment = this.ctx.attachment.read ( filePath );

      acc[attachment.fileName] = attachment;

      return acc;

    }, {} );

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

    function batchify ( fn ) {
      return function ( ...args ) {
        batch.add ( fn, args );
      }
    }

    const isFilePathSupported = ( filePath ) => {
      return Config.attachments.re.test ( filePath );
    };

    const add = async ( filePath ) => {
      if ( !isFilePathSupported ( filePath ) ) return;
      const prevAttachment = this.ctx.attachment.get ( filePath );
      if ( prevAttachment ) return;
      const attachment = await this.ctx.attachment.read ( filePath );
      await this.ctx.attachment.add ( attachment );
    };

    const rename = async ( filePath, nextFilePath ) => {
      if ( !isFilePathSupported ( nextFilePath ) ) return unlink ( filePath );
      const attachment = this.ctx.attachment.get ( filePath );
      if ( !attachment ) return add ( nextFilePath );
      const nextAttachment = await this.ctx.attachment.read ( nextFilePath );
      await this.ctx.attachment.replace ( attachment, nextAttachment );
    };

    const unlink = async ( filePath ) => {
      if ( !isFilePathSupported ( filePath ) ) return;
      const attachment = this.ctx.attachment.get ( filePath );
      if ( !attachment ) return;
      await this.ctx.attachment.delete ( attachment );
    };

    const attachmentsPath = Config.attachments.path;

    if ( !attachmentsPath ) return;

    this._listener = watcher ( attachmentsPath, {}, {
      add: batchify ( add ),
      rename: batchify ( rename ),
      unlink: batchify ( unlink )
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
      properties: ['openFile', 'multiSelections']
    });

    return filePaths || [];

  }

}

/* EXPORT */

export default Attachments;
