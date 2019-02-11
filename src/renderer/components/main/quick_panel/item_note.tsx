
/* IMPORT */

import * as React from 'react';
import ItemRaw from './item_raw';

/* ITEM NOTE */

const ItemNote = ({ nth, style, item, isActive }) => (
  <ItemRaw nth={nth} style={style} item={{ icon: 'note', title: item.metadata.title }} isActive={isActive} />
);

/* EXPORT */

export default ItemNote;
