
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* TAG */

const Tag = ({ tag, set, removeTag }) => (
  <div className="tag button list-item" data-tag={tag} onClick={() => set ( tag )}>
    <span className="title small">{tag}</span>
    <i className="icon xxsmall actionable on-hover" onClick={e => { e.stopPropagation (); removeTag ( undefined, tag ); }}>close</i>
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, item }) => ({
    tag: item,
    set: container.tag.set,
    removeTag: container.note.removeTag
  })
})( Tag );
