
/* IMPORT */

import * as _ from 'lodash';
import * as isShallowEqual from 'is-shallow-equal';
import {Container, autosuspend} from 'overstated';
import Config from '@common/config';

/* SEARCH */

class Search extends Container<SearchState, MainCTX> {

  /* VARIABLES */

  _prev: { [id: string]: { query?: string, notes?: NoteObj[], state?: { notes: NotesState, sorting: SortingState, tags: TagsState, tag: TagState } } } = {}; // So that multiple subsearches are isolated from each other (middlebar, quick open...)

  /* STATE */

  state = {
    query: '',
    notes: [] as NoteObj[]
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* HELPERS */

  _isAttachmentMatch = ( attachment: AttachmentObj, query: string ): boolean => {

    return Svelto.Fuzzy.match ( attachment.fileName, query, false ) ;

  }

  _filterAttachmentsByQuery = ( attachments: AttachmentObj[], query: string ): AttachmentObj[] => {

    return attachments.filter ( attachment => this._isAttachmentMatch ( attachment, query ) );

  }

  _isNoteMatch = ( note: NoteObj, filterContent: boolean, query: string, tokensRe: RegExp[] ): boolean => {

    const content = this.ctx.note.getContent ( note );

    return (
      ( filterContent && tokensRe.every ( tokenRe => tokenRe.test ( content ) ) ) ||
      Svelto.Fuzzy.match ( this.ctx.note.getTitle ( note ), query, false )
    );

  }

  _filterNotesByQuery = ( notes: NoteObj[], filterContent: boolean, query: string ): NoteObj[] => {

    const tokensRe = _.escapeRegExp ( query ).split ( Config.search.tokenizer ).map ( token => new RegExp ( token, 'i' ) );

    return notes.filter ( note => this._isNoteMatch ( note, filterContent, query, tokensRe ) );

  }

  _searchBy = ( tag: string, filterContent: boolean, query: string, _prevId: string = 'search' ): NoteObj[] => {

    /* OPTIMIZED SEARCH */ // Filtering/Ordering only the previously filtered notes

    if ( !this._prev[_prevId] ) this._prev[_prevId] = {};

    const prev = this._prev[_prevId],
          prevQuery = prev.query,
          prevNotes = prev.notes,
          prevState = prev.state;

    prev.query = query;
    const state = prev.state = _.pick ( this.ctx.state, ['notes', 'sorting', 'tags', 'tag'] );

    if ( prevNotes && prevState ) {

      if ( query === prevQuery && prevState.notes === state.notes && prevState.tags === state.tags && prevState.tag === state.tag ) { // Simple reordering

        return prev.notes = this.ctx.sorting.sort ( prevNotes );

      } else if ( prevQuery && query.startsWith ( prevQuery ) && isShallowEqual ( prevState, state ) ) { // Sub-search

        return prev.notes = this._filterNotesByQuery ( prevNotes, filterContent, query );

      }

    }

    /* UNOPTIMIZED SEARCH */

    const notesByTag = this.ctx.tag.getNotes ( tag ),
          notesByQuery = !query ? notesByTag : this._filterNotesByQuery ( notesByTag, filterContent, query ),
          notesSorted = this.ctx.sorting.sort ( notesByQuery ),
          notesUnique = _.uniq ( notesSorted ); // If a note is in 2 sub-tags and we select a parent tag of both we will get duplicates

    return prev.notes = notesUnique;

  }

  /* API */

  getQuery = (): string => {

    return this.state.query;

  }

  setQuery = async ( query: string ) => {

    await this.setState ({ query });

    return this.update ();

  }

  focus = () => {

    const $input = $('.middlebar input[type="search"]');

    if ( !$input.length ) return;

    $input[0].focus ();

  }

  hasFocus = (): boolean => {

    return document.activeElement === $('.middlebar input[type="search"]')[0];

  }

  clear = () => {

    return this.setQuery ( '' );

  }

  getNoteIndex = ( note: NoteObj ): number => {

    return this.state.notes.indexOf ( note );

  }

  getNotes = (): NoteObj[] => {

    return this.state.notes;

  }

  setNotes = ( notes: NoteObj[] ) => {

    return this.setState ({ notes });

  }

  update = async ( prevNoteIndex?: number ) => {

    const tag = this.ctx.tag.get ();

    if ( !tag ) return;

    const notes = this._searchBy ( tag.path, true, this.state.query );

    if ( isShallowEqual ( this.state.notes, notes ) ) return; // Skipping unnecessary work

    await this.setNotes ( notes );

    await this.ctx.note.update ( prevNoteIndex );

    await this.ctx.multiEditor.update ();

  }

  navigate = ( modifier: number, wrap: boolean = true ) => {

    const {notes} = this.state,
          note = this.ctx.note.get (),
          index = ( note ? notes.indexOf ( note ) : -1 ) + modifier,
          indexNext = wrap ? ( notes.length + index ) % notes.length : index,
          noteNext = notes[indexNext];

    if ( noteNext ) return this.ctx.note.set ( noteNext, true );

  }

  previous = () => {

    return this.navigate ( -1 );

  }

  next = () => {

    return this.navigate ( 1 );

  }

}

/* EXPORT */

export default Search;
