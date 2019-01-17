
/* IMPORT */

import * as _ from 'lodash';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* EDIT PLUGINS */

class EditPlugins extends Component<{ container: IMain }, undefined> {

  /* SPECIAL */

  componentDidMount () {

    $.$window.on ( 'resize', this.__update );
    $.$document.on ( 'layoutresizable:resize', this.__update );

  }

  componentWillUnmount () {

    $.$window.off ( 'resize', this.__update );
    $.$document.off ( 'layoutresizable:resize', this.__update );

  }

  /* HANDLERS */

  __update = _.debounce ( () => {

    this.props.container.editor.update ();

  }, 50 )

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( EditPlugins );
