
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import * as is from 'electron-is';
import {connect} from 'overstated';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import Main from '@renderer/containers/main';
import UMonaco from '@renderer/utils/monaco';
import 'monaco-editor/esm/vs/basic-languages/apex/apex.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/azcli/azcli.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/bat/bat.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/clojure/clojure.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/coffee/coffee.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/csp/csp.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/fsharp/fsharp.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/go/go.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/graphql/graphql.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/handlebars/handlebars.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/ini/ini.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/less/less.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/lua/lua.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/msdax/msdax.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/objective-c/objective-c.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/pascal/pascal.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/perl/perl.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/pgsql/pgsql.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/php/php.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/postiats/postiats.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/powerquery/powerquery.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/powershell/powershell.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/pug/pug.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/r/r.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/razor/razor.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/redis/redis.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/redshift/redshift.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/rust/rust.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/sb/sb.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/scheme/scheme.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/scss/scss.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/shell/shell.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/solidity/solidity.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/st/st.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/swift/swift.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/tcl/tcl.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/vb/vb.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js';

/* MONACO */

class Monaco extends React.Component<{ language: string, theme: string, value: string, editorOptions?: monaco.editor.IEditorOptions, modelOptions?: monaco.editor.ITextModelUpdateOptions, className?: string, editorWillMount?: Function, editorDidMount?: Function, editorWillUnmount?: Function, editorDidUnmount?: Function, onBlur?: Function, onFocus?: Function, onChange?: Function, onUpdate?: Function, onScroll?: Function }, {}> {

  /* VARIABLES */

  ref = React.createRef () as any; //TSC
  editor: MonacoEditor;
  _currentValue: string = '';
  _currentChangeDate: Date | undefined = undefined;
  _onChangeDebounced: Function;
  _preventOnChangeEvent: boolean = false;
  _zoneTopId: number;

  defaultEditorOptions: monaco.editor.IEditorOptions = {
    accessibilitySupport: 'off',
    colorDecorators: false,
    contextmenu: false,
    copyWithSyntaxHighlighting: false,
    dragAndDrop: true,
    folding: false,
    fontSize: 16 * .875,
    hideCursorInOverviewRuler: true,
    highlightActiveIndentGuide: false,
    hover: {
      enabled: false
    },
    iconsInSuggestions: false,
    lightbulb: {
      enabled: false
    },
    lineDecorationsWidth: 5,
    lineHeight: 16 * .875 * 1.5,
    lineNumbers: 'off',
    minimap: {
      enabled: false
    },
    occurrencesHighlight: false,
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    renderIndentGuides: false,
    roundedSelection: false,
    scrollbar: {
      useShadows: false,
      horizontalScrollbarSize: 10,
      verticalScrollbarSize: 10
    },
    scrollBeyondLastColumn: 0,
    scrollBeyondLastLine: false,
    snippetSuggestions: 'none',
    wordWrap: 'bounded',
    wordWrapColumn: 1000000,
    wordWrapMinified: false,
    wrappingIndent: 'same'
  };

  defaultModelOptions: monaco.editor.ITextModelUpdateOptions = {
    insertSpaces: true,
    tabSize: 2,
    trimAutoWhitespace: true
  };

  /* LIFECYCLE */

  componentWillMount () {

    UMonaco.init ();

    if ( this.props.onChange ) {
      this._onChangeDebounced = _.debounce ( this.props.onChange as any, 25 ); //TSC
    }

    this._currentChangeDate = undefined;

    $.$window.on ( 'resize', this.editorUpdateDebounced );
    $.$document.on ( 'layoutresizable:resize', this.editorUpdateDebounced );

  }

  componentDidMount () {

    this._currentValue = this.props.value;

    this.initMonaco ();

  }

  componentDidUpdate ( prevProps ) {

    this.editorUpdate ();

    if ( this.props.value !== this._currentValue ) {

      this._currentValue = this.props.value;

      if ( this.editor ) {

        this._preventOnChangeEvent = true;

        this.editor.setValue ( this._currentValue );

        if ( this.props.onUpdate ) {

          this.props.onUpdate ();

        }

        this._preventOnChangeEvent = false;

      }

    }

    if ( prevProps.language !== this.props.language ) {

      const model = this.editor.getModel ();

      if ( model ) {

        monaco.editor.setModelLanguage ( model, this.props.language );

      }

    }

    if ( prevProps.theme !== this.props.theme ) {

      monaco.editor.setTheme ( this.props.theme );

    }

    if ( this.props.editorOptions && !_.isEqual ( prevProps.editorOptions, this.props.editorOptions ) ) {

      this.editor.updateOptions ( this.props.editorOptions );

    }

    if ( this.props.modelOptions && !_.isEqual ( prevProps.modelOptions, this.props.modelOptions ) ) {

      const model = this.editor.getModel ();

      if ( model ) {

        model.updateOptions ( this.props.modelOptions );

      }

    }

  }

