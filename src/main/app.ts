
/* IMPORT */

import {app, ipcMain as ipc} from 'electron';
import {autoUpdater} from 'electron-updater';
import * as is from 'electron-is';
import * as fs from 'fs';
import pkg from '@root/package.json';
import Config from '@common/config';
import Environment from '@common/environment';
import CWD from './windows/cwd';
import Main from './windows/main';
import Window from './windows/window';

/* APP */

class App {

  /* VARIABLES */

  win: Window;

  /* CONSTRUCTOR */

  constructor () {

    this.init ();
    this.events ();

  }

  /* SPECIAL */

  init () {

    this.initAbout ();
    this.initContextMenu ();

  }

  initAbout () {

    if ( !is.macOS () ) return;

    const {productName, version, license, author} = pkg;

    app.setAboutPanelOptions ({
      applicationName: productName,
      applicationVersion: version,
      copyright: `${license} © ${author.name}`,
      version: ''
    });

  }

  initContextMenu () {}

  async initDebug () {

    if ( !Environment.isDevelopment ) return;

    const {default: installExtension, REACT_DEVELOPER_TOOLS} = await import ( 'electron-devtools-installer' );

    installExtension ( REACT_DEVELOPER_TOOLS );

  }

  events () {

    this.___windowAllClosed ();
    this.___activate ();
    this.___ready ();
    this.___cwdChanged ();

  }

  /* WINDOW ALL CLOSED */

  ___windowAllClosed () {

    app.on ( 'window-all-closed', this.__windowAllClosed.bind ( this ) );

  }

  __windowAllClosed () {

    if ( is.macOS () ) return;

    app.quit ();

  }

  /* ACTIVATE */

  ___activate () {

    app.on ( 'activate', this.__activate.bind ( this ) );

  }

  __activate () {

    if ( this.win && this.win.win ) return;

    this.load ();

  }

  /* READY */

  ___ready () {

    app.on ( 'ready', this.__ready.bind ( this ) );

  }

  __ready () {

    this.initDebug ();

    autoUpdater.checkForUpdatesAndNotify ();

    this.load ();

  }

  /* CWD CHANGED */

  ___cwdChanged () {

    ipc.on ( 'cwd-changed', this.__cwdChanged.bind ( this ) );

  }

  __cwdChanged () {

    if ( this.win ) this.win.win.close ();

    this.load ();

  }

  /* API */

  load () {

    const cwd = Config.cwd;

    if ( cwd && fs.existsSync ( cwd ) ) {

      this.win = new Main ();

    } else {

      this.win = new CWD ();

    }

  }

}

/* EXPORT */

export default App;
