
/* IMPORT */

import * as React from 'react';
import {createElement} from 'react';

/* IDLE */

//TODO: Publish as `react-idle-render`

class Idle extends React.Component<{ children: typeof React.Component | React.FunctionComponent<any>, timeout?: number }, {}> {

  /* VARIABLES */

  _idleId: number = 0;

  /* LIFECYCLE */

  componentWillMount () {

    this.requestIdle ();

  }

  componentWillUnmount () {

    if ( !this._idleId ) return;

    cancelIdleCallback ( this._idleId );

  }

  shouldComponentUpdate () {

    this.requestIdle ();

    return false;

  }

  /* IDLE */

  requestIdle = () => {

    if ( this._idleId ) return;

    this._idleId = requestIdleCallback ( () => this.setIdle (), { timeout: this.props.timeout || 1000 } );

  }

  setIdle = () => {

    delete this._idleId;

    this.forceUpdate ();

  }

  /* RENDER */

  render () {

    return createElement ( this.props.children );

  }

}

/* EXPORT */

export default Idle;
