
/* IMPORT */

import './codemirror';

import * as _ from 'lodash';
import * as is from 'electron-is';
import * as React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Todo from './items/todo';
import Utils from './utils';

/* OPTIONS */

const CTMD = is.macOS () ? 'Cmd' : 'Ctrl', // `Cmd` on macOS, `Ctrl` otherwise
      ALMD = is.macOS () ? 'Cmd' : 'Alt'; // `Cmd` on macOS, `Alt` otherwise

const options: any = { //TSC
  autofocus: true,
  electricChars: false,
  indentUnit: 2,
  indentWithTabs: false,
  lineNumbers: false,
  lineWrapping: true,
  mode: 'gfm',
  gitHubSpice: false,
  highlightFormatting: true,
  scrollbarStyle: 'native',
  smartIndent: false,
  tabSize: 2,
  undoDepth: 1000,
  keyMap: 'sublime',
  theme: 'github-light',
  viewportMargin: Infinity,
  extraKeys: {
    'Backspace': 'delCharBefore',
    [`${CTMD}-Z`]: 'undo',
    [`${CTMD}-Shift-Z`]: 'redo',
    'Tab': 'indentMore',
    'Shift-Tab': 'indentLess',
    [`${ALMD}-Ctrl-Up`]: 'swapLineUp',
    [`${ALMD}-Ctrl-Down`]: 'swapLineDown',
    'Alt-LeftClick': Utils.addSelection,
    'Alt-Z': Utils.toggleWrapping,
    [`${CTMD}-Enter`]: Todo.toggleBox,
    'Alt-D': Todo.toggleDone,
    [`${CTMD}-M`]: false,
    [`${CTMD}-H`]: false,
    [`${CTMD}-LeftClick`]: false
  }
};

/* CODE */

const Code = ({ className, value, onBlur = _.noop, onFocus = _.noop, onChange = _.noop, onScroll= _.noop }) => {

  Utils.initOptions ( options );

  return <CodeMirror className={className} value={value} options={options} onBlur={onBlur} onFocus={onFocus} onChange={onChange} onScroll={onScroll} />;

};

/* EXPORT */

export default Code;
