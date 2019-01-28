
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import MainContainer from '@renderer/containers/main';
import Layout from './layout';
import Mainbar from './mainbar';
import Middlebar from './middlebar';
import Sidebar from './sidebar';
import ContextMenu from './extra/context_menu';
import EditPlugins from './extra/edit_plugins';
import GlobalPlugins from './extra/global_plugins';
import IPC from './extra/ipc';
import PreviewPlugins from './extra/preview_plugins';
import Shortcuts from './extra/shortcuts';

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
        <EditPlugins />
        <GlobalPlugins />
        <IPC />
        <PreviewPlugins />
        <Shortcuts />
        <Layout id="main" className="app-wrapper" direction="horizontal" resizable={true} isFocus={this.props.isFocus}>
          <Sidebar />
          <Middlebar />
          <Mainbar />
        </Layout>
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
    loading: container.loading.get (),
    isFocus: container.window.isFocus ()
  })
})( Main );
