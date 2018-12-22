
/* IMPORT */

import * as React from 'react';
import Utils from '@renderer/utils/utils';

/* WRAPPER */

class Wrapper extends React.Component<any, any> {

  async componentDidMount () {

    const $children = await Utils.qsaWait ( '.app-wrapper > .layout' );

    if ( !$children ) return;

    const $layout = $children.parent ();

    $layout.layoutResizable ();

  }

  render () {

    return (
      <div id="main" className="app-wrapper layout horizontal resizable">{this.props.children}</div>
    );

  }

}

/* DEFAULT */

export default Wrapper;
