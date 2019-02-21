
/* IMPORT */

import * as React from 'react';
import List from './list';

/* KEYED LIST */

const KeyedList = ( props ) => (
  <List {...props} isKeyed={true} />
);

/* EXPORT */

export default KeyedList;
