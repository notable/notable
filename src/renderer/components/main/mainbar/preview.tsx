
/* IMPORT */

import * as React from 'react';
import Idle from 'react-idle-render';
import {connect} from 'overstated';
import Markdown from '@renderer/utils/markdown';
import Main from '@renderer/containers/main';

/* PREVIEW */

const Preview = ({ content }) => (
  <Idle timeout={150}>
    {() => {
      const html = Markdown.render ( content );
      return <div className="layout-content preview" dangerouslySetInnerHTML={{ __html: html }}></div>;
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
