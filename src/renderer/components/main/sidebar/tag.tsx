
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* TAG */

const Tag = ({ style, tag, level, isLeaf, isActive, set, toggleCollapse }) => {

  const {name, path, collapsed, notes, icon, iconCollapsed} = tag,
        isRoot = ( level === 0 ),
        onClick = isActive ? _.noop : () => set ( path ),
        onCollapserClick = e => {
          e.stopPropagation ();
          toggleCollapse ( path );
        };

  return (
    <div style={style} className={`tag ${isActive ? 'active' : ''} level-${level} button list-item`} data-tag={path} data-has-children={!isLeaf} data-collapsed={collapsed} onClick={onClick}>
      {isRoot ? <i className="icon xsmall">{collapsed ? iconCollapsed || 'tag_multiple' : icon || 'tag'}</i> : null}
      {!isRoot && ( !isLeaf || collapsed ) ? <i className={`icon xsmall collapser ${collapsed ? 'rotate--90' : ''}`} onClick={onCollapserClick}>chevron_down</i> : null} {/* TODO: The collapser isn't animated because the whole list gets re-rendered */}
      {!isRoot && ( isLeaf && !collapsed ) ? <i className="icon xsmall">invisible</i> : null}
      <span className="title small">{name}</span>
      {notes.length ? <span className="counter xxsmall">{notes.length}</span> : null}
    </div>
  );

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, style, itemKey, level, isLeaf }) => {

    const tag = container.tag.get ( itemKey );

    return ({
      tag, style, level, isLeaf,
      isActive: container.tag.get () === tag,
      set: container.tag.set,
      toggleCollapse: container.tag.toggleCollapse
    });

  }
})( Tag );
