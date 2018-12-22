
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON TRASH PERMANENTLY */

const TrashPermanentlyButton = ({ isDeleted, del }) => {

  if ( !isDeleted ) return null;

  return <ToolbarButton icon="delete_forever" title="Permanently Delete" color="red inverted" onClick={() => del ()} />;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isDeleted: container.note.isDeleted (),
    del: container.note.delete
  })
})( TrashPermanentlyButton );
