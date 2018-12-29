
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

  onEnterPressed (cm) {

    if (!options.enterAutoListIntent) {
      cm.execCommand("newlineAndIndent");
      return;
    }

    const unorderedPattern : RegExp = ( options.indentWithTabs ) ? /(\t+)?- / : /(\s+)?- /,
          orderedPattern : RegExp   = ( options.indentWithTabs ) ? /(\t+)?\d+. / : /(\s+)?\d+. /,
          lineNr : number           = cm.getCursor().line,
          line   : string           = cm.getLine(lineNr);

    if (line.match(unorderedPattern)) {
      
      // Unordered list
      const matches = unorderedPattern.exec( line );
      if (matches === null)
        return;
      
      Utils.handleListEnter(cm, line, lineNr, matches[0], "- ");

    } else if (line.match(orderedPattern)) {
      
      // Ordered list
      const matches = orderedPattern.exec( line );
      if (matches === null)
        return;

      let previous : string       = matches[0],
          previousNumber : number = +( previous.replace( /(^\d+)(.+$)/i,'$1' ) ),
          next : string           = ( previousNumber + 1 ) + ". ";
      
      Utils.handleListEnter( cm, line, lineNr, matches[0], next );
    
    } else {
      
      // Not in a list, so no need to do anything here
      cm.execCommand( "newlineAndIndent" );
    
    }
    
  },

  handleListEnter(cm, line : string, lineNr : number, start : string, next : string) {
    
    if ( line.trim() === start.trim() ) {

      cm.execCommand( "indentLess" );
      Utils.replace( cm, lineNr, "", 0, line.length );
    
    } else if ( line.startsWith(start) ) {
    
      cm.execCommand( "newlineAndIndent" );
      Utils.replace( cm, lineNr + 1, next, line.length );
    
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
