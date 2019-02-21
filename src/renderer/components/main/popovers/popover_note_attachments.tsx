
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import FixedList from '@renderer/components/main/structures/fixed_list';
import Attachment from './attachment'
import Popover from './popover';

/* POPOVER NOTE ATTACHMENTS */

const PopoverNoteAttachments = ({ addAttachments, attachments, isEditing, toggleEditing }) => (
  <Popover open={isEditing} onBeforeClose={() => _.defer ( () => toggleEditing ( false ) )} anchor="#popover-note-attachments-trigger">
    <FixedList id="popover-note-attachments-list" className="card-block" data={attachments} fallbackEmptyMessage="No attachments">{Attachment}</FixedList>
    <div className="card-footer button compact bordered small" onClick={() => addAttachments ()}>Add Attachments...</div>
  </Popover>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    note: container.note.get (),
    isEditing: container.attachments.isEditing (),
    toggleEditing: container.attachments.toggleEditing,
    attachments: container.note.getAttachments (),
    addAttachments: container.note.addAttachments
  })
})( PopoverNoteAttachments );
