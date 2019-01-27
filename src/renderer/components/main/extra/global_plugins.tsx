
/* IMPORT */

import * as _ from 'lodash';
import {ipcRenderer as ipc} from 'electron';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Config from '@common/config';
import Main from '@renderer/containers/main';

/* GLOBAL PLUGINS */

class GlobalPlugins extends Component<{ container: IMain }, undefined> {

  /* VARIABLES */

  _exitCaught = false;
  _updaterTimeout: NodeJS.Timeout;
  _updaterInterval: NodeJS.Timeout;

  /* SPECIAL */

  componentDidMount () {

    $.$window.on ( 'beforeunload', this.__beforeUnload );

    if ( Config.autoupdate ) {

      this._updaterTimeout = setTimeout ( this.__updaterCheck, 1000 );
      this._updaterInterval = setInterval ( this.__updaterCheck, 86400000 );

    }

  }

  componentWillUnmount () {

    $.$window.off ( 'beforeunload', this.__beforeUnload );

    clearTimeout ( this._updaterTimeout );
    clearInterval ( this._updaterInterval );

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

  __updaterCheck = () => {

    ipc.send ( 'updater-check' );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( GlobalPlugins );
