
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* TAG */

const Tag = ({ tag, set, removeTag }) => (
  <div className="tag button circular gray xsmall" data-tag={tag} onClick={() => set ( tag )}>
    <span>{tag}</span>
    <i className="icon actionable small" onClick={e => { e.stopPropagation (); removeTag ( undefined, tag ); }}>close</i>
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, tag }) => ({
    tag,
    set: container.tag.set,
    removeTag: container.note.removeTag
  })
})( Tag );
