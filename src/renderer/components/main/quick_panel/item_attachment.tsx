
/* IMPORT */

import * as React from 'react';
import ItemRaw from './item_raw';

/* ITEM ATTACHMENT */

const ItemAttachment = ({ index, style, item }) => (
  <ItemRaw index={index} style={style} item={{ icon: 'paperclip', title: item.fileName }} />
);

/* EXPORT */

export default ItemAttachment;
