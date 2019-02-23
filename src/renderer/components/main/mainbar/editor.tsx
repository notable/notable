
/* IMPORT */

import {ipcRenderer as ipc} from 'electron';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Code from './code';

/* EDITOR */

class Editor extends React.Component<any, undefined> {

  _wasWindowBlurred: boolean = false;
  _currentContent: string;
  _currentModified: number;

  componentDidMount () {

    this.__initCodeMirrorData ();
    this.__reset ();

    this.props.focus ();

    ipc.addListener ( 'window-blur', this.__windowBlur );

  }

  componentDidUpdate () {

    this.__reset ();

  }

  componentWillUnmount () {

    ipc.removeListener ( 'window-blur', this.__windowBlur );

  }

  shouldComponentUpdate ( nextProps ) {

    return nextProps.content !== this._currentContent;

  }

  __windowBlur = () => {

    this._wasWindowBlurred = true;

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

    this.props.reset ();

  }

  __change = ( cm, pos, content ) => {

    this._currentContent = content;
    this._currentModified = Date.now ();

    if ( !this.props.onChange ) return;

    this.props.onChange ( cm, pos, content );

  }

  __focus = () => {

    if ( !this._wasWindowBlurred ) return;

    this._wasWindowBlurred = false;

    this.props.restore ();

  }

  __scroll = () => {

    const cm = this.props.getCodeMirror ();

    if ( !cm || ( !this._wasWindowBlurred && cm.hasFocus () ) ) return;

    this.props.forget ();

  }

  render () {

    const {content, autosave, save} = this.props;

    return <Code className="layout-content editor" value={content} onBlur={() => { save (); autosave () }} onFocus={this.__focus} onChange={this.__change} onScroll={this.__scroll} />;

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, onChange }) => ({
    onChange,
    content: container.note.getPlainContent (),
    modified: container.note.getModified (),
    autosave: container.note.autosave,
    getCodeMirror: container.editor.getCodeMirror,
    forget: container.editor.editingState.forget,
    focus: container.editor.editingState.focus,
    save: container.editor.editingState.save,
    restore: container.editor.editingState.restore,
    reset: container.editor.editingState.reset
  })
})( Editor );
