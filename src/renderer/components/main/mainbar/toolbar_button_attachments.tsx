
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON ATTACHMENTS */

const AttachmentsButton = ({ isEditing, toggleEditing }) => {

  if ( !isEditing ) return <ToolbarButton id="popover-note-attachments-trigger" icon="paperclip" title="Edit Attachments" onClick={() => toggleEditing ()} />;

  return <ToolbarButton id="popover-note-attachments-trigger" icon="paperclip" title="Stop Editing Attachments" isActive={true} onClick={() => toggleEditing ()} />;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isEditing: container.attachments.isEditing (),
    toggleEditing: container.attachments.toggleEditing
  })
})( AttachmentsButton );
