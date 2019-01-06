
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* STATUSBAR POSITION */

class Position extends React.PureComponent<any, any> {
  state = {
    line: 0,
    ch: 0,
    connectedTo: null
  }

  componentDidMount () {
    const { isEditing, getCodeMirror } = this.props;

    if (isEditing) {
      const cm = getCodeMirror(),
            cursor = cm.getCursor();

      cm.on('cursorActivity', this.onCursorActivity.bind(this));

      this.setState({ line: cursor.line, ch: cursor.ch, connectedTo: cm })
    }
  }

  componentDidUpdate () {
    const { connectedTo } = this.state,
          { isEditing, getCodeMirror } = this.props;

    if (!connectedTo && isEditing) {
      const cm = getCodeMirror(),
            cursor = cm.getCursor();

      cm.on('cursorActivity', this.onCursorActivity.bind(this));

      this.setState({ line: cursor.line, ch: cursor.ch, connectedTo: cm })
    } else if (!!connectedTo && !isEditing) {
      connectedTo.off('cursorActivity', this.onCursorActivity.bind(this));

      this.setState({ line: 0, ch: 0, connectedTo: null });
    }
  }

  onCursorActivity () {
    const { isEditing, getCodeMirror } = this.props;

    if (!isEditing) {
      return;
    }

    const cm = getCodeMirror(),
          cursor = cm.getCursor();

      this.setState({ line: cursor.line, ch: cursor.ch })
  }

  render () {
    const { line, ch } = this.state;

    return <div className="label" title="Line, Column">{`Ln ${line}, Col ${ch}`}</div>;
  }
}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isEditing: container.editor.isEditing(),
    getCodeMirror: container.editor.getCodeMirror
  })
})( Position );
