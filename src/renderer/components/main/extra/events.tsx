
/* IMPORT */

import * as _ from 'lodash';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* EVENTS */

class Events extends Component<{ container: IMain }, undefined> {

  /* SPECIAL */

  componentDidMount () {

    $.$document.on ( 'click', '#quick-panel .item', this.__quickPanelClick );

  }

  componentWillUnmount () {

    $.$document.off ( 'click', this.__quickPanelClick );

  }

  /* HANDLERS */

  __quickPanelClick = ( event ) => {

    const nth = $(event.currentTarget).data ( 'nth' );

    this.props.container.quickPanel.openNth ( nth );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( Events );
