
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON OPEN */

const OpenButton = ({ openInApp }) => (
  <ToolbarButton icon="open_in_new" title="Open in Default App" onClick={() => openInApp ()} />
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    openInApp: container.note.openInApp
  })
})( OpenButton );
