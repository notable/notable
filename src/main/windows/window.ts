
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import {BrowserWindow, BrowserWindowConstructorOptions} from 'electron';
import * as is from 'electron-is';
import * as windowStateKeeper from 'electron-window-state';
import pkg from '@root/package.json';
import Environment from '@common/environment';

/* WINDOW */

class Window {

  /* VARIABLES */

  name: string;
  win: BrowserWindow = {} as BrowserWindow; //TSC
  options: BrowserWindowConstructorOptions;
  stateOptions: windowStateKeeper.Options;
  _didFocus: boolean = false;

  /* CONSTRUCTOR */

  constructor ( name: string, options: BrowserWindowConstructorOptions = {}, stateOptions: windowStateKeeper.Options = {} ) {

    this.name = name;
    this.options = options;
    this.stateOptions = stateOptions;

  }

  /* SPECIAL */

  init () {

    this.initWindow ();
    this.initDebug ();
    this.initLocalShortcuts ();
    this.initMenu ();

    this.load ();
    this.events ();

  }

  initWindow () {

    this.win = this.make ();

  }

  initDebug () {

    if ( !Environment.isDevelopment ) return;

    this.win.webContents.openDevTools ({
      mode: 'undocked'
    });

    this.win.webContents.on ( 'devtools-opened', () => {

      this.win.focus ();

      setImmediate ( () => this.win.focus () );

    });

  }

  initMenu () {}

  initLocalShortcuts () {}

  events () {

    this.___didFinishLoad ();
    this.___closed ();
    this.___focused ();

  }

  cleanup () {

    this.win.removeAllListeners ();

  }

  /* READY TO SHOW */

  ___didFinishLoad = () => {

    this.win.webContents.on ( 'did-finish-load', this.__didFinishLoad );

  }

  __didFinishLoad = () => {

    if ( this._didFocus ) return;

    this.win.show ();
    this.win.focus ();

  }

  /* CLOSED */

  ___closed = () => {

    this.win.on ( 'closed', this.__closed );

  }

  __closed = () => {

    this.cleanup ();

    delete this.win;

  }

  /* FOCUSED */

  ___focused = () => {

    this.win.on ( 'focus', this.__focused );

  }

  __focused = () => {

    this._didFocus = true;

    this.initMenu ();

  }

  /* API */

  make ( id = this.name, options = this.options, stateOptions = this.stateOptions ) {

    stateOptions = _.merge ({
      file: `${id}.json`,
      defaultWidth: 600,
      defaultHeight: 600
    }, stateOptions );

    const state = windowStateKeeper ( stateOptions ),
          dimensions = _.pick ( state, ['x', 'y', 'width', 'height'] );

    options = _.merge ( dimensions, {
      frame: !is.macOS (),
      backgroundColor: '#F4F4F4',
      icon: path.join ( __static, 'images', `icon.${is.windows () ? 'ico' : 'png'}` ),
      show: false,
      title: pkg.productName,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      }
    }, options );

    const win = new BrowserWindow ( options );

    state.manage ( win );

    return win;

  }

  load () {}

}

/* EXPORT */

export default Window;
