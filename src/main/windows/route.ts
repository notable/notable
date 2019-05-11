
/* IMPORT */

import * as path from 'path';
import {format as formatURL} from 'url';
import Environment from '@common/environment';
import Settings from '@common/settings';
import Window from './window';

/* ROUTE */

class Route extends Window {

  /* API */

  load () {

    /* ROUTE */

    const route = this.name,
          theme = Settings.get ( 'theme' );

    if ( Environment.isDevelopment ) {

      const {protocol, hostname, port} = Environment.wds;

      this.win.loadURL ( `${protocol}://${hostname}:${port}?route=${route}&theme=${theme}` );

    } else {

      this.win.loadURL ( formatURL ({
        pathname: path.join ( __dirname, 'index.html' ),
        protocol: 'file',
        slashes: true,
        query: {
          route,
          theme
        }
      }));

    }

  }

}

/* EXPORT */

export default Route;
