
/* IMPORT */

import * as _ from 'lodash';
import {Container} from 'overstated';
import UTags, {TagSpecials, TagSpecialsNames} from '@renderer/utils/tags';

const {SEPARATOR} = UTags;
const {ALL, FAVORITES, NOTEBOOKS, TAGS, TEMPLATES, UNTAGGED, TRASH} = TagSpecials;

/* TAGS */

class Tags extends Container<TagsState, MainCTX> {

  /* STATE */

  state = {
    tags: {},
    editing: false
  };

  /* LYFECYCLE */

  refresh = () => {

    let tags = {};

    const paths: string[] = [];

    tags[ALL] = { path: ALL, name: TagSpecialsNames.ALL, notes: [], tags: {} };
    tags[FAVORITES] = { path: FAVORITES, name: TagSpecialsNames.FAVORITES, notes: [], tags: {} };
    tags[NOTEBOOKS] = { path: NOTEBOOKS, name: TagSpecialsNames.NOTEBOOKS, notes: [], tags: {} };
    tags[TAGS] = { path: TAGS, name: TagSpecialsNames.TAGS, notes: [], tags: {} };
    tags[TEMPLATES] = { path: TEMPLATES, name: TagSpecialsNames.TEMPLATES, notes: [], tags: {} };
    tags[UNTAGGED] = { path: UNTAGGED, name: TagSpecialsNames.UNTAGGED, notes: [], tags: {} };
    tags[TRASH] = { path: TRASH, name: TagSpecialsNames.TRASH, notes: [], tags: {} };

    Object.values ( this.ctx.notes.get () ).forEach ( note => {

      if ( this.ctx.note.isDeleted ( note ) ) {

        tags[TRASH].notes.push ( note );

      } else {

        const tagsNotebooks = this.ctx.note.getTags ( note, NOTEBOOKS ),
              isNotebook = !!tagsNotebooks.length,
              tagsTemplates = this.ctx.note.getTags ( note, TEMPLATES ),
              isTemplate = !!tagsTemplates.length;

        if ( !isTemplate ) {

          tags[ALL].notes.push ( note );

        }

        if ( this.ctx.note.isFavorited ( note ) ) {

          tags[FAVORITES].notes.push ( note );

        }

        const noteTags = this.ctx.note.getTags ( note );

        if ( !noteTags.length ) {

          tags[UNTAGGED].notes.push ( note );

        } else {

          noteTags.forEach ( tag => {

            const isNotebookTag = isNotebook && tagsNotebooks.includes ( tag ),
                  isTemplateTag = isTemplate && tagsTemplates.includes ( tag );

            if ( isTemplate && !isTemplateTag ) return;

            const parts = tag.split ( SEPARATOR ),
                  currentParts: string[] = [];

            parts.reduce ( ( tags, tag, index ) => {

              currentParts.push ( tag );

              const path = currentParts.join ( SEPARATOR );

              if ( !paths.includes ( path ) ) paths.push ( path );

              const collapsed = this.ctx.tag.isCollapsed ( path );

              if ( !tags[tag] ) tags[tag] = { path, name: tag, collapsed, notes: [], tags: {} };

              if ( !tags[tag].notes.includes ( note ) ) tags[tag].notes.push ( note );

              if ( !index && !isNotebookTag && !isTemplateTag ) {

                tags[TAGS].tags[tag] = tags[tag];

                if ( !tags[TAGS].notes.includes ( note ) ) tags[TAGS].notes.push ( note );

              }

              return tags[tag].tags;

            }, tags );

          });

        }

      }

    });

    tags = _.pickBy ( _.extendWith ( tags, this.state.tags, ( next, prev ) => { // Reusing the previous tags objects if possible //FIXME: Ugly, but improves performance with React
      return _.isEqual ( prev, next ) ? prev : _.isUndefined ( next ) ? null : next;
    }));

    return this.set ( tags );

  }

  /* API */

  get = (): TagsObj => {

    return this.state.tags;

  }

  set = ( tags: TagsObj ) => {

    return this.setState ({ tags });

  }

  isEditing = (): boolean => {

    return this.state.editing;

  }

  toggleEditing = ( editing: boolean = !this.state.editing ) => {

    return this.setState ({ editing });

  }

}

/* EXPORT */

export default Tags;
