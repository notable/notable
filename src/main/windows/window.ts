
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import {BrowserWindow} from 'electron';
import * as is from 'electron-is';
import * as windowStateKeeper from 'electron-window-state';
import pkg from '@root/package.json';
import Environment from '@common/environment';

/* WINDOW */

class Window {

  /* VARIABLES */

  name: string;
  win: BrowserWindow;
  options: object;
  stateOptions: object;

  /* CONSTRUCTOR */

  constructor ( name, options = {}, stateOptions = {} ) {

    this.name = name;
    this.options = options;
    this.stateOptions = stateOptions;

    this.init ();
    this.events ();

  }

  /* SPECIAL */

  init () {

    this.initWindow ();
    this.initDebug ();
    this.initLocalShortcuts ();
    this.initMenu ();
    this.load ();

  }

  initWindow () {

    this.win = this.make ();

  }

  initDebug () {

    if ( !Environment.isDevelopment ) return;

    this.win.webContents.openDevTools ();

    this.win.webContents.on ( 'devtools-opened', () => {

      this.win.focus ();

      setImmediate ( () => this.win.focus () );

    });

  }

  initMenu () {}

  initLocalShortcuts () {}

  events () {

    this.___readyToShow ();
    this.___closed ();

  }

  /* READY TO SHOW */

  ___readyToShow () {

    this.win.on ( 'ready-to-show', this.__readyToShow.bind ( this ) );

  }

  __readyToShow () {

    this.win.show ();
    this.win.focus ();

  }

  /* CLOSED */

  ___closed () {

    this.win.on ( 'closed', this.__closed.bind ( this ) );

  }

  __closed () {

    delete this.win;

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
      backgroundColor: '#fdfdfd',
      icon: path.join ( __static, 'images', `icon.${is.windows () ? 'ico' : 'png'}` ),
      show: false,
      title: pkg.productName,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
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
