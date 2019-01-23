
/* IMPORT */

import * as _ from 'lodash';
import {Container} from 'overstated';
import Config from '@common/config';
import Settings from '@common/settings';
import {SortingBys, SortingTypes} from '@renderer/utils/sorting';

/* SORTING */

class Sorting extends Container<SortingState, MainCTX> {

  /* STATE */

  state = {
    by: Config.sorting.by,
    type: Config.sorting.type
  };

  /* API */

  getBy = (): SortingBys => {

    return this.state.by;

  }

  setBy = async ( by: SortingBys ) => {

    Settings.set ( 'sorting.by', by );

    await this.setState ({ by });

    await this.ctx.search.update ();

  }

  getType = (): SortingTypes => {

    return this.state.type;

  }

  setType = async ( type: SortingTypes ) => {

    Settings.set ( 'sorting.type', type );

    await this.setState ({ type });

    await this.ctx.search.update ();

  }

  toggleType = () => {

    const type = ( this.state.type === SortingTypes.ASC ) ? SortingTypes.DESC : SortingTypes.ASC;

    return this.setType ( type );

  }

  sort = ( notes: NoteObj[], by: SortingBys = this.state.by, type: SortingTypes = this.state.type ): NoteObj[] => {

    const iteratees = {
      [SortingBys.DATE_CREATED]: this.ctx.note.getCreated,
      [SortingBys.DATE_MODIFIED]: this.ctx.note.getModified,
      [SortingBys.TITLE]: this.ctx.note.getTitle
    };

    const iteratee = iteratees[by],
          [pinned, unpinned] = _.partition ( notes, this.ctx.note.isPinned ),
          pinnedSortedBy = _.sortBy ( pinned, iteratee ),
          unpinnedSortedBy = _.sortBy ( unpinned, iteratee ),
          pinnedSortedByType = ( type === SortingTypes.ASC ) ? pinnedSortedBy : pinnedSortedBy.reverse (),
          unpinnedSortedByType = ( type === SortingTypes.ASC ) ? unpinnedSortedBy : unpinnedSortedBy.reverse ();

    return pinnedSortedByType.concat ( unpinnedSortedByType ) as NoteObj[]; //TSC

  }

}

/* EXPORT */

export default Sorting;
