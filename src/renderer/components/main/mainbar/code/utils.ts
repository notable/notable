
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
      Utils.newLineAndIndent(cm);
      return;
    }

    const unorderedListItemPattern : RegExp = ( options.indentWithTabs ) ? /^\t*[-\+\*] / : /^\s*[-\+\*] /,
          orderedListItemPattern : RegExp   = ( options.indentWithTabs ) ? /^\t*\d+. / : /^\s*\d+. /,
          todoListItemPattern : RegExp      = ( options.indentWithTabs ) ? /^\t*- \[[\sxX]\] / : /^\s*- \[[\sxX]\] /,
          lineNr : number           = cm.getCursor().line,
          line   : string           = cm.getLine(lineNr);

    if (line.match(todoListItemPattern)) {
      const matches = todoListItemPattern.exec( line );
      if (matches === null)
        return;

      Utils.handleListEnter(cm, line, lineNr, matches[0], "- [ ] ");

    } else if (line.match(unorderedListItemPattern)) {

      const matches = unorderedListItemPattern.exec( line );
      if (matches === null)
        return;

      Utils.handleListEnter(cm, line, lineNr, matches[0], matches[0]);

    } else if (line.match(orderedListItemPattern)) {

      const matches = orderedListItemPattern.exec( line );
      if (matches === null)
        return;

      let previousNumber : number = +( matches[0].replace( /(^\d+)(.+$)/i,'$1' ) ),
      nextListItemMarker : string     = ( previousNumber + 1 ) + ". ";

      Utils.handleListEnter( cm, line, lineNr, matches[0], nextListItemMarker );

    } else {

      // Not in a list, so no need to do anything here
      Utils.newLineAndIndent(cm);

    }
  },

  /**
   * Smart handling of Enter presses in a list.
   * Behaviour is as follows:
   * When Enter is pressed:
   * - If the list item is not empty, add a new list item
   * - If the list item is empty - decrease its indent
   * - If the list item is empty and not indented - terminate the list
   */
  handleListEnter(cm, line : string, lineNr : number, currentListItemMarker : string, nextListItemMarker : string) {

    if ( line.trim() === currentListItemMarker.trim() ) { // list item is empty
      if (line.startsWith(currentListItemMarker.trim())) { // list item is not indented
        Utils.discardLineContent(cm, lineNr);
      } else {
        Utils.indentLess(cm);
      }
    } else { // list item has content
      Utils.newLineAndIndent(cm);
      Utils.append(cm, lineNr + 1, nextListItemMarker);
    }

  },

  newLineAndIndent(cm) {
    cm.execCommand( "newlineAndIndent" );
  },

  indentLess(cm) {
    cm.execCommand( "indentLess" );
  },

  append(cm, lineNr : number, stringToAppend : string) {
    Utils.replace( cm, lineNr, stringToAppend, cm.getLine(lineNr).length );
  },

  discardLineContent(cm, lineNr) {
    Utils.replace( cm, lineNr, "", 0, cm.getLine(lineNr).length );
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
