
/* IMPORT */

import * as _ from 'lodash';
import CallsBatch from 'calls-batch';
import Dialog from 'electron-dialog';
import glob from 'tiny-glob';
import {Container, autosuspend} from 'overstated';
import Config from '@common/config';
import File from '@renderer/utils/file';
import Utils from '@renderer/utils/utils';
import watcher from '@renderer/utils/watcher';

/* NOTES */

class Notes extends Container<NotesState, MainCTX> {

  /* VARIABLES */

  _listener;

  /* STATE */

  state = {
    notes: {}
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* LIFECYCLE */

  refresh = async () => {

    const notesPath = Config.notes.path;

    if ( !notesPath || !await File.exists ( notesPath ) ) return;

    const filePaths = Utils.normalizeFilePaths ( await glob ( Config.notes.glob, { cwd: notesPath, absolute: true, filesOnly: true } ) );

    const notes = {};

    await Promise.all ( filePaths.map ( async filePath => {

      const note = await this.ctx.note.read ( filePath );

      if ( !note ) return;

      notes[filePath] = note;

    }));

    return this.set ( notes );

  }

  listen = () => {

    if ( this._listener ) this._listener.close (); // In order to better support HMR

    const batch = new CallsBatch ({
      preflush: () => {
        this.ctx.suspend ();
        this.ctx.suspendMiddlewares ();
        optimizeBatch ( batch );
      },
      postflush: () => {
        this.ctx.unsuspend ();
        this.ctx.unsuspendMiddlewares ();
      },
      wait: 100
    });

    const optimizeBatch = ( batch ) => {
      /* GET */
      let queueNext = batch.get ();
      /* SKIPPING UPDATES ON MULTIPLE ADDITIONS */
      const lastAddIndex = _.findLastIndex ( queueNext, call => call[0] === add );
      queueNext = queueNext.map ( ( call, index ) => {
        if ( call[0] === add && index < lastAddIndex ) call[1][1] = false;
        return call;
      });
      /* SKIPPING UPDATES ON MULTIPLE DELETIONS */
      const lastDeleteIndex = _.findLastIndex ( queueNext, call => call[0] === unlink );
      queueNext = queueNext.map ( ( call, index ) => {
        if ( call[0] === unlink && index < lastDeleteIndex ) call[1][1] = false;
        return call;
      });
      /* SKIPPING UPDATES ON MULTIPLE CHANGES & MULTIPLE CONSECUTIVE CHANGES TO THE SAME FILE */
      const lastChangeIndex = _.findLastIndex ( queueNext, call => call[0] === change );
      queueNext = queueNext.filter ( ( call, index ) => {
        const callNext = queueNext[index + 1];
        return !callNext || call[0] !== callNext[0] || call[1][0] !== callNext[1][0];
      }).map ( ( call, index ) => {
        if ( call[0] === change && index < lastChangeIndex ) call[1][1] = false;
        return call;
      });
      /* SET */
      batch.set ( queueNext );
    }

    function isFilePathSupported ( filePath ) {
      return Config.notes.re.test ( filePath );
    }

    const add = async ( filePath, _refresh?: boolean ) => {
      if ( !isFilePathSupported ( filePath ) ) return;
      const note = await this.ctx.note.read ( filePath );
      if ( !note ) return;
      const prevNote = this.ctx.note.get ( filePath );
      if ( prevNote ) return;
      await this.ctx.note.add ( note, _refresh );
    };

    const change = async ( filePath, _refresh?: boolean ) => {
      if ( !isFilePathSupported ( filePath ) ) return;
      await rename ( filePath, filePath, _refresh );
    };

    const rename = async ( filePath, nextFilePath, _refresh?: boolean ) => {
      if ( !isFilePathSupported ( nextFilePath ) ) {
        if ( isFilePathSupported ( filePath ) ) return unlink ( filePath );
        return;
      }
      const nextNote = await this.ctx.note.read ( nextFilePath );
      if ( !nextNote ) return;
      const note = this.ctx.note.get ( filePath );
      if ( !note ) return add ( nextFilePath );
      if ( this.ctx.note.is ( note, nextNote ) ) return;
      if ( note.metadata.modified.getTime () > nextNote.metadata.modified.getTime () ) return;
      if ( !nextNote.content.length && ( Math.abs ( note.metadata.modified.getTime () - nextNote.metadata.modified.getTime () ) < 1000 ) ) return; //FIXME: For some reason some times the note gets read as an empty string, maybe we are reading and writing at "the same" time and the file gets cleared?
      const currentNote = this.ctx.note.get ();
      const editorData = this.ctx.editor.getData ();
      if ( editorData && this.ctx.note.is ( nextNote, currentNote ) && editorData.modified.getTime () > nextNote.metadata.modified.getTime () ) return;
      if ( currentNote && this.ctx.editor.isEditing () && this.ctx.note.is ( nextNote, currentNote, true ) ) { // Changes to the current note
        const data = this.ctx.editor.getData ();
        if ( data && data.content !== currentNote.plainContent ) { // The current content has not been saved
          const choice = Dialog.choice ( 'This note has been updated on disk, do you want to overwrite your current changes or keep them?', ['Overwrite Changes', 'Keep Changes'] );
          if ( choice === 1 ) return await this.ctx.note.autosave ();
        }
      }
      await this.ctx.note.replace ( note, nextNote, _refresh );
    };

    const unlink = async ( filePath, _refresh?: boolean ) => {
      if ( !isFilePathSupported ( filePath ) ) return;
      const note = this.ctx.note.get ( filePath );
      if ( !note ) return;
      await this.ctx.note.delete ( note, true, _refresh );
    };

    const notesPath = Config.notes.path;

    if ( !notesPath ) return;

    this._listener = watcher ( notesPath, {}, {
      add: Utils.batchify ( batch, add ),
      change: Utils.batchify ( batch, change ),
      rename: Utils.batchify ( batch, rename ),
      unlink: Utils.batchify ( batch, unlink )
    });

  }

  /* API */

  get = (): NotesObj => {

    return this.state.notes;

  }

  set = ( notes: NotesObj ) => {

    return this.setState ({ notes });

  }

}

/* EXPORT */

export default Notes;
