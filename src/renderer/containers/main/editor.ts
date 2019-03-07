
/* IMPORT */

import * as _ from 'lodash';
import {Container, autosuspend} from 'overstated';
import Utils from '@renderer/utils/utils';

/* EDITOR */

class Editor extends Container<EditorState, MainCTX> {

  /* VARIABLES */

  _prevSplitEditing = false;

  /* STATE */

  state = {
    monaco: undefined as MonacoEditor | undefined,
    editing: false,
    split: false
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* VIEW STATE */

  editingState = {

    state: undefined as EditorEditingState | undefined,

    get: (): EditorEditingState | undefined => {

      const {monaco} = this.state,
            note = this.ctx.note.get ();

      if ( !monaco || !note ) return;

      const model = monaco.getModel (),
            view = monaco.saveViewState ();

      if ( view && view.viewState.firstPositionDeltaTop === 0 ) {
        view.viewState.firstPositionDeltaTop = Infinity; // Ensuring we are scrolling to the very top, important in zen mode
      }

      return {
        filePath: note.filePath,
        model,
        view
      };

    },

    set: async ( state: EditorEditingState ) => {

      if ( !state.view ) return;

      const {monaco} = this.state;

      if ( !monaco ) return;

      if ( state.model && state.model !== monaco.getModel () ) {

        monaco.setModel ( state.model );

      }

      monaco.restoreViewState ( state.view );

    },

    save: () => {

      this.editingState.state = this.editingState.get ();

    },

    restore: () => {

      const note = this.ctx.note.get ();

      if ( !note || !this.editingState.state || note.filePath !== this.editingState.state.filePath ) return;

      if ( this.editingState.state.model && note.plainContent !== this.editingState.state.model.getValue () ) this.editingState.state.model = null;

      this.editingState.set ( this.editingState.state );

    },

    reset: () => {

      this.editingState.set ({
        filePath: '',
        model: null,
        view: {
          contributionsState: {},
          cursorState: [{
            inSelectionMode: false,
            selectionStart: {
              lineNumber: 0,
              column: 0
            },
            position: {
              lineNumber: 0,
              column: 0
            }
          }],
          viewState: {
            scrollLeft: 0,
            firstPosition: {
              lineNumber: 0,
              column: 0
            },
            firstPositionDeltaTop: Infinity // Ensuring we are scrolling to the very top, important in zen mode
          }
        }
      });

    },

    forget: () => {

      delete this.editingState.state;

    },

    focus: () => {

      const {monaco} = this.state;

      if ( !monaco ) return;

      monaco.focus ();

    }

  }

  previewingState = {

    state: undefined as EditorPreviewingState | undefined,

    get: (): EditorPreviewingState | undefined => {

      const $preview = $('.preview'),
            note = this.ctx.note.get ();

      if ( !$preview.length || !note ) return;

      return {
        filePath: note.filePath,
        scrollTop: $preview[0].scrollTop
      };

    },

    set: async ( state: EditorPreviewingState ) => {

      const $preview = await Utils.qsaWait ( '.preview' );

      if ( !$preview ) return;

      $preview[0].scrollTop = state.scrollTop;

    },

    save: () => {

      this.previewingState.state = this.previewingState.get ();

    },

    restore: () => {

      const note = this.ctx.note.get ();

      if ( !note || !this.previewingState.state || note.filePath !== this.previewingState.state.filePath ) return;

      this.previewingState.set ( this.previewingState.state );

    },

    reset: () => {

      this.previewingState.set ({
        filePath: '',
        scrollTop: 0
      });

    },

    forget: () => {

      delete this.previewingState.state;

    }

  }

  /* API */

  isEditing = (): boolean => {

    return this.state.editing;

  }

  toggleEditing = ( editing: boolean = !this.state.editing ) => {

    if ( this.isSplit () ) return;

    if ( editing ) {

      this.previewingState.save ();
      this.editingState.restore ();

    } else {

      this.editingState.save ();
      this.previewingState.restore ();

    }

    return this.setState ({ editing });

  }

  isSplit = (): boolean => {

    return this.state.split;

  }

  toggleSplit = ( split: boolean = !this.state.split ) => {

    const editing = split ? true : this._prevSplitEditing;

    if ( split ) this._prevSplitEditing = this.isEditing (); // Saving editing state

    return this.setState ({ editing, split });

  }

  hasFocus = (): boolean => {

    const {monaco} = this.state;

    return !!monaco && ( monaco.hasTextFocus () || monaco.hasWidgetFocus () );

  }

  getMonaco = (): MonacoEditor | undefined => {

    return this.state.monaco;

  }

  setMonaco = ( monaco?: MonacoEditor ) => {

    return this.setState ({ monaco });

  }

  getData = (): { content: string, modified?: Date } | undefined => {

    const {monaco} = this.state;

    if ( !monaco || !monaco.getModel () ) return;

    return {
      content: monaco.getValue (),
      modified: monaco.getChangeDate ()
    };

  }

}

/* EXPORT */

export default Editor;
