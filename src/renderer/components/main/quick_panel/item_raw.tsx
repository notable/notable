
/* IMPORT */

import * as React from 'react';

/* ITEM RAW */

const ItemRaw = ({ nth, style, item, isActive }) => (
  <div className={`item ${isActive ? 'active' : ''}`} style={style} data-nth={nth}>{item.icon ? <i className="icon xsmall">{item.icon}</i> : null}{item.title}{item.description ? <span className="description">{item.description}</span> : null}</div>
);

/* EXPORT */

export default ItemRaw;
