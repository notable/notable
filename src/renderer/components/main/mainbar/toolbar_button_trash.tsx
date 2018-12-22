
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON TRASH */

const TrashButton = ({ isDeleted, toggleDeleted, del }) => {

  if ( !isDeleted ) return <ToolbarButton icon="delete" title="Move to Trash" onClick={() => toggleDeleted ()} />;

  return <ToolbarButton icon="delete_restore" title="Restore" onClick={() => toggleDeleted ()} />;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isDeleted: container.note.isDeleted (),
    toggleDeleted: container.note.toggleDeleted
  })
})( TrashButton );
