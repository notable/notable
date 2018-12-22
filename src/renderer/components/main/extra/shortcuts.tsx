
/* IMPORT */

import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* SHORTCUTS */

class Shortcuts extends Component<{ container: IMain }, undefined> {

  /* VARIABLES */

  shortcuts = {
    'ctmd+shift+e': [this.__editorToggle, true],
    'ctmd+s': [this.__editorSave, true],
    'esc': [this.__editorsEscape, true],
    'up, left': [this.__searchPrevious, false],
    'down, right': [this.__searchNext, false],
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

    this.props.container.editor.toggleEditing ();

  }

  __editorSave () {

    if ( !this.props.container.editor.isEditing () ) return null;

    this.props.container.editor.toggleEditing ();

    return; //TSC

  }

  __editorsEscape () {

    if ( this.props.container.attachments.isEditing () || this.props.container.tags.isEditing () ) return null;

    if ( this.props.container.multiEditor.isEditing () ) return this.props.container.multiEditor.selectClear ();

    if ( this.props.container.editor.isEditing () ) return this.props.container.editor.toggleEditing ( false );

    return null;

  }

  __searchPrevious () {

    this.props.container.search.previous ();

  }

  __searchNext () {

    this.props.container.search.next ();

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( Shortcuts );
