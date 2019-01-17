
/* IMPORT */

import * as _ from 'lodash';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* PREVIEW PLUGINS */

class PreviewPlugins extends Component<{ container: IMain }, undefined> {

  /* SPECIAL */

  componentDidMount () {

    $.$document.on ( 'click', '.editor.preview a.note', this.__noteClick );
    $.$document.on ( 'click', '.editor.preview a.tag', this.__tagClick );
    $.$document.on ( 'click', '.editor.preview input[type="checkbox"]', this.__checkboxClick );

  }

  componentWillUnmount () {

    $.$document.off ( 'click', this.__noteClick );
    $.$document.off ( 'click', this.__tagClick );
    $.$document.off ( 'click', this.__checkboxClick );

  }

  /* HANDLERS */

  __noteClick = ( event ) => {

    const filePath = $(event.currentTarget).data ( 'filepath' ),
          note = this.props.container.note.get ( filePath );

    this.props.container.note.set ( note, true );

    return false;

  }

  __tagClick = ( event ) => {

    const tag = $(event.currentTarget).data ( 'tag' );

    this.props.container.tag.set ( tag );

    return false;

  }

  __checkboxClick = ( event ) => {

    const $input = $(event.currentTarget),
          checked = $input.prop ( 'checked' ),
          index = $input.data ( 'index' );

    if ( !_.isNumber ( index ) ) return;

    this.props.container.note.toggleCheckboxAtIndex ( undefined, index, checked );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( PreviewPlugins );
