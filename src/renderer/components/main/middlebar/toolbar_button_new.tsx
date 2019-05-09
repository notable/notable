
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* TOOLBAR */

const NewButton = ({ noteNew }) => (
  <div className="button bordered xsmall" title="New Note" onClick={() => noteNew ()}>
    <i className="icon">plus</i>
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false,
  selector: ({ container }) => ({
    noteNew: container.note.new
  })
})( NewButton );
