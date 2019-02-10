
/* IMPORT */

import * as is from 'electron-is';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Search from './toolbar_search';
import NewButton from './toolbar_button_new';

/* TOOLBAR */

const Toolbar = ({ hasSidebar }) => (
  <div id="middlebar-toolbar" className="layout-header centerer">
    <div className="multiple grow">
      {hasSidebar || !is.macOS () ? null : (
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
    hasSidebar: container.window.hasSidebar ()
  })
})( Toolbar );
