
/* IMPORT */

import {ipcRenderer as ipc, IpcMessageEvent} from 'electron';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* IPC */

class IPC extends Component<{container: IMain}, {}> {

  /* SPECIAL */

  componentDidMount () {

    ipc.on ( 'cwd-change', this.__cwdChange );
    ipc.on ( 'cwd-open-in-app', this.__cwdOpenInApp );
    ipc.on ( 'import', this.__import );
    ipc.on ( 'export-html', this.__exportHTML );
    ipc.on ( 'export-markdown', this.__exportMarkdown );
    ipc.on ( 'export-pdf', this.__exportPDF );
    ipc.on ( 'app-quit', this.__appQuit );
    ipc.on ( 'window-close', this.__windowClose );
    ipc.on ( 'window-focus-toggle', this.__windowFocusToggle );
    ipc.on ( 'window-fullscreen-set', this.__windowFullscreenSet );
    ipc.on ( 'window-sidebar-toggle', this.__windowSidebarToggle );
    ipc.on ( 'window-zen-toggle', this.__windowZenToggle );
    ipc.on ( 'editor-split-toggle', this.__editorSplitToggle );
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
    ipc.on ( 'note-duplicate-template', this.__noteDuplicateTemplate );
    ipc.on ( 'note-open-in-app', this.__noteOpenInApp );
    ipc.on ( 'note-permanently-delete', this.__notePermanentlyDelete );
    ipc.on ( 'note-pin-toggle', this.__notePinToggle );
    ipc.on ( 'note-restore', this.__noteRestore );
    ipc.on ( 'note-reveal', this.__noteReveal );
    ipc.on ( 'quick-panel-toggle', this.__quickPanelToggle );
    ipc.on ( 'search-focus', this.__searchFocus );
    ipc.on ( 'search-next', this.__searchNext );
    ipc.on ( 'search-previous', this.__searchPrevious );
    ipc.on ( 'tag-next', this.__tagNext );
    ipc.on ( 'tag-previous', this.__tagPrevious );
    ipc.on ( 'theme-set', this.__themeSet );
    ipc.on ( 'trash-empty', this.__trashEmpty );
    ipc.on ( 'tutorial-dialog', this.__tutorialDialog );

  }

  componentWillUnmount () {

    ipc.removeListener ( 'cwd-change', this.__cwdChange );
    ipc.removeListener ( 'cwd-open-in-app', this.__cwdOpenInApp );
    ipc.removeListener ( 'import', this.__import );
    ipc.removeListener ( 'export-html', this.__exportHTML );
    ipc.removeListener ( 'export-markdown', this.__exportMarkdown );
    ipc.removeListener ( 'export-pdf', this.__exportPDF );
    ipc.removeListener ( 'app-quit', this.__appQuit );
    ipc.removeListener ( 'window-close', this.__windowClose );
    ipc.removeListener ( 'window-focus-toggle', this.__windowFocusToggle );
    ipc.removeListener ( 'window-fullscreen-set', this.__windowFullscreenSet );
    ipc.removeListener ( 'window-sidebar-toggle', this.__windowSidebarToggle );
    ipc.removeListener ( 'window-zen-toggle', this.__windowZenToggle );
    ipc.removeListener ( 'editor-split-toggle', this.__editorSplitToggle );
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
    ipc.removeListener ( 'note-duplicate-template', this.__noteDuplicateTemplate );
    ipc.removeListener ( 'note-open-in-app', this.__noteOpenInApp );
    ipc.removeListener ( 'note-permanently-delete', this.__notePermanentlyDelete );
    ipc.removeListener ( 'note-pin-toggle', this.__notePinToggle );
    ipc.removeListener ( 'note-restore', this.__noteRestore );
    ipc.removeListener ( 'note-reveal', this.__noteReveal );
    ipc.removeListener ( 'quick-panel-toggle', this.__quickPanelToggle );
    ipc.removeListener ( 'search-focus', this.__searchFocus );
    ipc.removeListener ( 'search-next', this.__searchNext );
    ipc.removeListener ( 'search-previous', this.__searchPrevious );
    ipc.removeListener ( 'tag-next', this.__tagNext );
    ipc.removeListener ( 'tag-previous', this.__tagPrevious );
    ipc.removeListener ( 'theme-set', this.__themeSet );
    ipc.removeListener ( 'trash-empty', this.__trashEmpty );
    ipc.removeListener ( 'tutorial-dialog', this.__tutorialDialog );

  }

