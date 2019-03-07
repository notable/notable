
/* IMPORT */

import * as _ from 'lodash';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import * as LanguageMarkdown from 'monaco-editor/esm/vs/basic-languages/markdown/markdown.js';
import * as path from 'path';
import ThemeLight from './monaco_light';

/* MONACO */

const Monaco = {

  themes: {

    light: ThemeLight

  } as { [name: string]: monaco.editor.IStandaloneThemeData },

  init: _.once ( () => {

    Monaco.initEnvironment ();
    Monaco.initThemes ();
    Monaco.initTokenizers ();

  }),
  },

  initEnvironment () {

    self['MonacoEnvironment'] = {
      getWorkerUrl () {
        return `file://${path.join ( __static, 'javascript', 'monaco.worker.js' )}`;
      }
    };

  },

  initThemes () {

    Object.keys ( Monaco.themes ).forEach ( name => {

      monaco.editor.defineTheme ( name, Monaco.themes[name] );

    });

  },

  initTokenizers () {

    LanguageMarkdown.language.tokenizer.root.shift ();
    LanguageMarkdown.language.tokenizer.root.unshift (
      [/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ['white', 'keyword.title', 'title', 'keyword.title']],
    );

  }

};

/* EXPORT */

export default Monaco;
