
/* IMPORT */

import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* PREVIEW PLUGINS */

class PreviewPlugins extends Component<{ container: IMain }, undefined> {

  /* SPECIAL */

  componentDidMount () {

    $.$document.on ( 'click', '.editor.preview a.note', this.__noteClick );
    $.$document.on ( 'click', '.editor.preview a.tag', this.__tagClick );

  }

  componentWillUnmount () {

    $.$document.off ( 'click', this.__noteClick );
    $.$document.off ( 'click', this.__tagClick );

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

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( PreviewPlugins );
