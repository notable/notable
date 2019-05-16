
/* IMPORT */

import * as _ from 'lodash';
import {Container, autosuspend, compose} from 'overstated';
import Attachment from './attachment';
import Attachments from './attachments';
import Clipboard from './clipboard';
import CWD from './cwd';
import ContextKeys from './context_keys';
import Editor from './editor';
import Export from './export';
import Import from './import';
import Loading from './loading';
import MultiEditor from './multi_editor';
import Note from './note';
import Notes from './notes';
import QuickPanel from './quick_panel';
import Search from './search';
import Skeleton from './skeleton';
import Sorting from './sorting';
import Tag from './tag';
import Tags from './tags';
import Theme from './theme';
import Themes from './themes';
import Trash from './trash';
import Tutorial from './tutorial';
import Window from './window';
import File from '@renderer/utils/file';

/* MAIN */

class Main extends Container<MainState, MainCTX> {

  /* VARIABLES */

  autosuspend = {
    methods: /^(?!_|middleware|(?:(?:get|is|has)(?![a-z0-9]))|waitIdle)/
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* MIDDLEWARES */

  middlewares () {

    this.addMiddleware ( this.middlewareClosePopoversOthers );
    this.addMiddleware ( this.middlewareClosePopoversQuickPanel );
    this.addMiddleware ( this.middlewareCloseQuickPanelPopovers );
    this.addMiddleware ( this.middlewareNoNote );
    this.addMiddleware ( this.middlewareResetEditor );
    this.addMiddleware ( _.debounce ( () => this.ctx.contextKeys.update (), 50 ) ); //UGLY `this.ctx` won't be defined immediately after calling this method

  }

  middlewareClosePopoversOthers ( prev: MainState ) {

    const settings = ['attachments.editing', 'tags.editing'], // Settings controlling the visibility of popovers
          togglers = [this.ctx.attachments.toggleEditing, this.ctx.tags.toggleEditing], // Functions to call for opening/closing the popover
          settingsOpen = settings.find ( setting => !_.get ( prev, setting ) && _.get ( this.state, setting ) );

    if ( !settingsOpen ) return;

    settings.forEach ( ( setting, index ) => {

      if ( setting === settingsOpen || !_.get ( this.state, setting ) ) return;

      togglers[index]( false );

    });

  }

  middlewareClosePopoversQuickPanel ( prev: MainState ) {

    if ( !( ( prev.attachments.editing || prev.tags.editing ) && !prev.quickPanel.open && this.state.quickPanel.open ) ) return;

    if ( this.ctx.attachments.isEditing () ) this.ctx.attachments.toggleEditing ( false );
    if ( this.ctx.tags.isEditing () ) this.ctx.tags.toggleEditing ( false );

  }

  middlewareCloseQuickPanelPopovers ( prev: MainState ) {

    if ( !( ( ( !prev.attachments.editing && this.state.attachments.editing ) || ( !prev.tags.editing && this.state.tags.editing ) ) && this.state.quickPanel.open ) ) return;

    this.ctx.quickPanel.toggleOpen ( false );

  }

  middlewareNoNote ( prev: MainState ) {

    if ( !( prev.note.note && !this.state.note.note ) ) return;

    if ( this.ctx.editor.isSplit () ) this.ctx.editor.toggleSplit ( false );
    if ( this.ctx.editor.isEditing () ) this.ctx.editor.toggleEditing ( false );
    if ( this.ctx.tags.isEditing () ) this.ctx.tags.toggleEditing ( false );
    if ( this.ctx.attachments.isEditing () ) this.ctx.attachments.toggleEditing ( false );

  }

  middlewareResetEditor ( prev: MainState ) {

    if ( !( ( ( !prev.editor.editing && !this.state.editor.editing ) || this.state.editor.split ) && !this.ctx.note.is ( prev.note.note, this.state.note.note, true ) ) ) return;

    this.ctx.editor.previewingState.reset ();

  }

  /* API */

  reset = async () => {

    await this.ctx.theme.update ();

    await this.ctx.loading.reset ();
    await this.ctx.editor.reset ();
    await this.ctx.multiEditor.reset ();
    await this.ctx.attachments.reset ();
    await this.ctx.notes.reset ();
    await this.ctx.tags.reset ();
    await this.ctx.tag.reset ();
    await this.ctx.search.reset ();
    await this.ctx.note.reset ();
    await this.ctx.quickPanel.reset ();

    await this.ctx.loading.set ( false );

  }

  waitIdle = (): Promise<void> => { // Waiting until there are no pending API calls or IO operations

    return new Promise ( res => {

      const check = () => {

        if ( !this['_updateSuspended'] && File.storage.isIdle () ) return res ();

        requestAnimationFrame ( check );

      };

      check ();

    });

  }

}

/* EXPORT */

export default compose ({
  attachment: Attachment,
  attachments: Attachments,
  clipboard: Clipboard,
  cwd: CWD,
  contextKeys: ContextKeys,
  editor: Editor,
  export: Export,
  import: Import,
  loading: Loading,
  multiEditor: MultiEditor,
  note: Note,
  notes: Notes,
  quickPanel: QuickPanel,
  search: Search,
  skeleton: Skeleton,
  sorting: Sorting,
  tag: Tag,
  tags: Tags,
  theme: Theme,
  themes: Themes,
  trash: Trash,
  tutorial: Tutorial,
  window: Window
})( Main ) as IMain;
