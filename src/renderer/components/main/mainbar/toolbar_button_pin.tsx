
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON PIN */

const PinButton = ({ isPinned, togglePin }) => {

  if ( !isPinned ) return <ToolbarButton icon="pin_outline" title="Pin" onClick={() => togglePin ()} />

  return <ToolbarButton icon="pin" title="Unpin" isActive={true} onClick={() => togglePin ()} />;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isPinned: container.note.isPinned (),
    togglePin: container.note.togglePin
  })
})( PinButton );
