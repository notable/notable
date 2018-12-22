
/* IMPORT */

import * as path from 'path';
import {format as formatURL} from 'url';
import Environment from '@common/environment';
import Window from './window';

/* ROUTE */

class Route extends Window {

  /* API */

  load () {

    const route = this.name;

    if ( Environment.isDevelopment ) {

      const {protocol, hostname, port} = Environment.wds;

      this.win.loadURL ( `${protocol}://${hostname}:${port}?route=${route}` );

    } else {

      this.win.loadURL ( formatURL ({
        pathname: path.join ( __dirname, 'index.html' ),
        protocol: 'file',
        slashes: true,
        query: {
          route
        }
      }));

    }

  }

}

/* EXPORT */

export default Route;
