
/* IMPORT */

import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* EDITOR PLUGINS */

class EditorPlugins extends Component<{}, {}> {

  /* SPECIAL */

  componentWillMount () {

    $.$window.on ( 'resize', this.__editorUpdate );
    $.$document.on ( 'layoutresizable:resize', this.__editorUpdate );

  }

  componentWillUnmount () {

    $.$window.off ( 'resize', this.__editorUpdate );
    $.$document.off ( 'layoutresizable:resize', this.__editorUpdate );

  }

  componentDidUpdate () {

    this.__editorUpdate ();

  }

  /* HANDLERS */

  __editorUpdate = () => {

    $.$window.trigger ( 'monaco:update' );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isFocus: container.window.isFocus (),
    isFullscreen: container.window.isFullscreen (),
    isSplit: container.editor.isSplit (),
    isZen: container.window.isZen (),
    hasSidebar: container.window.hasSidebar ()
  })
})( EditorPlugins );
