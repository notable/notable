
/* IMPORT */

import * as React from 'react';
import ItemAttachment from './item_attachment';
import ItemNote from './item_note';
import ItemRaw from './item_raw';

/* ITEM */

const Item = ({ nth, style, item, isActive }) => {
  if ( item.filePath ) {
    if ( item.metadata ) {
      return <ItemNote nth={nth} style={style} item={item} isActive={isActive} />;
    } else {
      return <ItemAttachment nth={nth} style={style} item={item} isActive={isActive} />;
    }
  }
  return <ItemRaw nth={nth} style={style} item={item} isActive={isActive} />;
};

/* EXPORT */

export default Item;
