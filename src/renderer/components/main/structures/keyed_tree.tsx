
/* IMPORT */

import * as React from 'react';
import Tree from './tree';

/* KEYED TREE */

const KeyedTree = ( props ) => (
  <Tree {...props} isKeyed={true} />
);

/* EXPORT */

export default KeyedTree;
