
/* IMPORT */

import * as path from 'path';
import Settings from './settings';

/* CONFIG */

const Config = {
  get cwd () {
    return Settings.get ( 'cwd' );
  },
  attachments: {
    get path () {
      const cwd = Config.cwd;
      return cwd ? path.join ( cwd, 'attachments' ) : undefined;
    },
    globs: ['**/*', '!**/.*'],
    re: /attachments(?:\\|\/)(?!\.).*$/, // Excluding dot files
    token: '@attachment' // Usable in urls
  },
  notes: {
    get path () {
      const cwd = Config.cwd;
      return cwd ? path.join ( cwd, 'notes' ) : undefined;
    },
    globs: ['**/*.{md,mkd,mdwn,mdown,markdown,markdn,mdtxt,mdtext,txt}'],
    re: /\.(?:md|mkd|mdwn|mdown|markdown|markdn|mdtxt|mdtext|txt)$/,
    token: '@note' // Usable in urls
  },
  tags: {
    token: '@tag' // Usable in urls
  },
  sorting: {
    by: Settings.get ( 'sorting.by' ),
    type: Settings.get ( 'sorting.type' )
  },
  flags: {
    TUTORIAL: true, // Write the tutorial notes upon first instantiation
    OPTIMISTIC_RENDERING: true // Assume writes are successful in order to render changes faster
  },
  katex: {
    throwOnError: true,
    displayMode: false,
    errorColor: '#1500ff',
    delimilters: [
      { left: '¨D¨D', right: '¨D¨D', display: true }, // showdown converts `$$` to `¨D¨D`
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true },
      { left: '~', right: '~', display: false, asciimath: true },
      { left: '&&', right: '&&', display: true, asciimath: true }
    ]
  }
};

/* EXPORT */

export default Config;
