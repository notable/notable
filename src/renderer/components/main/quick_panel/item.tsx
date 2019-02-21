
/* IMPORT */

import * as React from 'react';
import ItemAttachment from './item_attachment';
import ItemNote from './item_note';
import ItemRaw from './item_raw';

/* ITEM */

const Item = ({ index, style, item }) => {
  if ( item.filePath ) {
    if ( item.metadata ) {
      return <ItemNote index={index} style={style} item={item} />;
    } else {
      return <ItemAttachment index={index} style={style} item={item} />;
    }
  }
  return <ItemRaw index={index} style={style} item={item} />;
};

/* EXPORT */

export default Item;
