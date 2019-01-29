
/* IMPORT */

import * as _ from 'lodash';
import asciimath2tex from 'asciimath2tex/asciimath2tex.js';

/* ASCIIMATH */

const AsciiMath = {

  getParser: _.memoize ( () => {

    return new asciimath2tex ();

  }),

  toTeX ( str: string ): string {

    const Parser = AsciiMath.getParser ();

    return Parser.parse ( str );

  }

};

/* EXPORT */

export default AsciiMath;
