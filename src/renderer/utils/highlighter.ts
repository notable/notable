
/* IMPORT */

import * as _ from 'lodash';
import * as Prism from 'prismjs';
import {languages} from 'prismjs/components.js';

/* HIGHLIGHTER */

const Highlighter = {

  languageRe: /language-([^\s"']*)/i,

  inferLanguage ( str: string ): string | undefined {

    if ( !str ) return;

    const match = str.match ( Highlighter.languageRe );

    if ( !match ) return;

    return match[1];

  },

  initLanguage ( language: string ): boolean { // Loading needed languages dynamically, for performance and because WebPack complains about the included `loadLanguages` function //TODO: Add support for peerDependencies

    if ( Prism.languages[language] ) return true;

    const lang = languages[language];

    if ( !lang ) return false;

    if ( lang.require && !_.castArray ( lang.require ).every ( Highlighter.initLanguage ) ) return false;

    require ( `prismjs/components/prism-${language}.min.js` );

    return true;

  },

  highlight ( str: string, language?: string ): string {

    if ( !language || !Highlighter.initLanguage ( language ) ) return str;

    return Prism.highlight ( str, Prism.languages[language], language );

  }

};

/* EXPORT */

export default Highlighter;
