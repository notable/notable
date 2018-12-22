
/* IMPORT */

import {ipcRenderer as ipc} from 'electron';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import CWD from '@renderer/containers/cwd';
import Main from '@renderer/containers/main';

/* IPC */

class IPC extends Component<{ containers: [IMain, ICWD]}, undefined> {

  /* VARIABLES */

  main; cwd;

  /* CONSTRUCTOR */

  constructor ( props ) {

    super ( props );

    this.main = props.containers[0] as IMain;
    this.cwd = props.containers[1] as ICWD;

  }

  /* SPECIAL */

  componentDidMount () {

    ipc.on ( 'cwd-change', this.__cwdChange );
    ipc.on ( 'cwd-open-in-app', this.__cwdOpenInApp );
    ipc.on ( 'import', this.__import );
    ipc.on ( 'window-focus-toggle', this.__windowFocusToggle );
    ipc.on ( 'window-fullscreen-set', this.__windowFullscreenSet );
    ipc.on ( 'multi-editor-select-all', this.__multiEditorSelectAll );
    ipc.on ( 'multi-editor-select-invert', this.__multiEditorSelectInvert );
    ipc.on ( 'multi-editor-select-clear', this.__multiEditorSelectClear );
    ipc.on ( 'note-edit-attachments-toggle', this.__noteEditAttachmentsToggle );
    ipc.on ( 'note-edit-tags-toggle', this.__noteEditTagsToggle );
    ipc.on ( 'note-edit-toggle', this.__noteEditToggle );
    ipc.on ( 'note-favorite-toggle', this.__noteFavoriteToggle );
    ipc.on ( 'note-move-to-trash', this.__noteMoveToTrash );
    ipc.on ( 'note-new', this.__noteNew );
    ipc.on ( 'note-duplicate', this.__noteDuplicate );
    ipc.on ( 'note-open-in-app', this.__noteOpenInApp );
    ipc.on ( 'note-permanently-delete', this.__notePermanentlyDelete );
    ipc.on ( 'note-pin-toggle', this.__notePinToggle );
    ipc.on ( 'note-restore', this.__noteRestore );
    ipc.on ( 'note-reveal', this.__noteReveal );
    ipc.on ( 'search-focus', this.__searchFocus );
    ipc.on ( 'search-next', this.__searchNext );
    ipc.on ( 'search-previous', this.__searchPrevious );
    ipc.on ( 'tag-next', this.__tagNext );
    ipc.on ( 'tag-previous', this.__tagPrevious );
    ipc.on ( 'trash-empty', this.__trashEmpty );
    ipc.on ( 'tutorial-dialog', this.__tutorialDialog );

  }

  componentWillUnmount () {

    ipc.removeListener ( 'cwd-change', this.__cwdChange );
    ipc.removeListener ( 'cwd-open-in-app', this.__cwdOpenInApp );
    ipc.removeListener ( 'import', this.__import );
    ipc.removeListener ( 'window-focus-toggle', this.__windowFocusToggle );
    ipc.removeListener ( 'window-fullscreen-set', this.__windowFullscreenSet );
    ipc.removeListener ( 'multi-editor-select-all', this.__multiEditorSelectAll );
    ipc.removeListener ( 'multi-editor-select-invert', this.__multiEditorSelectInvert );
    ipc.removeListener ( 'multi-editor-select-clear', this.__multiEditorSelectClear );
    ipc.removeListener ( 'note-edit-attachments-toggle', this.__noteEditAttachmentsToggle );
    ipc.removeListener ( 'note-edit-tags-toggle', this.__noteEditTagsToggle );
    ipc.removeListener ( 'note-edit-toggle', this.__noteEditToggle );
    ipc.removeListener ( 'note-favorite-toggle', this.__noteFavoriteToggle );
    ipc.removeListener ( 'note-move-to-trash', this.__noteMoveToTrash );
    ipc.removeListener ( 'note-new', this.__noteNew );
    ipc.removeListener ( 'note-duplicate', this.__noteDuplicate );
    ipc.removeListener ( 'note-open-in-app', this.__noteOpenInApp );
    ipc.removeListener ( 'note-permanently-delete', this.__notePermanentlyDelete );
    ipc.removeListener ( 'note-pin-toggle', this.__notePinToggle );
    ipc.removeListener ( 'note-restore', this.__noteRestore );
    ipc.removeListener ( 'note-reveal', this.__noteReveal );
    ipc.removeListener ( 'search-focus', this.__searchFocus );
    ipc.removeListener ( 'search-next', this.__searchNext );
    ipc.removeListener ( 'search-previous', this.__searchPrevious );
    ipc.removeListener ( 'tag-next', this.__tagNext );
    ipc.removeListener ( 'tag-previous', this.__tagPrevious );
    ipc.removeListener ( 'trash-empty', this.__trashEmpty );
    ipc.removeListener ( 'tutorial-dialog', this.__tutorialDialog );

  }

  /* HANDLERS */

  __cwdChange = () => {

    this.cwd.select ();

  }

  __cwdOpenInApp = () => {

    this.cwd.openInApp ();

  }

  __import = () => {

    this.main.import.select ();

  }

  __windowFocusToggle = () => {

    this.main.window.toggleFocus ();

  }

  __windowFullscreenSet = ( event, isFullscreen? ) => {

    this.main.window.toggleFullscreen ( isFullscreen );

  }

  __multiEditorSelectAll = () => {

    this.main.multiEditor.selectAll ();

  }

  __multiEditorSelectInvert = () => {

    this.main.multiEditor.selectInvert ();

  }

  __multiEditorSelectClear = () => {

    this.main.multiEditor.selectClear ();

  }

  __noteEditAttachmentsToggle = () => {

    this.main.attachments.toggleEditing ();

  }

  __noteEditTagsToggle = () => {

    this.main.tags.toggleEditing ();

  }

  __noteEditToggle = () => {

    this.main.editor.toggleEditing ();

  }

  __noteFavoriteToggle = () => {

    this.main.note.toggleFavorite ();

  }

  __noteMoveToTrash = () => {

    this.main.note.toggleDeleted ( undefined, true );

  }

  __noteNew = () => {

    this.main.note.new ();

  }

  __noteDuplicate = () => {

    this.main.note.duplicate ();

  }

  __noteOpenInApp = () => {

    this.main.note.openInApp ();

  }

  __notePermanentlyDelete = () => {

    this.main.note.delete ();

  }

  __notePinToggle = () => {

    this.main.note.togglePin ();

  }

  __noteRestore = () => {

    this.main.note.toggleDeleted ( undefined, false );

  }

  __noteReveal = () => {

    this.main.note.reveal ();

  }

  __searchFocus = () => {

    this.main.search.focus ();

  }

  __searchNext = () => {

    this.main.search.next ();

  }

  __searchPrevious = () => {

    this.main.search.previous ();

  }

  __tagNext = () => {

    this.main.tag.next ();

  }

  __tagPrevious = () => {

    this.main.tag.previous ();

  }

  __trashEmpty = () => {

    this.main.trash.empty ();

  }

  __tutorialDialog = () => {

    this.main.tutorial.dialog ();

  }

}

/* EXPORT */

export default connect ({
  containers: [Main, CWD],
  shouldComponentUpdate: false
})( IPC );
