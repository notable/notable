
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

    $.$window.on ( 'resize', this.__update );
    $.$document.on ( 'layoutresizable:resize', this.__update );

    this._autosaveInterval = setInterval ( this.__autosave, 10000 );

  }

  componentWillUnmount () {

    $.$window.off ( 'resize', this.__update );
    $.$document.off ( 'layoutresizable:resize', this.__update );

    clearInterval ( this._autosaveInterval );

  }

  /* HANDLERS */

  __update = _.debounce ( () => {

    this.props.container.editor.update ();

  }, 25 )

  __autosave = () => {

    this.props.container.note.autosave ();

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( EditPlugins );
