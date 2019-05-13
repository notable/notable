
/* IMPORT */

import {is} from 'electron-util';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* TOOLBAR */

const Toolbar = ({ isFullscreen }) => {

  if ( !is.macos || isFullscreen ) return null;

  return <div className="layout-header toolbar"></div>;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isFullscreen: container.window.isFullscreen ()
  })
})( Toolbar );
