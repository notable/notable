
/* IMPORT */

import {app, ipcMain as ipc, globalShortcut} from 'electron';
import {autoUpdater} from 'electron-updater';
import * as is from 'electron-is';
import * as fs from 'fs';
import Config from '@common/config';
import Environment from '@common/environment';
import CWD from './windows/cwd';
import Main from './windows/main';
import Window from './windows/window';
import Settings from '@common/settings';

/* APP */

class App {

  /* VARIABLES */

  win: Window;
  globalToggleShortcut: String;

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

  /* Global Shortcut */

  __registerGlobalToggleShortcut () {

    const accelerator = Settings.get ( 'keybindings.globalToggleWindow' );

    if ( this.globalToggleShortcut && globalShortcut.isRegistered( this.globalToggleShortcut ) ) {

      globalShortcut.unregister( this.globalToggleShortcut );

    }

    if ( accelerator ) {

      globalShortcut.register( accelerator, () => {

        if ( this.win.win.isVisible () && this.win.win.isFocused () ) this.win.win.hide ();

        else {

          if ( this.win.win.isMinimized () ) this.win.win.restore ();

          this.win.win.show ();

        }

      });

      this.globalToggleShortcut = accelerator;

    }

  }

  /* API */

  load () {

    const cwd = Config.cwd;

    if ( cwd && fs.existsSync ( cwd ) ) {

      this.win = new Main ();

      this.__registerGlobalToggleShortcut ();

    } else {

      this.win = new CWD ();

    }

  }

}

/* EXPORT */

export default App;
