
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* FOOTER */

const Footer = ({ select, selectDefault }) => (
  <div className="layout-footer toolbar">
    <div className="multiple fluid center-y">
      <div className="button default no-grow" onClick={selectDefault}>
        <span>Use Default</span>
        <span className="xsmall disabled">~/.notable</span>
      </div>
      <div className="spacer"></div>
      <div className="button no-grow accent" onClick={select}>Select</div>
    </div>
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    select: container.cwd.select,
    selectDefault: container.cwd.selectDefault
  })
})( Footer );
