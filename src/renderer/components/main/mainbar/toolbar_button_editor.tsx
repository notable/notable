
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON EDITOR */

const EditorButton = ({ isEditing, toggleEditing }) => {

  if ( !isEditing ) return <ToolbarButton icon="pencil" title="Edit" onClick={() => toggleEditing ()} />;

  return <ToolbarButton icon="pencil" title="Stop Editing" isActive={true} onClick={() => toggleEditing ()} />;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isEditing: container.editor.isEditing (),
    toggleEditing: container.editor.toggleEditing
  })
})( EditorButton );
