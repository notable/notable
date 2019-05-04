
/* IMPORT */

import * as _ from 'lodash';
import {Container, autosuspend} from 'overstated';
import {TagSpecials} from '@renderer/utils/tags';

/* QUICK PANEL */

class QuickPanel extends Container<QuickPanelState, MainCTX> {

  /* STATE */

  state = {
    open: false,
    query: '',
    itemIndex: 0,
    results: {
      empty: 'No results found',
      items: []
    } as QuickPanelResults
  };

  /* HELPERS */

  _searchBy = ( query: string ): QuickPanelResults => {

    const notes = this.ctx.search._searchBy ( TagSpecials.ALL, false, query, 'quick-panel' ),
          attachments = this.ctx.search._filterAttachmentsByQuery ( Object.values ( this.ctx.attachments.get () ), query ); //OPTIMIZE: Optimize attachments search like we are optimizing notes searches

    return {
      empty: 'No results found',
      items: [...notes, ...attachments]
    };

  }

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* API */

  openNth = async ( nth: number ) => {

    const item = this.state.results.items[nth];

    await this.toggleOpen ( false );

    if ( !item ) return;

    if ( item.hasOwnProperty ( 'metadata' ) ) return this.ctx.note.set ( item as NoteObj, true );

    if ( item.hasOwnProperty ( 'fileName' ) ) return this.ctx.attachment.openInApp ( item as AttachmentObj );

  }

  isOpen = (): boolean => {

    return this.state.open;

  }

  toggleOpen = ( open: boolean = !this.state.open ) => {

    return this.setState ({ open });

  }

  getQuery = (): string => {

    return this.state.query;

  }

  setQuery = async ( query: string ) => {

    await this.setState ({ query });

    return this.update ();

  }

  scrollTo = ( index: number ) => {

    const {results} = this.state;

    if ( index < 0 || index > results.items.length ) return;

    $('.list-quick-panel').trigger ( 'scroll-to-item', index );

  }

  getItemIndex = (): number => {

    return this.state.itemIndex;

  }

  setItemIndex = async ( itemIndex: number ) => {

    await this.setState ({ itemIndex });

    this.scrollTo ( itemIndex );

  }

  navigateItem = ( modifier: number, wrap: boolean = true ) => {

    const {itemIndex, results} = this.state,
          index = itemIndex + modifier,
          indexNext = wrap ? ( results.items.length + index ) % results.items.length : index;

    return this.setItemIndex ( indexNext );

  }

  prevItem = () => {

    return this.navigateItem ( -1 );

  }

  nextItem = () => {

    return this.navigateItem ( 1 );

  }

  getResults = () => {

    return this.state.results;

  }

  setResults = ( results: QuickPanelResults ) => {

    return this.setState ({ results });

  }

  update = () => {

    const results = this._searchBy ( this.state.query ),
          itemIndex = 0;

    return this.setState ({ itemIndex, results });

  }

}

/* EXPORT */

export default QuickPanel;