  componentWillUnmount () {

    $.$window.off ( 'resize', this.editorUpdateDebounced );
    $.$document.off ( 'layoutresizable:resize', this.editorUpdateDebounced );

    this.destroyMonaco ();

  }

  shouldComponentUpdate ( nextProps ) {

    this.editorUpdate ( nextProps );

    return nextProps.value !== this._currentValue;

  }

  /* EDITOR LIFECYCLE */

  editorWillMount () {

    const {editorWillMount} = this.props;

    if ( !editorWillMount ) return;

    return editorWillMount ( monaco );

  }

  editorDidMount ( editor: MonacoEditor ) {

    const {editorDidMount, editorDidUnmount, onBlur, onFocus, onChange, onScroll} = this.props;

    if ( editorDidMount ) {

      editorDidMount ( editor, monaco );

    }

    if ( onBlur ) {

      editor.onDidBlurEditorWidget ( onBlur as any ); //TSC

    }

    if ( onFocus ) {

      editor.onDidFocusEditorWidget ( onFocus as any ); //TSC

    }

    if ( onScroll ) {

      editor.onDidScrollChange ( _.debounce ( onScroll as any, 25 ) ); //TSC

    }

    if ( editorDidUnmount ) {

      editor.onDidDispose ( editorDidUnmount as any ); //TSC

    }

    editor.onDidChangeModelContent ( event => {

      const value = editor.getValue ();

      this._currentValue = value;
      this._currentChangeDate = new Date ();

      if ( onChange && !this._preventOnChangeEvent ) {

        this._onChangeDebounced ( value, event );

      }

    });

  }

  editorUpdate = ( props = this.props ) => {

    if ( !this.editor ) return;

    this.editor.layout ();
    this.editorUpdateZones ( props );

  }

  editorUpdateDebounced = _.debounce ( () => this.editorUpdate (), 25 )

  editorUpdateZones = ( props = this.props ) => {

    const needTopZone = is.macOS () && props['isZen'] && !props['isFullscreen']; //UGLY

    if ( needTopZone ) {

      if ( this._zoneTopId ) return;

      this.editor.changeViewZones ( accessor => {
        this._zoneTopId = accessor.addZone ({
          domNode: document.createElement ( 'div' ),
          afterLineNumber: 0,
          heightInPx: 38,
          suppressMouseDown: true
        });
      });

    } else {

      if ( !this._zoneTopId ) return;

      this.editor.changeViewZones ( accessor => {
        accessor.removeZone ( this._zoneTopId );
        delete this._zoneTopId;
      });

    }

  }

  /* MONACO LIFECYCLE */

  initMonaco () {

    const {language, theme, value, editorOptions, modelOptions} = this.props,
          dynamicOptions = this.editorWillMount ();

    this.editor = monaco.editor.create ( this.ref.current, { ...this.defaultEditorOptions, ...( editorOptions || {} ), ...( dynamicOptions || {} ), model: null } ) as any; //TSC //UGLY

    this.editor.getChangeDate = () => this._currentChangeDate; //UGlY

    if ( theme ) {

      monaco.editor.setTheme ( theme );

    }

    const model = monaco.editor.createModel ( value, language );

    if ( model ) {

      model.updateOptions ({ ...this.defaultModelOptions, ...( modelOptions || {} ) });

    }

    this.editor.setModel ( model );

    this.editorUpdateZones ();

    this.editorDidMount ( this.editor );

  }

  destroyMonaco () {

    if ( this.props.editorWillUnmount ) {

      this.props.editorWillUnmount ();

    }

    if ( !this.editor ) return;

    this.editor.dispose ();

    delete this.editor;

  }

  /* RENDER */

  render () {

    const {className} = this.props;

    return <div ref={this.ref} className={`monaco-editor-wrapper ${className || ''}`} />;

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, ...others }) => ({
    ...others,
    isFocus: container.window.isFocus (),
    isFullscreen: container.window.isFullscreen (),
    isSplit: container.editor.isSplit (),
    isZen: container.window.isZen (),
    hasSidebar: container.window.hasSidebar ()
  })
})( Monaco );
