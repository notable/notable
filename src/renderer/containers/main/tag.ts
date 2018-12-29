
/* IMPORT */

import * as _ from 'lodash';
import {Container} from 'overstated';
import Tags, {TagSpecials} from '@renderer/utils/tags';
import Utils from '@renderer/utils/utils';

const {SEPARATOR} = Tags;
const {DEFAULT, ALL, FAVORITES, NOTEBOOKS, TAGS, TEMPLATES, UNTAGGED, TRASH} = TagSpecials;

/* TAG */

class Tag extends Container<TagState, MainCTX> {

  /* VARIABLES */

  autosuspend = {
    methods: /^(?!_|middleware|(?:(?:get|is|has)(?![a-z0-9]))|scrollTo)/
  };

  /* STATE */

  state = {
    tag: DEFAULT
  };

  /* API */

  get = ( tag: string = this.state.tag ): TagObj | undefined => {

    const tags = tag.split ( SEPARATOR ),
          obj = tags.reduce ( ( acc, tag ) => acc.tags && acc.tags[tag] || {}, { tags: this.ctx.tags.get () } );

    return _.isEmpty ( obj ) ? undefined : obj as TagObj;

  }

  getNotes = ( tag: string = this.state.tag ): NoteObj[] => {

    const obj = this.get ( tag );

    return obj && obj.notes || [];

  }

  getTags = ( tag: string = this.state.tag ): TagsObj => {

    const obj = this.get ( tag );

    return obj && obj.tags || {};

  }

  hasChildren = ( tag: string = this.state.tag ): boolean => {

    return !!Object.keys ( this.getTags ( tag ) ).length;

  }

  isCollapsed = ( tag: string = this.state.tag ): boolean => {

    const obj = this.get ( tag );

    return !!obj && !!obj.collapsed;

  }

  toggleCollapse = async ( tag: string = this.state.tag, force: boolean = !this.isCollapsed ( tag ) ) => {

    const obj = _.clone ( this.get ( tag ) );

    if ( !obj || _.isEmpty ( obj.tags ) ) return;

    obj.collapsed = force;

    const tags = _.clone ( this.ctx.tags.get () ),
          parentParts = obj.path.split ( SEPARATOR ).slice ( 0, -1 ),
          parentPartRoot = parentParts[0] || obj.path,
          parent = parentParts.reduce ( ( acc, tag ) => acc.tags && ( acc.tags[tag] = _.clone ( acc.tags[tag] ) ) || {}, {tags} ); // It's important to clone the parents too

    if ( !_.isEmpty ( parent ) ) {

      if ( tag === TAGS ) {

        parent.tags[TAGS] = obj;

      } else {

        parent.tags[obj.name] = obj;

        const isSpecial = ( tag === NOTEBOOKS ) || ( tag === TEMPLATES ) || tag.startsWith ( `${NOTEBOOKS}${Tags.SEPARATOR}` ) || tag.startsWith ( `${TEMPLATES}${Tags.SEPARATOR}` );

        if ( !isSpecial ) { // It's important to update the TAGS tag too

          tags[TAGS].tags[parentPartRoot] = tags[parentPartRoot];
          tags[TAGS] = _.clone ( tags[TAGS] );

        }

      }

      await this.ctx.tags.set ( tags );

    }

    if ( this.state.tag.startsWith ( `${tag}${Tags.SEPARATOR}` ) ) { // The current tag is inside a collapsed one

      await this.set ( tag );

    } //TODO: We should select `TAGS` if the current one is another non-special tag

  }

  scrollTo = ( tag: string = this.state.tag ) => {

    if ( !tag ) return;

    Utils.scrollTo ( `.tag[data-tag="${tag}"]`, '.layout-content > .multiple > .tag, .layout-content > .multiple > .tag-group' );

  }

  set = async ( tag: string ) => {

    if ( !this.get ( tag ) ) tag = DEFAULT;

    await this.setState ({ tag });

    await this.ctx.search.update ();

    this.scrollTo ( tag );

    this.ctx.note.scrollTo ();

  }

  setFromNote = async ( note?: NoteObj ) => {

    const tag = this.state.tag,
          tags = this.ctx.note.getTags ( note );

    /* VALIDATING CURRENT */

    if ( tag === ALL ) return;
    if ( tag === FAVORITES && this.ctx.note.isFavorited () ) return;
    if ( tag === TAGS && tags.length ) return;
    if ( tag === UNTAGGED && !tags.length ) return;
    if ( tag === TRASH && this.ctx.note.isDeleted () ) return;
    if ( this.ctx.note.getTags ( note, tag ).length ) return;

    /* SETTING NEXT */

    if ( !note ) return this.set ( ALL );

    const tagsTemplates = this.ctx.note.getTags ( note, TEMPLATES );

    if ( tagsTemplates.length ) return this.set ( tagsTemplates[0] );

    const tagsNotebooks = this.ctx.note.getTags ( note, NOTEBOOKS );

    if ( tagsNotebooks.length ) return this.set ( tagsNotebooks[0] );

    if ( this.ctx.note.isFavorited ( note ) ) return this.set ( FAVORITES );

    if ( tags.length ) return this.set ( ALL );

    return this.set ( UNTAGGED );

  }

  update = async () => {

    if ( this.get ( this.state.tag ) ) return;

    const tag = DEFAULT;

    await this.set ( tag );

    await this.ctx.note.update ();

  }

  navigate = ( modifier: number, wrap: boolean = true ) => {

    const $tags = $('#sidebar .tag');

    if ( !$tags.length ) return;

    const index = $tags.index ( '.tag.active' ) + modifier,
          indexWrapped = wrap ? ( $tags.length + index ) % $tags.length : index,
          tagNext = $tags.eq ( indexWrapped ).data ( 'tag' );

    if ( tagNext ) return this.ctx.tag.set ( tagNext );

    return; //TSC

  }

  previous = () => {

    return this.navigate ( -1 );

  }

  next = () => {

    return this.navigate ( 1 );

  }

}

/* EXPORT */

export default Tag;
