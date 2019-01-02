
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import MainContainer from '@renderer/containers/main';
import Utils from '@renderer/utils/utils';

/* WRAPPER */

class Wrapper extends React.Component<any, any> {

  _layoutDimensions;

  async update () {

    const $children = await Utils.qsaWait ( '.app-wrapper > .layout' );

    if ( !$children ) return;

    const $layout = $children.parent ();

    if ( this.props.isFocus ) {

      this._layoutDimensions = $layout.layoutResizable ( 'getDimensions' );

      $layout.layoutResizable ( 'destroy' );

    } else {

      $layout.layoutResizable ( 'destroy' ).layoutResizable ();

      if ( this._layoutDimensions ) $layout.layoutResizable ( 'setDimensions', this._layoutDimensions );

    }

  }

  componentDidMount () {

    this.update ();

  }

  componentDidUpdate () {

    this.update ();

  }

  render () {

    return (
      <div id="main" className="app-wrapper layout horizontal resizable">{this.props.children}</div>
    );

  }

}

/* DEFAULT */

export default connect ({
  container: MainContainer,
  selector: ({ children, container }) => ({
    children,
    isFocus: container.window.isFocus ()
  })
})( Wrapper );
