
/* IMPORT */

import {app, ipcMain as ipc, Event, Menu, MenuItemConstructorOptions, shell} from 'electron';
import {autoUpdater as updater} from 'electron-updater';
import * as is from 'electron-is';
import * as fs from 'fs';
import pkg from '@root/package.json';
import Config from '@common/config';
import Environment from '@common/environment';
import Notification from '@main/utils/notification';
import UMenu from '@main/utils/menu';
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
    this.initMenu ();

  }

  initContextMenu () {}

  initMenu () {

    const template: MenuItemConstructorOptions[] = UMenu.filterTemplate ([
      {
        label: pkg.productName,
        submenu: [
          {
            label: 'Open',
            accelerator: 'CmdOrCtrl+O',
            click: this.load.bind ( this )
          },
          { role: 'quit' }
        ]
      }
    ]);

    const menu = Menu.buildFromTemplate ( template );

    Menu.setApplicationMenu ( menu );

  }

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

  ___windowAllClosed = () => {

    app.on ( 'window-all-closed', this.__windowAllClosed );

  }

  __windowAllClosed = () => {

    if ( is.macOS () ) return this.initMenu ();

    this.quit ();

  }

  /* ACTIVATE */

  ___activate = () => {

    app.on ( 'activate', this.__activate );

  }

  __activate = () => {

    if ( this.win && this.win.win ) return;

    this.load ();

  }

  /* BEFORE QUIT */

  ___beforeQuit = () => {

    app.on ( 'before-quit', this.__beforeQuit );

  }

  ___beforeQuit_off = () => {

    app.removeListener ( 'before-quit', this.__beforeQuit );

  }

  __beforeQuit = ( event ) => {

    if ( !this.win || !this.win.win ) return;

    event.preventDefault ();

    this.win.win.webContents.send ( 'app-quit' );

  }

  /* FORCE QUIT */

  ___forceQuit = () => {

    ipc.on ( 'force-quit', this.__forceQuit );

  }

  __forceQuit = () => {

    this.quit ();

  }

  /* READY */

  ___ready = () => {

    app.on ( 'ready', this.__ready );

  }

  __ready = () => {

    this.initDebug ();

    this.load ();

  }

  /* CWD CHANGED */

  ___cwdChanged = () => {

    ipc.on ( 'cwd-changed', this.__cwdChanged );

  }

  __cwdChanged = () => {

    if ( this.win && this.win.win ) {

      this.win.win.once ( 'closed', this.load.bind ( this ) );

      this.win.win.close ();

    } else {

      this.load ();

    }

  }

  /* UPDATER CHECK */

  ___updaterCheck = () => {

    ipc.on ( 'updater-check', this.__updaterCheck );

  }

  __updaterCheck = async ( notifications: Event | boolean = false ) => {

    updater.removeAllListeners ();

    if ( notifications === true ) {

      updater.on ( 'update-available', () => Notification.show ( 'A new update is available', 'Downloading it right now...' ) );
      updater.on ( 'update-not-available', () => Notification.show ( 'No update is available', 'You\'re already using the latest version' ) );
      updater.on ( 'error', err => {
        Notification.show ( 'An error occurred', err.message );
        Notification.show ( 'Update manually', 'Download the new version manually to update the app' );
        shell.openExternal ( pkg['download'].url );
      });

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

    this.win.init ();

  }

  quit () {

    app['isQuitting'] = true;

    this.___beforeQuit_off ();

    app.quit ();

  }

}

/* EXPORT */

export default App;
