
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import CWD from '@renderer/containers/cwd';

/* CONTENT */

const Content = ({ select }) => (
  <>
    <div className="layout-content container sharp centerer">
      <div className="button centered compact circular giant secondary z-depth-3" title="Select..." onClick={select}>
        <i className="icon">folder_search</i>
      </div>
    </div>
    <div className="layout-content container sharp details">
      <p>The data directory is where all notes and their attachments are stored.</p>
      <p>If you want synchronization across computers, or you want access to your data from mobile, consider putting the data directory inside Dropbox/Google Drive/etc.</p>
      <p>You can change this later.</p>
    </div>
  </>
);

/* EXPORT */

export default connect ({
  container: CWD,
  selector: ({ container }) => ({
    select: container.select
  })
})( Content );
