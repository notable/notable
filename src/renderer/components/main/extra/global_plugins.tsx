
/* IMPORT */

import * as _ from 'lodash';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* GLOBAL PLUGINS */

class GlobalPlugins extends Component<{ container: IMain }, undefined> {

  /* VARIABLES */

  _exitCaught = false;

  /* SPECIAL */

  componentDidMount () {

    $.$window.on ( 'beforeunload', this.__beforeUnload );

  }

  componentWillUnmount () {

    $.$window.off ( 'beforeunload', this.__beforeUnload );

  }

  /* HANDLERS */

  __beforeUnload = async ( event ) => {

    if ( this._exitCaught ) return window.close (); // Closing again, just to be sure

    if ( window['__bypass_beforeunload__'] ) return delete window['__bypass_beforeunlaod__']; // Needed for reloading the window

    event.returnValue = false; // Preventing the event

    this._exitCaught = true; // Ensuring the next time the window will be closed

    await this.props.container.note.autosave ();

    setTimeout ( window.close, 0 ); // Deferring or it won't work

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( GlobalPlugins );
