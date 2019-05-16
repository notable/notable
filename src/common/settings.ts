
/* IMPORT */

import * as os from 'os';
import * as Store from 'electron-store';
import {darkMode} from 'electron-util';

/* SETTINGS */

const Settings = new Store ({
  name: '.notable',
  cwd: os.homedir (),
  defaults: {
    cwd: undefined,
    monaco: {
      editorOptions: {
        minimap: {
          enabled: false
        },
        lineNumbers: 'off',
        wordWrap: 'bounded'
      }
    },
    sorting: {
      by: 'title',
      type: 'ascending'
    },
    theme: darkMode.isEnabled ? 'dark' : 'light',
    tutorial: false // Did we import the tutorial yet?
  }
});

/* EXPORT */

export default Settings;
