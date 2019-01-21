
/* IMPORT */

import * as _ from 'lodash';
import {ipcRenderer as ipc} from 'electron';
import {Container, compose} from 'overstated';
import Attachment from './attachment';
import Attachments from './attachments';
import Editor from './editor';
import Export from './export';
import Import from './import';
import Loading from './loading';
import MultiEditor from './multi_editor';
import Note from './note';
import Notes from './notes';
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

  /* MIDDLEWARES */

  middlewares () {

    this.addMiddleware ( this.middlewareClosePopoversOthers );
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

  middlewareNoNote ( prev: MainState ) {

    if ( !( prev.note.note && !this.state.note.note ) ) return;

    if ( this.ctx.editor.isEditing () ) this.ctx.editor.toggleEditing ( false );
    if ( this.ctx.tags.isEditing () ) this.ctx.tags.toggleEditing ( false );
    if ( this.ctx.attachments.isEditing () ) this.ctx.attachments.toggleEditing ( false );

  }

  middlewareResetEditor ( prev: MainState ) {

    if ( !( !prev.editor.editing && !this.state.editor.editing && !this.ctx.note.is ( prev.note.note, this.state.note.note, true ) ) ) return;

    return this.ctx.editor.previewingState.reset ();

  }

  middlewareSaveEditor ( prev: MainState ) {

    if ( !( prev.note.note && ( ( prev.editor.editing && !this.state.editor.editing ) || ( this.state.editor.editing && !this.ctx.note.is ( prev.note.note, this.state.note.note ) ) || ( prev.editor.editing && prev.multiEditor.notes.length <= 1 && this.state.multiEditor.notes.length >= 1 ) ) ) ) return;

    const cm = this.ctx.editor.getCodeMirror ();

    if ( !cm ) return;

    const plainContent = cm.getValue ();

    return this.ctx.note.save ( prev.note.note, plainContent );

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
  search: Search,
  sorting: Sorting,
  tag: Tag,
  tags: Tags,
  trash: Trash,
  tutorial: Tutorial,
  window: Window
})( Main ) as IMain;
