
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Layout from '@renderer/components/main/layout';
import EditorEditing from './editor_editing';
import EditorPreview from './editor_preview';
import SplitEditorEmpty from './split_editor_empty';

/* SPLIT EDITOR */

class SplitEditor extends React.PureComponent<any, any> {

  state = {
    content: undefined as string | undefined
  };

  __change = _.debounce ( ( cm, pos, content ) => {

    this.setState ({ content });

  }, 25 )

  render () {

    const {hasNote, isLoading, isFocus, hasSidebar} = this.props;

    if ( isLoading || !hasNote ) return <SplitEditorEmpty />;

    const content = _.isString ( this.state.content ) ? this.state.content : this.props.content;

    return (
      <Layout id="split-editor" className="split-editor" direction="horizontal" resizable={true} isFocus={isFocus} hasSidebar={hasSidebar}>
        <EditorEditing onChange={this.__change} />
        <EditorPreview content={content} />
      </Layout>
    );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    content: container.note.getPlainContent (),
    hasNote: !!container.note.get (),
    isLoading: container.loading.get (),
    isFocus: container.window.isFocus (),
    hasSidebar: container.window.hasSidebar ()
  })
})( SplitEditor );
