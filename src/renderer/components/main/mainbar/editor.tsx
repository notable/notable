
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import EditorEditing from './editor_editing';
import EditorEmpty from './editor_empty';
import EditorPreview from './editor_preview';

/* EDITOR */

const Editor = ({ hasNote, isEditing }) => {

  if ( !hasNote ) return <EditorEmpty />;

  if ( isEditing ) return <EditorEditing />;

  return <EditorPreview />;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    hasNote: !!container.note.get (),
    isEditing: container.editor.isEditing ()
  })
})( Editor );
