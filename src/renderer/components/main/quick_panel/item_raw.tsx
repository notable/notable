
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* ITEM RAW */

const ItemRaw = ({ index = -1, style = {}, item, isActive, isEmpty }) => (
  <div className={`list-item ${isActive ? 'active' : ''} ${isEmpty ? 'empty' : ''} button`} style={style} data-nth={index}>
    {item.icon ? <i className="icon xsmall">{item.icon}</i> : null}
    <span className="title small">{item.title}</span>
    {item.description ? <span className="description xxsmall">{item.description}</span> : null}
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, index, style, item, isEmpty }) => ({ //TODO: upon first nativation the item passed here is shallowly equal to the previous one, but it's not he same object, why? who is cloning it?
    index, style, item, isEmpty,
    isActive: container.quickPanel.getItemIndex () === index
  })
})( ItemRaw );
