
/* IMPORT */

import * as React from 'react';
import ItemRaw from './item_raw';

/* ITEM ATTACHMENT */

const ItemAttachment = ({ nth, style, item, isActive }) => (
  <ItemRaw nth={nth} style={style} item={{ icon: 'paperclip', title: item.fileName }} isActive={isActive} />
);

/* EXPORT */

export default ItemAttachment;
