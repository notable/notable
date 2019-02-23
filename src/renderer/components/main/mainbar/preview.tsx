
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Markdown from '@renderer/utils/markdown';
import Main from '@renderer/containers/main';

/* PREVIEW */

const Preview = ({ content }) => {

  const html = Markdown.render ( content );

  return <div className="layout-content preview markdown-body" dangerouslySetInnerHTML={{ __html: html }}></div>;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, content }) => ({
    content: content || container.note.getPlainContent ()
  })
})( Preview );
