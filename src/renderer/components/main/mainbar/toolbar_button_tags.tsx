
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON TAGS */

const TagsButton = ({ isEditing, toggleEditing }) => {

  if ( !isEditing ) return <ToolbarButton className="popover-note-tags-trigger" icon="tag" title="Edit Tags" onClick={() => toggleEditing ()} />;

  return <ToolbarButton className="popover-note-tags-trigger" icon="tag" title="Stop Editing Tags" isActive={true} onClick={() => toggleEditing ()} />;

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isEditing: container.tags.isEditing (),
    toggleEditing: container.tags.toggleEditing
  })
})( TagsButton );
