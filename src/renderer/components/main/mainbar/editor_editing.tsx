
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

    return <Code className="layout-content editor editing" value={this.props.content} />;

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    id: container.note.getHash (),
    content: container.note.getPlainContent (),
    getCodeMirror: container.editor.getCodeMirror
  })
})( EditorEditing );
