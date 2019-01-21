
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import PopoverNoteAttachments from '@renderer/components/main/popovers/popover_note_attachments';
import PopoverTagsAttachments from '@renderer/components/main/popovers/popover_note_tags';
import Editor from './editor';
import MultiEditor from './multi_editor';
import SplitEditor from './split_editor';
import Toolbar from './toolbar';

/* MAINBAR */

const Mainbar = ({ isMultiEditing, isSplit }) => (
  <div id="mainbar" className="layout">
    { isMultiEditing ? (
      <MultiEditor />
    ) : (
      <>
        <PopoverNoteAttachments />
        <PopoverTagsAttachments />
        <Toolbar />
        {isSplit ? <SplitEditor /> : <Editor />}
      </>
    )}
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isMultiEditing: container.multiEditor.isEditing (),
    isSplit: container.editor.isSplit ()
  })
})( Mainbar );

