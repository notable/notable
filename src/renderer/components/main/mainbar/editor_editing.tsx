
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Code from './code';

/* EDITOR EDITING */

class EditorEditing extends React.Component<any, undefined> {

  componentDidMount () {

    this.props.focus ();
    this.props.reset ();

  }

  componentDidUpdate () {

    this.props.focus ();
    this.props.reset ();

  }

  render () {

    const {content, save, restore} = this.props;

    return <Code className="layout-content editor editing" value={content} onBlur={save} onFocus={restore} />;

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    id: container.note.getChecksum (),
    content: container.note.getPlainContent (),
    focus: container.editor.editingState.focus,
    save: container.editor.editingState.save,
    restore: container.editor.editingState.restore,
    reset: container.editor.editingState.reset
  })
})( EditorEditing );
