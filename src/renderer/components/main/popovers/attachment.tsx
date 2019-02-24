
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* ATTACHMENT */

const Attachment = ({ removeAttachment, attachment, name, openInApp }) => {

  if ( !attachment ) return null;

  return (
    <div className="attachment button list-item" data-filename={name} onClick={() => openInApp ( attachment )}>
      <span className="title small">{name}</span>
      <i className="icon xxsmall actionable on-hover" onClick={e => { e.stopPropagation (); removeAttachment ( undefined, attachment || {fileName: name} ); }}>close</i>
    </div>
  );

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, item }) => ({
    name: item,
    openInApp: container.attachment.openInApp,
    attachment: container.attachment.get ( item ),
    removeAttachment: container.note.removeAttachment
  })
})( Attachment );
