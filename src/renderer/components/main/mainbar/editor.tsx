
/* IMPORT */

import {ipcRenderer as ipc} from 'electron';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Monaco from './monaco';

/* EDITOR */

class Editor extends React.Component<any, undefined> {

  _wasWindowBlurred: boolean = false;

  componentDidMount () {

    this.props.reset ();
    this.props.focus ();

    ipc.addListener ( 'window-blur', this.__windowBlur );

  }

  componentWillUnmount () {

    ipc.removeListener ( 'window-blur', this.__windowBlur );

  }

  __windowBlur = () => {

    this._wasWindowBlurred = true;

  }

  __change = ( content ) => {

    if ( !this.props.onChange ) return;

    this.props.onChange ( content );

  }

  __focus = () => {

    if ( !this._wasWindowBlurred ) return;

    this._wasWindowBlurred = false;

    this.props.restore ();

  }

  __scroll = () => {

    if ( !this.props.getMonaco () || ( !this._wasWindowBlurred && this.props.hasFocus () ) ) return;

    this.props.forget ();

  }

  __update = () => {

    this.props.reset ();

  }

  render () {

    const {content, autosave, save} = this.props;

    return <Monaco className="layout-content editor" language="markdown" theme="light" value={content} onBlur={() => { save (); autosave () }} onFocus={this.__focus} onChange={this.__change} onUpdate={this.__update} onScroll={this.__scroll} />;

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, onChange }) => ({
    onChange,
    content: container.note.getPlainContent (),
    autosave: container.note.autosave,
    getMonaco: container.editor.getMonaco,
    hasFocus: container.editor.hasFocus,
    forget: container.editor.editingState.forget,
    focus: container.editor.editingState.focus,
    save: container.editor.editingState.save,
    restore: container.editor.editingState.restore,
    reset: container.editor.editingState.reset
  })
})( Editor );
