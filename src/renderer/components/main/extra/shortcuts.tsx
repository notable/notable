
/* IMPORT */

import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* SHORTCUTS */

class Shortcuts extends Component<{ container: IMain }, undefined> {

  /* VARIABLES */

  shortcuts = {
    'ctmd+shift+e': [this.__editorToggle, true],
    'ctmd+shift+p': [this.__editorToggle, true],
    'ctrl+shift+p': [this.__editorToggle, true],
    'ctmd+s': [this.__editorSave, true],
    'ctmd+a': [this.__editorSelectAll, false],
    'esc': [this.__editorsEscape, true],
    'delete': [this.__noteMoveToTrash, false],
    'shift+delete': [this.__noteRestoreFromTrash, true],
    'ctrl+delete': [this.__noteDelete, true],
    'up, left': [this.__searchPrevious, false],
    'down, right': [this.__searchNext, false],
    'ctrl+page_down': [this.__searchNext, true],
    'ctrl+page_up': [this.__searchPrevious, true],
    'ctrl+alt+page_down': [this.__tagNext, true],
    'ctrl+alt+page_up': [this.__tagPrevious, true]
  };

  /* SPECIAL */

  componentDidMount () {

    $.$document.on ( 'keydown', this.__keydown );

  }

  componentWillUnmount () {

    $.$document.off ( 'keydown', this.__keydown );

  }

  /* KEYDOWN */

  __keydown = event => {

    const isEditable = $.isEditable ( document.activeElement );

    for ( let shortcuts in this.shortcuts ) {

      const [handler, hasPriority] = this.shortcuts[shortcuts];

      if ( !hasPriority && isEditable ) continue;

      const shortcutArr = shortcuts.split ( ',' );

      for ( let i = 0, l = shortcutArr.length; i < l; i++ ) {

        const shortcut = shortcutArr[i];

        if ( !Svelto.Keyboard.keystroke.match ( event, shortcut ) ) continue;

        if ( handler.call ( this ) !== null ) {

          event.preventDefault ();
          event.stopImmediatePropagation ();

        }

        return;

      }

    }

  }

  /* HANDLERS */

  __editorToggle () {

    if ( this.props.container.editor.isSplit () ) return null;

    this.props.container.editor.toggleEditing ();

    return; //TSC

  }

  __editorSave () {

    if ( !this.props.container.editor.isEditing () || this.props.container.editor.isSplit () ) return null;

    this.props.container.editor.toggleEditing ();

    return; //TSC

  }

  __editorSelectAll () {

    if ( this.props.container.multiEditor.isEditing () ) return null;

    const $editorEditing = $('#mainbar .editor.editing');

    if ( $editorEditing.length && $editorEditing[0].contains ( document.activeElement ) ) return null;

    const $editorPreview = $('#mainbar .editor.preview');

    if ( !$editorPreview.length ) return null;

    window.getSelection ().selectAllChildren ( $editorPreview[0] );

    return; //TSC

  }

  __editorsEscape () {

    if ( this.props.container.attachments.isEditing () || this.props.container.tags.isEditing () ) return null;

    if ( this.props.container.multiEditor.isEditing () ) return this.props.container.multiEditor.selectClear ();

    if ( this.props.container.editor.isEditing () && !this.props.container.editor.isSplit () ) return this.props.container.editor.toggleEditing ( false );

    return null;

  }

  __noteMoveToTrash () {

    if ( this.props.container.editor.isEditing () || this.props.container.multiEditor.isEditing () || this.props.container.note.isDeleted () ) return null;

    return this.props.container.note.toggleDeleted ( undefined, true );

  }
  __noteRestoreFromTrash () {

    if ( this.props.container.editor.isEditing () || this.props.container.multiEditor.isEditing () || !this.props.container.note.isDeleted () ) return null;

    return this.props.container.note.toggleDeleted ( undefined, false );

  }

  __noteDelete () {

    if ( this.props.container.editor.isEditing () || this.props.container.multiEditor.isEditing () ) return null;

    return this.props.container.note.delete ();

  }

  __searchPrevious () {

    this.props.container.search.previous ();

  }

  __searchNext () {

    this.props.container.search.next ();

  }

  __tagNext () {

    this.props.container.tag.next ();

  }

  __tagPrevious () {

    this.props.container.tag.previous ();

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( Shortcuts );
