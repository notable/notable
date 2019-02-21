
/* IMPORT */

import * as is from 'electron-is';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Search from './toolbar_search';
import NewButton from './toolbar_button_new';

/* TOOLBAR */

const Toolbar = ({ isFullscreen, hasSidebar }) => (
  <div className="layout-header toolbar">
    <div className="multiple grow">
      {isFullscreen || hasSidebar || !is.macOS () ? null : (
        <div className="toolbar-semaphore-spacer"></div>
      )}
      <Search />
      <NewButton />
    </div>
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isFullscreen: container.window.isFullscreen (),
    hasSidebar: container.window.hasSidebar ()
  })
})( Toolbar );
