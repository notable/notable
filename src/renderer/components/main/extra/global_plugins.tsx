
/* IMPORT */

import {ipcRenderer as ipc} from 'electron';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Config from '@common/config';
import Main from '@renderer/containers/main';

/* GLOBAL PLUGINS */

class GlobalPlugins extends Component<{ container: IMain }, {}> {

  /* VARIABLES */

  _updaterTimeout?: NodeJS.Timeout;
  _updaterInterval?: NodeJS.Timeout;

  /* SPECIAL */

  componentDidMount () {

    if ( Config.autoupdate ) {

      this._updaterTimeout = setTimeout ( this.__updaterCheck, 1000 );
      this._updaterInterval = setInterval ( this.__updaterCheck, 86400000 );

    }

    $.$document.on ( 'click', '.quick-panel .list-item', this.__quickPanelClick );

  }

  componentWillUnmount () {

    if ( this._updaterTimeout ) clearTimeout ( this._updaterTimeout );
    if ( this._updaterInterval ) clearInterval ( this._updaterInterval );

    $.$document.off ( 'click', this.__quickPanelClick );

  }

  /* HANDLERS */

  __updaterCheck = () => {

    ipc.send ( 'updater-check' );

  }

  __quickPanelClick = ( event ) => {

    const nth = $(event.currentTarget).data ( 'nth' );

    this.props.container.quickPanel.openNth ( nth );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( GlobalPlugins );
