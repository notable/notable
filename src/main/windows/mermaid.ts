
/* IMPORT */

import {BrowserWindowConstructorOptions, Menu, MenuItemConstructorOptions} from 'electron';
import * as is from 'electron-is';
import * as windowStateKeeper from 'electron-window-state';
import pkg from '@root/package.json';
import Environment from '@common/environment';
import UMenu from '@main/utils/menu';
import Route from './route';

/* MERMAID */

class Mermaid extends Route {

  /* VARIABLES */

  data: string;

  /* CONSTRUCTOR */

  constructor ( name = 'mermaid', options: BrowserWindowConstructorOptions = { frame: true, autoHideMenuBar: true, backgroundColor: '#ffffff', title: 'mermaid | Notable', titleBarStyle: 'default' }, stateOptions: windowStateKeeper.Options = {}, data: string ) {

    super ( name, options, stateOptions );

    this.data = data;

  }

  /* SPECIAL */

  initMenu () {

    const template: MenuItemConstructorOptions[] = UMenu.filterTemplate ([
      {
        label: pkg.productName,
        submenu: [
          { role: 'close' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
          {
            type: 'separator',
            visible: is.macOS ()
          },
          {
            label: 'Speech',
            submenu: [
              { role: 'startspeaking' },
              { role: 'stopspeaking' }
            ],
            visible: is.macOS ()
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            role: 'reload',
            visible: Environment.isDevelopment
          },
          {
            role: 'forcereload',
            visible: Environment.isDevelopment
          },
          {
            type: 'separator',
            visible: Environment.isDevelopment
          },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'close' },
          { role: 'minimize' },
          {
            role: 'zoom',
            visible: is.macOS ()
          },
          { type: 'separator' },
          {
            type: 'checkbox',
            label: 'Float on Top',
            checked: !!this.win && this.win.isAlwaysOnTop (),
            click: () => this.win.setAlwaysOnTop ( !this.win.isAlwaysOnTop () )
          },
          {
            type: 'separator',
            visible: is.macOS ()
          },
          {
            role: 'front',
            visible: is.macOS ()
          }
        ]
      }
    ]);

    const menu = Menu.buildFromTemplate ( template );

    Menu.setApplicationMenu ( menu );

  }

  /* LOAD */

  load () {

    this.win.loadURL ( this.data );

  }

}

/* EXPORT */

export default Mermaid;
