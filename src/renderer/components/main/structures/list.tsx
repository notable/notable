
/* IMPORT */

import * as React from 'react';
import Tree from './tree';

/* LIST */

const List = ( props ) => (
  <Tree {...props} isFlat={true} />
);

/* EXPORT */

export default List;
