
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

    set: ( state: EditorEditingState ): boolean => {

      if ( !state.view ) return false;

      const {monaco} = this.state;

      if ( !monaco ) return false;

      if ( state.model && state.model !== monaco.getModel () ) {

        monaco.setModel ( state.model );

      }

      monaco.restoreViewState ( state.view );

      return true;

    },

    save: () => {

      this.editingState.state = this.editingState.get ();

    },

    restore: (): boolean => {

      if ( !this.editingState.state ) return false;

      const note = this.ctx.note.get ();

      if ( !note ) return false;

      if ( this.editingState.state.model && note.plainContent !== this.editingState.state.model.getValue () ) this.editingState.state.model = null;

      if ( note.filePath !== this.editingState.state.filePath && ( !this.editingState.state.model || note.plainContent !== this.editingState.state.model.getValue () ) ) return false;

      return this.editingState.set ( this.editingState.state );

    },

    reset: (): boolean => {

      const {monaco} = this.state;

      if ( !monaco ) return false;

      const position0 = {
        lineNumber: 0,
        column: 0
      };

      const view = {
        contributionsState: {},
        cursorState: [{
          inSelectionMode: false,
          selectionStart: position0,
          position: position0
        }],
        viewState: {
          scrollLeft: 0,
          firstPosition: position0,
          firstPositionDeltaTop: Infinity // Ensuring we are scrolling to the very top, important in zen mode
        }
      };

      const model = monaco.getModel ()

      if ( model ) { // Selecting the title on empty/new notes

        const content = monaco.getValue (),
              match = content.match ( /^(\s*#*\s)(.*)(\s*)$/ );

        if ( match ) {

          const start = model.getPositionAt ( match[1].length ),
                end = model.getPositionAt ( match[1].length + match[2].length );

          view.viewState.firstPosition = start;

          view.cursorState = [{
            inSelectionMode: true,
            selectionStart: start,
            position: end
          }];

        }

      }

      return this.editingState.set ({
        filePath: '',
        model: null,
        view
      });

    },

    forget: () => {

      delete this.editingState.state;

    },

    focus: (): boolean => {

      const {monaco} = this.state;

      if ( !monaco ) return false;

      monaco.focus ();

      return true;

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

    set: async ( state: EditorPreviewingState ): Promise<boolean> => {

      const $preview = await Utils.qsaWait ( '.preview' );

      if ( !$preview ) return false;

      $preview[0].scrollTop = state.scrollTop;

      return true;

    },

    save: () => {

      this.previewingState.state = this.previewingState.get ();

    },

    restore: (): Promise<boolean> => {

      const note = this.ctx.note.get ();

      if ( !note || !this.previewingState.state || note.filePath !== this.previewingState.state.filePath ) return Promise.resolve ( false );

      return this.previewingState.set ( this.previewingState.state );

    },

    reset: (): Promise<boolean> => {

      return this.previewingState.set ({
        filePath: '',
        scrollTop: 0
      });

    },

    forget: () => {

      delete this.previewingState.state;

    }

  }

  /* HELPERS */

  _getSelectedText = (): string => {

    const {monaco} = this.state;

    if ( !monaco ) return '';

    const model = monaco.getModel (),
          selections = monaco.getSelections ();

    if ( !model || !selections || !selections.length ) return '';

    return selections.map ( selection => model.getValueInRange ( selection ) ).join ( '\n' );

  }

  _replaceSelectedText = ( text: string, onlyFirst: boolean = false ): void => {

    const {monaco} = this.state;

    if ( !monaco ) return;

    const model = monaco.getModel (),
          selections = monaco.getSelections ();

    if ( !model || !selections || !selections.length ) return;

    for ( let i = 0, l = selections.length; i < l; i++ ) {

      monaco.executeEdits ( '', [{
        text,
        range: selections[i],
        forceMoveMarkers: true
      }]);

      if ( onlyFirst ) break;

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

      this.ctx.note.autosave ();

    }

    return this.setState ({ editing });

  }

  isSplit = (): boolean => {

    return this.state.split;

  }

  toggleSplit = ( split: boolean = !this.state.split ) => {

    const editing = split ? true : this._prevSplitEditing;

    if ( split ) this._prevSplitEditing = this.isEditing (); // Saving editing state

    this.editingState.save ();
    this.previewingState.save ();

    if ( !split ) this.ctx.note.autosave ();

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

  getData = (): { filePath: string, content: string, modified?: Date } | undefined => {

    const {monaco} = this.state;

    if ( !monaco || !monaco.getModel () ) return;

    return {
      filePath: monaco.getFilePath (),
      content: monaco.getValue (),
      modified: monaco.getChangeDate ()
    };

  }

  cut = (): void => {

    this.copy ();

    this._replaceSelectedText ( '' );

    this.editingState.focus ();

  }

  copy = (): void => {

    this.ctx.clipboard.set ( this._getSelectedText () );

    this.editingState.focus ();

  }

  paste = (): void => {

    this._replaceSelectedText ( this.ctx.clipboard.get (), true );

    this.editingState.focus ();

  }

}

/* EXPORT */

export default Editor;
