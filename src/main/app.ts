
/* IMPORT */

import {app, ipcMain as ipc, Event} from 'electron';
import {autoUpdater as updater} from 'electron-updater';
import * as is from 'electron-is';
import * as fs from 'fs';
import Config from '@common/config';
import Environment from '@common/environment';
import Notification from '@main/utils/notification';
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

    this.initContextMenu ();

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
    this.___beforeQuit ();
    this.___forceQuit ();
    this.___ready ();
    this.___cwdChanged ();
    this.___updaterCheck ();

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

  /* BEFORE QUIT */

  ___beforeQuit () {

    app.on ( 'before-quit', this.__beforeQuit.bind ( this ) );

  }

  ___beforeQuit_off () {

    app.removeAllListeners ( 'before-quit' );

  }

  __beforeQuit ( event ) {

    if ( !this.win || !this.win.win ) return;

    event.preventDefault ();

    this.win.win.webContents.send ( 'app-quit' );

  }

  /* FORCE QUIT */

  ___forceQuit () {

    ipc.on ( 'force-quit', this.__forceQuit.bind ( this ) );

  }

  __forceQuit () {

    this.___beforeQuit_off ();

    app.quit ();

  }

  /* READY */

  ___ready () {

    app.on ( 'ready', this.__ready.bind ( this ) );

  }

  __ready () {

    this.initDebug ();

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

  /* UPDATER CHECK */

  ___updaterCheck () {

    ipc.on ( 'updater-check', this.__updaterCheck.bind ( this ) );

  }

  async __updaterCheck ( notifications: Event | boolean = false ) {

    if ( notifications === true ) {

      updater.removeAllListeners ();
      updater.on ( 'update-available', () => Notification.show ( 'A new update is available', 'Downloading it right now...' ) );
      updater.on ( 'update-not-available', () => Notification.show ( 'No update is available', 'You\'re already using the latest version' ) );
      updater.on ( 'error', err => Notification.show ( 'An error occurred', err.message ) );

    }

    updater.checkForUpdatesAndNotify ();

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
