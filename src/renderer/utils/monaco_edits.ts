
/* IMPORT */

import * as _ from 'lodash';
import * as diff from 'diff';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

/* EDITS */

const Edits = {

  apply ( editor: MonacoEditor, edits: monaco.editor.IIdentifiedSingleEditOperation[] ): boolean {

    return editor.executeEdits ( '', edits );

  },

  makeEdit ( range: monaco.Range, text: string, forceMoveMarkers: boolean = false ): monaco.editor.IIdentifiedSingleEditOperation {

    return { range, text, forceMoveMarkers };

  },

  makeReplace ( before: string, after: string, lineNr: number = 0 ): monaco.editor.IIdentifiedSingleEditOperation[] { // We are diffing `before` and `after`, instead of replacing `before` with `after` naively, in order to avoid having the cursors move unnecessarily

    if ( before === after ) return [];

    const changes = diff.diffWordsWithSpace ( before, after );

    let index = 1;

    return _.filter ( changes.map ( change => {
      if ( change.added ) {
        return Edits.makeInsert ( lineNr, index, change.value );
      } else if ( change.removed ) {
        const edit = Edits.makeDelete ( lineNr, index, index + change.value.length );
        index += change.value.length;
        return edit;
      } else {
        index += change.value.length;
      }
    })) as monaco.editor.IIdentifiedSingleEditOperation[]; //TSC

  },

  makeDelete ( lineNr: number, fromCh: number, toCh: number = fromCh ): monaco.editor.IIdentifiedSingleEditOperation {

    const range = new monaco.Range ( lineNr, fromCh, lineNr, toCh );

    return Edits.makeEdit ( range, '' );

  },

  makeInsert ( lineNr: number, charNr: number, text: string ): monaco.editor.IIdentifiedSingleEditOperation {

    const range = new monaco.Range ( lineNr, charNr, lineNr, charNr );

    return Edits.makeEdit ( range, text, true );

  }

};

/* EXPORT */

export default Edits;
