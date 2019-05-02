
/* IMPORT */

import * as _ from 'lodash';
import {clipboard} from 'electron';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* PREVIEW PLUGINS */

class PreviewPlugins extends Component<{ container: IMain }, undefined> {

  /* SPECIAL */

  componentDidMount () {

    $.$document.on ( 'click', '.preview a.note', this.__noteClick );
    $.$document.on ( 'click', '.preview a.tag', this.__tagClick );
    $.$document.on ( 'click', '.preview input[type="checkbox"]', this.__checkboxClick );
    $.$document.on ( 'click', '.preview .copy', this.__copyClick );

  }

  componentWillUnmount () {

    $.$document.off ( 'click', this.__noteClick );
    $.$document.off ( 'click', this.__tagClick );
    $.$document.off ( 'click', this.__checkboxClick );
    $.$document.off ( 'click', this.__copyClick );

  }

  /* HANDLERS */

  __noteClick = ( event ) => {

    const filePath = $(event.currentTarget).removeData ( 'filepath' ).data ( 'filepath' ),
          note = this.props.container.note.get ( filePath );

    this.props.container.note.set ( note, true );

    return false;

  }

  __tagClick = ( event ) => {

    const tag = $(event.currentTarget).attr ( 'data-tag' );

    this.props.container.tag.set ( tag );

    return false;

  }

  __checkboxClick = ( event ) => {

    const $input = $(event.currentTarget),
          checked = $input.prop ( 'checked' ),
          nth = $input.removeData ( 'nth' ).data ( 'nth' );

    if ( !_.isNumber ( nth ) ) return;

    this.props.container.note.toggleCheckboxNth ( undefined, nth, checked );

  }

  __copyClick = ( event ) => {

    const $btn = $(event.currentTarget),
          $code = $btn.next ( 'pre' ).find ( 'code' );

    if ( !$code.length ) return;

    clipboard.writeText ( $code.text () );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( PreviewPlugins );
