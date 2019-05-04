
/* IMPORT */

import * as React from 'react';
import {createElement} from 'react';

/* IDLE */

//TODO: Publish as `react-idle-render`

class Idle extends React.Component<{ children: React.FC, timeout?: number }, {}> {

  _idleId = null;

  shouldComponentUpdate () {

    this.requestIdle ();

    return false;

  }

  requestIdle = () => {

    if ( this._idleId ) window['cancelIdleCallback']( this._idleId );

    this._idleId = window['requestIdleCallback']( this.update, { timeout: this.props.timeout || 1000 } );

  }

  update = () => {

    this.forceUpdate ();

  }

  render () {

    return createElement ( this.props.children );

  }

}

/* EXPORT */

export default Idle;
