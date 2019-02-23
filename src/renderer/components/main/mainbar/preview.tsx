
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Markdown from '@renderer/utils/markdown';
import Main from '@renderer/containers/main';
import Idle from '@renderer/components/main/idle';

/* PREVIEW */

const Preview = ({ content }) => (
  <Idle timeout={150}>
    {() => {
      const html = Markdown.render ( content );
      return <div className="layout-content preview markdown-body" dangerouslySetInnerHTML={{ __html: html }}></div>;
    }}
  </Idle>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, content }) => ({
    content: content || container.note.getPlainContent ()
  })
})( Preview );
