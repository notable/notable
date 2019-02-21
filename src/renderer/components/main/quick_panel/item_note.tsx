
/* IMPORT */

import * as React from 'react';
import ItemRaw from './item_raw';

/* ITEM NOTE */

const ItemNote = ({ index, style, item }) => (
  <ItemRaw index={index} style={style} item={{ icon: 'note', title: item.metadata.title }} />
);

/* EXPORT */

export default ItemNote;
