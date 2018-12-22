
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* ATTACHMENT */

const Attachment = ({ removeAttachment, attachment, name, openInApp }) => (
  <div className="attachment button circular gray xsmall" data-filename={name} onClick={() => openInApp ( attachment )}>
    <span>{name}</span>
    <i className="icon actionable small" onClick={e => { e.stopPropagation (); removeAttachment ( undefined, attachment || {fileName: name} ); }}>close</i>
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, name }) => ({
    name,
    openInApp: container.attachment.openInApp,
    attachment: container.attachment.get ( name ),
    removeAttachment: container.note.removeAttachment
  })
})( Attachment );
