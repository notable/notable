
/* IMPORT */

import * as _ from 'lodash';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* EDIT PLUGINS */

class EditPlugins extends Component<{ container: IMain }, undefined> {

  /* VARIABLES */

  _autosaveInterval: NodeJS.Timeout;

  /* SPECIAL */

  componentDidMount () {

    this._autosaveInterval = setInterval ( this.__autosave, 10000 );

  }

  componentWillUnmount () {

    clearInterval ( this._autosaveInterval );

  }

  /* HANDLERS */

  __autosave = () => {

    this.props.container.note.autosave ();

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( EditPlugins );
