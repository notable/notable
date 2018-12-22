
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* TAG */

const Tag = ({ icon, iconCollapsed, tag, name = tag, counter, isActive, isCollapsed, hasChildren, showIfEmpty, set }) => {

  if ( !showIfEmpty && !counter ) return null;

  const onClick = isActive ? _.noop : () => set ( tag );

  icon = isCollapsed ? iconCollapsed || 'tag_multiple' : icon || 'tag';

  return (
    <div className={`tag ${isActive ? 'label active' : 'button'} small fluid compact circular`} title={name} data-tag={tag} data-has-children={hasChildren} data-collapsed={isCollapsed} onClick={onClick}>
      <i className="icon">{icon}</i>
      <span className="name">{name}</span>
      {!counter ? null : (
        <span className="counter">{counter}</span>
      )}
    </div>
  );

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, icon, iconCollapsed, showIfEmpty, tag, name = tag }) => ({
    icon, iconCollapsed, showIfEmpty, tag, name,
    counter: container.tag.getNotes ( tag ).length,
    isActive: ( container.tag.get ().path === tag ),
    isCollapsed: container.tag.isCollapsed ( tag ),
    hasChildren: container.tag.hasChildren ( tag ),
    set: container.tag.set
  })
})( Tag );
