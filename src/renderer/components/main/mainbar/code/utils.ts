
/* IMPORT */

import * as _ from 'lodash';
import Settings from '@common/settings';

/* UTILS */

const Utils = {

  initOptions ( options ) {

    options.lineWrapping = Settings.get ( 'codemirror.options.lineWrapping' );

  },

  toggleWrapping ( cm ) {

    const lineWrapping = !cm.getOption ( 'lineWrapping' );

    cm.setOption ( 'lineWrapping', lineWrapping );

    Settings.set ( 'codemirror.options.lineWrapping', lineWrapping );

  },

  addSelection ( cm, pos ) {

    cm.getDoc ().addSelection ( pos );

  },

  walkSelections ( cm, callback ) {

    cm.listSelections ().forEach ( selection => {

      const lineNr = Math.min ( selection.anchor.line, selection.head.line ),
            line = cm.getLine ( lineNr );

      callback ( line, lineNr );

    });

  },

  replace ( cm, lineNr, replacement, fromCh, toCh? ) {

    const from = { line: lineNr, ch: fromCh };

    if ( _.isUndefined ( toCh ) ) {

      cm.replaceRange ( replacement, from );

    } else {

      const to = { line: lineNr, ch: toCh };

      cm.replaceRange ( replacement, from, to );

    }

  }

};

/* EXPORT */

export default Utils;
