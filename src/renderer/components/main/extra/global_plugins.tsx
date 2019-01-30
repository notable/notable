
/* IMPORT */

import {ipcRenderer as ipc} from 'electron';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Config from '@common/config';
import Main from '@renderer/containers/main';

/* GLOBAL PLUGINS */

class GlobalPlugins extends Component<{ container: IMain }, undefined> {

  /* VARIABLES */

  _updaterTimeout: NodeJS.Timeout;
  _updaterInterval: NodeJS.Timeout;

  /* SPECIAL */

  componentDidMount () {

    if ( Config.autoupdate ) {

      this._updaterTimeout = setTimeout ( this.__updaterCheck, 1000 );
      this._updaterInterval = setInterval ( this.__updaterCheck, 86400000 );

    }

  }

  componentWillUnmount () {

    clearTimeout ( this._updaterTimeout );
    clearInterval ( this._updaterInterval );

  }

  /* HANDLERS */

  __updaterCheck = () => {

    ipc.send ( 'updater-check' );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( GlobalPlugins );
