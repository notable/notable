
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Code from './code';

/* EDITOR EDITING */

class EditorEditing extends React.Component<any, undefined> {

  _currentContent: string;
  _currentModified: number;

  componentDidMount () {

    this.__initCodeMirrorData ();
    this.__reset ();

  }

  componentDidUpdate () {

    this.__reset ();

  }

  shouldComponentUpdate ( nextProps ) {

    return nextProps.checksum !== this.props.checksum && nextProps.content !== this._currentContent;

  }

  __initCodeMirrorData = () => { //UGLY

    const cm = this.props.getCodeMirror ();

    if ( !cm ) return;

    Object.defineProperties ( cm, {
      __modified_date__: {
        configurable: true,
        get: () => new Date ( this._currentModified )
      },
      __content__: {
        configurable: true,
        get: () => this._currentContent
      }
    });

  }

  __reset = () => {

    this._currentContent = this.props.content;
    this._currentModified = this.props.modified.getTime ();

    this.props.focus ();
    this.props.reset ();

  }

  __change = ( cm, pos, content ) => {

    this._currentContent = content;
    this._currentModified = Date.now ();

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
    checksum: container.note.getChecksum (),
    content: container.note.getPlainContent (),
    modified: container.note.getModified (),
    autosave: container.note.autosave,
    getCodeMirror: container.editor.getCodeMirror,
    focus: container.editor.editingState.focus,
    save: container.editor.editingState.save,
    restore: container.editor.editingState.restore,
    reset: container.editor.editingState.reset
  })
})( EditorEditing );
