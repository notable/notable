
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Content from './content';
import Toolbar from './toolbar';

/* SIDEBAR */

const Sidebar = ({ isFocus, hasSidebar }) => {

  if ( isFocus || !hasSidebar ) return null;

  return (
    <div id="sidebar" className="layout">
      <Toolbar />
      <Content />
    </div>
  );

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isFocus: container.window.isFocus (),
    hasSidebar: container.window.hasSidebar ()
  })
})( Sidebar );
