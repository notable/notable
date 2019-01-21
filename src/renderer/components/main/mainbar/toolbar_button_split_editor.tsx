
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON SPLIT EDITOR */

const SplitEditorButton = ({ isSplit, toggleSplit }) => {

  if ( !isSplit ) return <ToolbarButton icon="split_view" title="Enter Split View Mode" onClick={() => toggleSplit ()} />;

  return <ToolbarButton icon="split_view" title="Exit Split View Mode" isActive={true} onClick={() => toggleSplit ()} />;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isSplit: container.editor.isSplit (),
    toggleSplit: container.editor.toggleSplit
  })
})( SplitEditorButton );
