
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* STATUSBAR WORD COUNT */

const WordCount = ({ content }) => {
  return <div className="label" title="Word Count">{!!content ? content.match(/\S+/g).length : 0}</div>;
};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    content: container.note.getPlainContent()
  })
})( WordCount );
