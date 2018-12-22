
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import CWD from '@renderer/containers/cwd';

/* FOOTER */

const Footer = ({ select, selectDefault }) => (
  <div className="layout-footer container sharp">
    <div className="multiple center-y">
      <div className="button" onClick={selectDefault}>
        <span>Use Default</span>
        <span className="xsmall disabled">~/.notable</span>
      </div>
      <div className="spacer"></div>
      <div className="button secondary" onClick={select}>Select</div>
    </div>
  </div>
);

/* EXPORT */

export default connect ({
  container: CWD,
  selector: ({ container }) => ({
    select: container.select,
    selectDefault: container.selectDefault
  })
})( Footer );
