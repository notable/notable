
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Layout from '@renderer/components/main/layout';
import EditorEditing from './editor_editing';
import EditorPreview from './editor_preview';
import SplitEditorEmpty from './split_editor_empty';

/* SPLIT EDITOR */

const SplitEditor = ({ hasNote, isLoading, isFocus }) => {

  if ( isLoading || !hasNote ) return <SplitEditorEmpty />;

  return (
    <Layout id="split-editor" className="split-editor" direction="horizontal" resizable={true} isFocus={isFocus}>
      <EditorEditing />
      <EditorPreview />
    </Layout>
  );

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    hasNote: !!container.note.get (),
    isLoading: container.loading.get (),
    isFocus: container.window.isFocus ()
  })
})( SplitEditor );
