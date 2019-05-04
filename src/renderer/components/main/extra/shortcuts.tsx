
/* IMPORT */

import {Range} from 'monaco-editor/esm/vs/editor/editor.api.js';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* SHORTCUTS */

class Shortcuts extends Component<{ container: IMain }, {}> {

  /* VARIABLES */

  shortcuts: { [index: string]: [Function, boolean] } = {};

  /* SPECIAL */

  componentDidMount () {

    this.initShortcuts ();

    $.$document.on ( 'keydown', this.__keydown );

  }

  componentWillUnmount () {

    $.$document.off ( 'keydown', this.__keydown );

  }

  /* SHORTCUTS */

  initShortcuts = () => {

    this.shortcuts = {
      'ctmd+a': [this.__selectAll, false],
      'ctmd+shift+e': [this.__editorToggle, true],
      'ctmd+s': [this.__editorSave, true],
      'esc': [this.__editorsEscape, true],
      'delete': [this.__noteMoveToTrash, false],
      'shift+delete': [this.__noteRestoreFromTrash, true],
      'ctrl+delete': [this.__noteDelete, true],
      'ctmd+p': [this.__quickPanelOpen, true],
      'enter': [this.__quickPanelOpenItem, true],
      'up': [this.__quickPanelPrevItem, true],
      'down': [this.__quickPanelNextItem, true],
      'up ': [this.__searchPreviousStrict, true],
      'left': [this.__searchPrevious, false],
      'down ': [this.__searchNextStrict, true],
      'right': [this.__searchNext, false],
      'ctrl+page_down': [this.__searchNext, true],
      'ctrl+page_up': [this.__searchPrevious, true],
      'ctrl+alt+page_down': [this.__tagNext, true],
      'ctrl+alt+page_up': [this.__tagPrevious, true]
    };

  }

  /* KEYDOWN */

  __keydown = ( event: KeyboardEvent ) => {

    const isEditable = $.isEditable ( document.activeElement );

    for ( let shortcuts in this.shortcuts ) {

      const [handler, hasPriority] = this.shortcuts[shortcuts];

      if ( !hasPriority && isEditable ) continue;

      const shortcutArr = shortcuts.split ( ',' );

      for ( let i = 0, l = shortcutArr.length; i < l; i++ ) {

        const shortcut = shortcutArr[i];

        if ( !Svelto.Keyboard.keystroke.match ( event, shortcut ) ) continue;

        const result = handler.call ( this, event );

        if ( result === null ) continue; // Not actually handled

        event.preventDefault ();
        event.stopImmediatePropagation ();

        return;

      }

    }

  }

  /* HANDLERS */

  __selectAll = () => {

    if ( this.props.container.multiEditor.isEditing () ) return null;

    if ( this.props.container.editor.hasFocus () ) return null;

    const $preview = $('.mainbar .preview');

    if ( $preview.length ) { // Select preview

      const selection = window.getSelection ();

      if ( selection && selection.selectAllChildren ) selection.selectAllChildren ( $preview[0] ); //TSC: useless if statement

    } else { // Select editor

      const monaco = this.props.container.editor.getMonaco ();

      if ( !monaco ) return null;

      monaco.focus ();
      monaco.setSelection ( new Range ( 0, 0, Infinity, Infinity ) );

    }

  }

  __editorToggle = () => {

    if ( this.props.container.editor.isSplit () ) return null;

    this.props.container.editor.toggleEditing ();

  }

  __editorSave = () => {

    if ( !this.props.container.editor.isEditing () || this.props.container.editor.isSplit () ) return null;

    this.props.container.editor.toggleEditing ();

  }

  __editorsEscape = () => {

    if ( this.props.container.attachments.isEditing () || this.props.container.tags.isEditing () || this.props.container.quickPanel.isOpen () ) return null;

    if ( this.props.container.multiEditor.isEditing () ) return this.props.container.multiEditor.selectClear ();

    if ( this.props.container.editor.isSplit () ) return this.props.container.editor.toggleSplit ( false );

    if ( this.props.container.editor.isEditing () ) return this.props.container.editor.toggleEditing ( false );

    return null;

  }

  __noteMoveToTrash = () => {

    if ( this.props.container.editor.isEditing () || this.props.container.multiEditor.isEditing () || this.props.container.note.isDeleted () ) return null;

    return this.props.container.note.toggleDeleted ( undefined, true );

  }
  __noteRestoreFromTrash = () => {

    if ( this.props.container.editor.isEditing () || this.props.container.multiEditor.isEditing () || !this.props.container.note.isDeleted () ) return null;

    return this.props.container.note.toggleDeleted ( undefined, false );

  }

  __noteDelete = () => {

    if ( this.props.container.editor.isEditing () || this.props.container.multiEditor.isEditing () ) return null;

    return this.props.container.note.delete ();

  }

  __quickPanelOpen = () => {

    this.props.container.quickPanel.toggleOpen ( true );

  }

  __quickPanelOpenItem = () => {

    if ( !this.props.container.quickPanel.isOpen () ) return null;

    const nth = this.props.container.quickPanel.getItemIndex ();

    this.props.container.quickPanel.openNth ( nth );

  }

  __quickPanelPrevItem = () => {

    if ( !this.props.container.quickPanel.isOpen () ) return null;

    this.props.container.quickPanel.prevItem ();

  }

  __quickPanelNextItem = () => {

    if ( !this.props.container.quickPanel.isOpen () ) return null;

    this.props.container.quickPanel.nextItem ();

  }

  __searchPreviousStrict = () => {

    if ( $.isEditable ( document.activeElement ) && !this.props.container.search.hasFocus () ) return null;

    return this.__searchPrevious ();

  }

  __searchPrevious = () => {

    this.props.container.search.previous ();

  }

  __searchNextStrict = () => {

    if ( $.isEditable ( document.activeElement ) && !this.props.container.search.hasFocus () ) return null;

    return this.__searchNext ();

  }

  __searchNext = () => {

    this.props.container.search.next ();

  }

  __tagNext = () => {

    this.props.container.tag.next ();

  }

  __tagPrevious = () => {

    this.props.container.tag.previous ();

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( Shortcuts );
