
/* IMPORT */

import * as _ from 'lodash';
import {shell} from 'electron';
import Dialog from 'electron-dialog';
import {Container, autosuspend} from 'overstated';
import * as path from 'path';
import File from '@renderer/utils/file';

/* ATTACHMENT */

class Attachment extends Container<AttachmentState, MainCTX> {

  /* VARIABLES */

  autosuspend = {
    methods: /^(?!_|middleware|(?:(?:get|is|has)(?![a-z0-9]))|read)/
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* API */

  add = ( attachment: AttachmentObj ) => {

    const attachments = _.clone ( this.ctx.attachments.get () );

    attachments[attachment.fileName] = attachment;

    return this.ctx.attachments.set ( attachments );

  }

  get = ( filePath: string ): AttachmentObj | undefined => {

    const fileName = path.basename ( filePath );

    return this.ctx.attachments.get ()[fileName];

  }

  getNotes = ( attachment: AttachmentObj ): NoteObj[] => {

    const notes: NoteObj[] = Object.values ( this.ctx.notes.get () );

    return notes.filter ( note => this.ctx.note.hasAttachment ( note, attachment ) );

  }

  openInApp = ( attachment: AttachmentObj ) => {

    if ( !attachment ) return Dialog.alert ( 'This attachment is no longer stored in disk' );

    return shell.openItem ( attachment.filePath );

  }

  reveal = ( attachment: AttachmentObj ) => {

    if ( !attachment ) return Dialog.alert ( 'This attachment is no longer stored in disk' );

    return shell.showItemInFolder ( attachment.filePath );

  }

  read = ( filePath: string ): AttachmentObj => {

    const fileName = path.basename ( filePath ),
          attachment = { fileName, filePath };

    return attachment;

  }

  replace = async ( attachment: AttachmentObj, nextAttachment: AttachmentObj ) => {

    await this.add ( nextAttachment );

    await this.delete ( attachment, true );

    const notes = this.getNotes ( attachment );

    for ( let note of notes ) {

      await this.ctx.note.replaceAttachment ( note, attachment, nextAttachment );

    }

  }

  delete = async ( attachment?: AttachmentObj, justFile: boolean = false ) => {

    if ( !attachment ) return;

    if ( await File.exists ( attachment.filePath ) ) File.unlink ( attachment.filePath );

    const attachments = _.clone ( this.ctx.attachments.get () );

    delete attachments[attachment.fileName];

    await this.ctx.attachments.set ( attachments );

    if ( justFile ) return;

    const notes = this.getNotes ( attachment );

    return Promise.all ( notes.map ( note => this.ctx.note._removeAttachment ( note, attachment ) ) );

  }

}

/* EXPORT */

export default Attachment;
