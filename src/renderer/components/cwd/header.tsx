
/* IMPORT */

import * as React from 'react';
import * as is from 'electron-is';

/* HEADER */

const Header = () => {

  if ( !is.macOS () ) return null;

  return (
    <div className="layout-header centerer">
      <div className="title small">Select Data Directory</div>
    </div>
  );

};

/* EXPORT */

export default Header;
