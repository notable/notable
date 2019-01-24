
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Code from './code';

/* EDITOR EDITING */

class EditorEditing extends React.Component<any, undefined> {

  _currentContent: string = this.props.content;

  componentDidMount () {

    this.props.focus ();
    this.props.reset ();

  }

  componentDidUpdate () {

    this.props.focus ();
    this.props.reset ();

  }

  shouldComponentUpdate ( nextProps ) {

    return nextProps.content !== this._currentContent;

  }

  __change = ( cm, pos, content ) => {

    this._currentContent = content;

    if ( !this.props.onChange ) return;

    this.props.onChange ( cm, pos, content );

  }

  render () {

    const {content, autosave, save, restore} = this.props;

    return <Code className="layout-content editor editing" value={content} onBlur={() => { save (); autosave () }} onFocus={restore} onChange={this.__change} />;

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, onChange }) => ({
    onChange,
    id: container.note.getChecksum (),
    content: container.note.getPlainContent (),
    autosave: container.note.autosave,
    focus: container.editor.editingState.focus,
    save: container.editor.editingState.save,
    restore: container.editor.editingState.restore,
    reset: container.editor.editingState.reset
  })
})( EditorEditing );
