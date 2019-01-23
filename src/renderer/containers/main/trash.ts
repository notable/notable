
/* IMPORT */

import Dialog from 'electron-dialog';
import {Container, autosuspend} from 'overstated';
import {TagSpecials} from '@renderer/utils/tags';

const {TRASH} = TagSpecials;

/* TRASH */

class Trash extends Container<TrashState, MainCTX> {

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* HELPERS */

  _getNotes = (): NoteObj[] => {

    return this.ctx.tag.getNotes ( TRASH );

  }

  /* API */

  isEmpty = (): boolean => {

    return !this._getNotes ().length;

  }

  empty = () => {

    if ( !Dialog.confirm ( 'Are you sure you want to permanently empty the trash?' ) ) return;

    const notes = this._getNotes ();

    return Promise.all ( notes.map ( note => this.ctx.note.delete ( note, true ) ) );

  }

}

/* EXPORT */

export default Trash;
