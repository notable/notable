
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Layout from '@renderer/components/main/layout';
import Editor from './editor';
import Preview from './preview';

/* SPLIT EDITOR */

class SplitEditor extends React.PureComponent<any, any> {

  state = {
    content: undefined as string | undefined
  };

  __change = _.debounce ( content => {

    this.setState ({ content });

  }, 25 )

  render () {

    const {isFocus, isZen, hasSidebar} = this.props,
          content = _.isString ( this.state.content ) ? this.state.content : this.props.content;

    return (
      <Layout id="split-editor" className="split-editor" direction="horizontal" resizable={true} isFocus={isFocus} isZen={isZen} hasSidebar={hasSidebar}>
        <Editor onChange={this.__change} onUpdate={this.__change} />
        <Preview content={content} />
      </Layout>
    );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    content: container.note.getPlainContent (),
    isFocus: container.window.isFocus (),
    isZen: container.window.isZen (),
    hasSidebar: container.window.hasSidebar ()
  })
})( SplitEditor );
