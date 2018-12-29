
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import MainContainer from '@renderer/containers/main';
import Mainbar from './mainbar';
import Middlebar from './middlebar';
import Sidebar from './sidebar';
import ContextMenu from './extra/context_menu';
import IPC from './extra/ipc';
import PreviewPlugins from './extra/preview_plugins';
import Shortcuts from './extra/shortcuts';
import Wrapper from './wrapper';

/* MAIN */

class Main extends React.Component<any, undefined> {

  /* SPECIAL */

  async componentDidMount () {

    if ( this.props.loading ) {

      await this.props.refresh ();

    }

    await this.props.listen ();

  }

  /* RENDER */

  render () {

    return (
      <>
        <ContextMenu />
        <IPC />
        <PreviewPlugins />
        <Shortcuts />
        <Wrapper>
          <Sidebar />
          <Middlebar />
          <Mainbar />
        </Wrapper>
      </>
    );

  }

}

/* EXPORT */

export default connect ({
  container: MainContainer,
  selector: ({ container }) => ({
    listen: container.listen,
    refresh: container.refresh,
    loading: container.loading.get ()
  })
})( Main );
