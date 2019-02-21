
/* IMPORT */

import * as React from 'react';
import List from './list';

/* FIXED LIST */

const FixedList = ( props ) => (
  <List {...props} isFixed={true} />
);

/* EXPORT */

export default FixedList;