  /* HANDLERS */

  __cwdChange = () => {

    this.props.container.cwd.select ();

  }

  __cwdOpenInApp = () => {

    this.props.container.cwd.openInApp ();

  }

  __import = () => {

    this.props.container.import.select ();

  }

  __exportHTML = () => {

    this.props.container.export.exportHTML ();

  }

  __exportMarkdown = () => {

    this.props.container.export.exportMarkdown ();

  }

  __exportPDF = () => {

    this.props.container.export.exportPDF ();

  }

  __appQuit = async () => {

    await this.props.container.note.autosave ();
    await this.props.container.waitIdle ();

    ipc.send ( 'force-quit' );

  }

  __windowClose = async () => {

    await this.props.container.note.autosave ();
    await this.props.container.waitIdle ();

    ipc.send ( 'force-close' );

  }

  __windowFocusToggle = () => {

    this.props.container.window.toggleFocus ();

  }

  __windowFullscreenSet = ( event: IpcMessageEvent, isFullscreen?: boolean ) => {

    this.props.container.window.toggleFullscreen ( isFullscreen );

  }

  __windowSidebarToggle = () => {

    this.props.container.window.toggleSidebar ();

  }

  __windowZenToggle = () => {

    this.props.container.window.toggleZen ();

  }

  __editorSplitToggle = () => {

    this.props.container.editor.toggleSplit ();

  }

  __multiEditorSelectAll = () => {

    this.props.container.multiEditor.selectAll ();

  }

  __multiEditorSelectInvert = () => {

    this.props.container.multiEditor.selectInvert ();

  }

  __multiEditorSelectClear = () => {

    this.props.container.multiEditor.selectClear ();

  }

  __noteEditAttachmentsToggle = () => {

    this.props.container.attachments.toggleEditing ();

  }

  __noteEditTagsToggle = () => {

    this.props.container.tags.toggleEditing ();

  }

  __noteEditToggle = () => {

    this.props.container.editor.toggleEditing ();

  }

  __noteFavoriteToggle = () => {

    this.props.container.note.toggleFavorite ();

  }

  __noteMoveToTrash = () => {

    this.props.container.note.toggleDeleted ( undefined, true );

  }

  __noteNew = () => {

    this.props.container.note.new ();

  }

  __noteDuplicate = () => {

    this.props.container.note.duplicate ();

  }

  __noteDuplicateTemplate = () => {

    this.props.container.note.duplicate ( undefined, true );

  }

  __noteOpenInApp = () => {

    this.props.container.note.openInApp ();

  }

  __notePermanentlyDelete = () => {

    this.props.container.note.delete ();

  }

  __notePinToggle = () => {

    this.props.container.note.togglePin ();

  }

  __noteRestore = () => {

    this.props.container.note.toggleDeleted ( undefined, false );

  }

  __noteReveal = () => {

    this.props.container.note.reveal ();

  }

  __quickPanelToggle = ( event: IpcMessageEvent, force?: boolean ) => {

    this.props.container.quickPanel.toggleOpen ( force );

  }

  __searchFocus = () => {

    this.props.container.search.focus ();

  }

  __searchNext = () => {

    this.props.container.search.next ();

  }

  __searchPrevious = () => {

    this.props.container.search.previous ();

  }

  __tagNext = () => {

    this.props.container.tag.next ();

  }

  __tagPrevious = () => {

    this.props.container.tag.previous ();

  }

  __themeSet = ( event: IpcMessageEvent, theme: string ) => {

    this.props.container.theme.set ( theme );

  }

  __trashEmpty = () => {

    this.props.container.trash.empty ();

  }

  __tutorialDialog = () => {

    this.props.container.tutorial.dialog ();

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( IPC );
