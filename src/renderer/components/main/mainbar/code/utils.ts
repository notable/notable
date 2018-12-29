
/* IMPORT */
import * as _ from 'lodash';
import Settings from '@common/settings';
import { options } from '.';

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

  async onEnterPressed (cm) {
    
    // Get the setting
    const enabled = Settings.get( 'enterAutoListIntent' );

    // TODO: This doesn't work :( 
    // If not enabled, don't do anything.    
    if (!enabled)
      return;

    // Check if we currently are in a list. 
    const unorderdSym : string  = "- ";
    const lineNr : number = cm.getCursor().line;
    let line : string = cm.getLine(lineNr); // minus one because we moved to the next line already.


    // TODO: When I press enter and the line hasn't changed, 
    // I should I should undo the indent
    // This failes when no content is given because of the trim
    if (line.trim().startsWith(unorderdSym)) {
      // this makes sure the enter actually works.
      // I think there should be a way to do the default, but I don't know how.
      await cm.execCommand("newlineAndIndent");
      // cm.replaceRange(unorderdSym, {line: lineNr + 1, ch: line.length});
      Utils.replace(cm, lineNr + 1, unorderdSym, line.length);
    } else if (line.startsWith(unorderdSym) || line.startsWith(" ".repeat(options.indentUnit) + unorderdSym)) {
      await cm.execCommand("indentLess");
      Utils.replace(cm, lineNr, "", 0, line.length);
    } else {
      await cm.execCommand("newlineAndIndent");
    }
    
  },

  addSelection ( cm, pos ) {
    cm.getDoc ().addSelection ( pos );

  },

  focus ( cm ) {

    cm.focus ();
    cm.setCursor ({ line: 0, ch: 0 });

  },

  walkSelections ( cm, callback ) {

    cm.listSelections ().forEach ( selection => {

      const lineNr = Math.min ( selection.anchor.line, selection.head.line ),
            line = cm.getLine ( lineNr );

      callback ( line, lineNr );

    });

  },
  // Utils.replace ( cm, lineNr, lineNext, 0, line.length );
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
