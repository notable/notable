
/* IMPORT */

import * as _ from 'lodash';
import Dialog from 'electron-dialog';
import {Container, autosuspend} from 'overstated';
import Tags from '@renderer/utils/tags';

/* EDITOR */

class MultiEditor extends Container<MultiEditorState, MainCTX> {

  /* STATE */

  state = {
    notes: [] as NoteObj[],
    skippable: false // Some refreshing tasks are skippable since we are going to call the same function again
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* HELPERS */

  _confirm ( message: string ) {

    const notes = this.getNotes ();

    message = message.replace ( /\[notes-nr\]/g, String ( notes.length ) );

    return Dialog.confirm ( message );

  }

  async _callAll ( method: Function, args: any[] = [] ) {

    await this.setSkippable ( true );

    const notes = this.getNotes ();

    for ( let i = 0, l = notes.length; i < l; i++ ) {

      const note = notes[i],
            isLast = i === ( l - 1 );

      if ( isLast ) await this.setSkippable ( false );

      await method.call ( undefined, note, ...args );

    }

  }

  /* API */

  toggleNoteRange = ( noteEnd: NoteObj ) => {

    const notesSelected = this.getNotes (),
          notes = this.ctx.search.getNotes (),
          noteStart = _.last ( notesSelected );

    if ( !noteStart ) return;

    let startIndex = notes.indexOf ( noteStart ),
        endIndex = notes.indexOf ( noteEnd ),
        minIndex = Math.min ( startIndex, endIndex ),
        maxIndex = Math.max ( startIndex, endIndex );

    if ( minIndex === maxIndex ) return;

    if ( minIndex === startIndex ) { // Direction: down

      minIndex += 1;
      maxIndex += 1;

    }

    const notesTarget = notes.slice ( minIndex, maxIndex ),
          notesToSelect = _.difference ( notesTarget, notesSelected ),
          notesToDeselect = _.intersection ( notesTarget, notesSelected ),
          notesNext = notesSelected.filter ( note => !notesToDeselect.includes ( note ) ).concat ( notesToSelect );

    return this.setNotes ( notesNext );

  }

  toggleNote = ( note: NoteObj, force?: boolean ) => {

    const notes = this.getNotes (),
          index = notes.indexOf ( note );

    let notesNext;

    if ( force !== true && index >= 0 ) { // Remove

      notesNext = notes.filter ( ( note, i ) => i !== index );

    } else if ( force !== false ) { // Add

      notesNext = notes.concat ([ note ]);

    }

    return this.setNotes ( notesNext );

  }

  getNotes = (): NoteObj[] => {

    return this.state.notes;

  }

  setNotes = async ( notes: NoteObj[] ) => {

    if ( notes.length === 0 ) {

      const note = this.ctx.note.get (),
            notes = note ? [note] : [];

      return this.setState ({ notes });

    } else if ( notes.length === 1 ) {

      const note = this.ctx.note.get ();

      await this.setState ({ notes });

      if ( note !== notes[0] ) {

        return this.ctx.note.set ( notes[0] );

      }

    } else {

      return this.setState ({ notes });

    }

  }

  isEditing = (): boolean => {

    return this.getNotes ().length > 1;

  }

  isNoteSelected = ( note: NoteObj ): boolean => {

    const notes = this.getNotes ();

    return notes.includes ( note );

  }

  isSkippable = (): boolean => {

    return this.state.skippable;

  }

  setSkippable = ( skippable: boolean ) => {

    return this.setState ({ skippable });

  }

  selectAll = () => {

    const notesAll = this.ctx.search.getNotes ();

    return this.setNotes ( notesAll );

  }

  selectInvert = () => {

    const notesAll = this.ctx.search.getNotes (),
          notes = this.getNotes (),
          notesInverted = notesAll.filter ( note => !notes.includes ( note ) );

    return this.setNotes ( notesInverted );

  }

  selectClear = () => {

    return this.setNotes ([]);

  }

  update = () => {

    const notesAll = this.ctx.search.getNotes (),
          notes = this.getNotes (),
          notesNext = notes.map ( note => notesAll.find ( note2 => note.filePath === note2.filePath ) ).filter ( _.identity ) as NoteObj[];

    return this.setNotes ( notesNext );

  }

  /* API - ACTIONS */

  favorite = () => {

    if ( !this._confirm ( 'Are you sure you want to favorite [notes-nr] notes?' ) ) return;

    return this._callAll ( this.ctx.note.toggleFavorite, [true] );

  }

  unfavorite = () => {

    if ( !this._confirm ( 'Are you sure you want to unfavorite [notes-nr] notes?' ) ) return;

    return this._callAll ( this.ctx.note.toggleFavorite, [false] );

  }

  pin = () => {

    if ( !this._confirm ( 'Are you sure you want to pin [notes-nr] notes?' ) ) return;

    return this._callAll ( this.ctx.note.togglePin, [true] );

  }

  unpin = () => {

    if ( !this._confirm ( 'Are you sure you want to unpin [notes-nr] notes?' ) ) return;

    return this._callAll ( this.ctx.note.togglePin, [false] );

  }

  trash = () => {

    if ( !this._confirm ( 'Are you sure you want to move to trash [notes-nr] notes?' ) ) return;

    return this._callAll ( this.ctx.note.toggleDeleted, [true] );

  }

  untrash = () => {

    if ( !this._confirm ( 'Are you sure you want to restore [notes-nr] notes?' ) ) return;

    return this._callAll ( this.ctx.note.toggleDeleted, [false] );

  }

  delete = () => {

    if ( !this._confirm ( 'Are you sure you want to permanently delete [notes-nr] notes?' ) ) return;

    return this._callAll ( this.ctx.note.delete, [true] );

  }

  tagsAdd = async ( tags: string[] ) => {

    if ( !tags.length ) return Dialog.alert ( 'No tags provided' );

    tags = Tags.sort ( tags ) as string[];

    if ( !this._confirm ( `Are you sure you want to add these tags to [notes-nr] notes: ${tags.map ( tag => `"${tag}"`).join ( ', ' )}?` ) ) return;

    return this._callAll ( this.ctx.note.addTags, [tags] );

  }

  tagsRemove = async ( tags: string[] ) => {

    if ( !tags.length ) return Dialog.alert ( 'No tags provided' );

    tags = Tags.sort ( tags ) as string[];

    if ( !this._confirm ( `Are you sure you want to remove these tags from [notes-nr] notes: ${tags.map ( tag => `"${tag}"`).join ( ', ' )}?` ) ) return;

    return this._callAll ( this.ctx.note.removeTags, [tags] );

  }

  openInApp = () => {

    return this._callAll ( this.ctx.note.openInApp );

  }

}

/* EXPORT */

export default MultiEditor;
