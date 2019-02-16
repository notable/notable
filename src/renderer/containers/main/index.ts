
/* IMPORT */

import * as _ from 'lodash';
import {ipcRenderer as ipc} from 'electron';
import {Container, autosuspend, compose} from 'overstated';
import Attachment from './attachment';
import Attachments from './attachments';
import Editor from './editor';
import Export from './export';
import Import from './import';
import Loading from './loading';
import MultiEditor from './multi_editor';
import Note from './note';
import Notes from './notes';
import QuickPanel from './quick_panel';
import Search from './search';
import Sorting from './sorting';
import Tag from './tag';
import Tags from './tags';
import Trash from './trash';
import Tutorial from './tutorial';
import Window from './window';
import {TagSpecials} from '@renderer/utils/tags';

/* MAIN */

class Main extends Container<MainState, MainCTX> {

  /* VARIABLES */

  _prevFlags;

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
    this.addMiddleware ( this.middlewareSaveEditor );
    this.addMiddleware ( this.middlewareFlagsUpdateIPC );

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

    return this.ctx.editor.previewingState.reset ();

  }

  middlewareSaveEditor ( prev: MainState ) {

    const note = this.ctx.note.get ();

    if ( !( prev.note.note && ( ( prev.editor.editing && !this.state.editor.editing ) || ( prev.editor.editing && !prev.editor.split && this.state.editor.split ) || ( this.state.editor.editing && !this.ctx.note.is ( prev.note.note, note ) ) || ( prev.editor.editing && prev.multiEditor.notes.length <= 1 && this.state.multiEditor.notes.length > 1 ) ) ) ) return;

    if ( !( prev.note.note && note && ( prev.note.note.plainContent === note.plainContent || prev.note.note.metadata.modified.getTime () >= note.metadata.modified.getTime () ) ) ) return;

    const data = this.ctx.editor.getData ();

    if ( !data ) return;

    return this.ctx.note.save ( prev.note.note, data.content, data.modified );

  }

  middlewareFlagsUpdateIPCDebounced = _.debounce ( ( app: IMain ) => {

    const flags: StateFlags = {
      hasNote: !!app.note.get (),
      isAttachmentsEditing: app.attachments.isEditing (),
      isEditorEditing: app.editor.isEditing (),
      isEditorSplitView: app.editor.isSplit (),
      isMultiEditorEditing: app.multiEditor.isEditing (),
      isNoteDeleted: app.note.isDeleted (),
      isNoteFavorited: app.note.isFavorited (),
      isNotePinned: app.note.isPinned (),
      isNoteTemplate: !!app.note.getTags ( undefined, TagSpecials.TEMPLATES ).length,
      isTagsEditing: app.tags.isEditing ()
    };

    if ( _.isEqual ( app._prevFlags, flags ) ) return; // Nothing changed, no need to update the main process

    app._prevFlags = flags;

    ipc.send ( 'flags-update', flags );

  }, 50 )

  middlewareFlagsUpdateIPC () {

    this.middlewareFlagsUpdateIPCDebounced ( this as any ); //TSC

  }

  /* API */

  refresh = async () => {

    await this.ctx.attachments.refresh ();
    await this.ctx.notes.refresh ();
    await this.ctx.tags.refresh ();

    await this.ctx.tag.update ();
    await this.ctx.search.update ();

    await this.ctx.loading.set ( false );

  }

  listen = () => {

    this.ctx.attachments.listen ();
    this.ctx.notes.listen ();

  }

}

/* EXPORT */

export default compose ({
  attachment: Attachment,
  attachments: Attachments,
  editor: Editor,
  export: Export,
  import: Import,
  loading: Loading,
  multiEditor: MultiEditor,
  note: Note,
  notes: Notes,
  quickPanel: QuickPanel,
  search: Search,
  sorting: Sorting,
  tag: Tag,
  tags: Tags,
  trash: Trash,
  tutorial: Tutorial,
  window: Window
})( Main ) as IMain;
