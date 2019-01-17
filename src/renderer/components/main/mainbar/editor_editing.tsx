
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Code from './code';
import CodeUtils from './code/utils';

/* EDITOR EDITING */

class EditorEditing extends React.Component<any, undefined> {

  componentDidMount () {

    this.focus ();

  }

  componentDidUpdate () {

    this.focus ();

  }

  focus () {

    const cm = this.props.getCodeMirror ();

    if ( !cm ) return;

    CodeUtils.focus ( cm );

  }

  render () {

    const {content, saveState, restoreState} = this.props;

    return <Code className="layout-content editor editing" value={content} onBlur={saveState} onFocus={restoreState} />;

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    id: container.note.getChecksum (),
    content: container.note.getPlainContent (),
    getCodeMirror: container.editor.getCodeMirror,
    saveState: container.editor.editingState.save,
    restoreState: container.editor.editingState.restore
  })
})( EditorEditing );
