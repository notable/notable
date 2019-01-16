
/* IMPORT */

import * as _ from 'lodash';
import {ipcMain as ipc, Menu, MenuItemConstructorOptions, shell} from 'electron';
import * as is from 'electron-is';
import pkg from '@root/package.json';
import Environment from '@common/environment';
import UMenu from '@main/utils/menu';
import About from './about';
import Route from './route';

/* MAIN */

class Main extends Route {

  /* CONSTRUCTOR */

  constructor ( name = 'main', options = { minWidth: 685, minHeight: 425 }, stateOptions = { defaultWidth: 850, defaultHeight: 525 } ) {

    super ( name, options, stateOptions );

  }

  /* SPECIAL */

  initLocalShortcuts () {}

  initMenu ( flags: StateFlags | false = false ) {

    const template: MenuItemConstructorOptions[] = UMenu.filterTemplate ([
      {
        label: pkg.productName,
        submenu: [
          {
            label: `About ${pkg.productName}`,
            click: () => new About ()
          },
          {
            type: 'separator'
          },
          {
            label: 'Import...',
            click: () => this.win.webContents.send ( 'import' )
          },
          {
            type: 'separator'
          },
          {
            label: 'Open Data Directory',
            click: () => this.win.webContents.send ( 'cwd-open-in-app' )
          },
          {
            label: 'Change Data Directory...',
            click: () => this.win.webContents.send ( 'cwd-change' )
          },
          {
            type: 'separator'
          },
          {
            role: 'services',
            submenu: [] ,
            visible: is.macOS ()
          },
          {
            type: 'separator',
            visible: is.macOS ()
          },
          {
            role: 'hide',
            visible: is.macOS ()
          },
          {
            role: 'hideothers',
            visible: is.macOS ()
          },
          {
            role: 'unhide',
            visible: is.macOS ()
          },
          {
            type: 'separator',
            visible: is.macOS ()
          },
          { role: 'quit' }
        ]
      },
      {
        label: 'Note',
        submenu: [
          {
            label: 'New',
            accelerator: 'CommandOrControl+N',
            enabled: flags && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-new' )
          },
          {
            label: 'Duplicate',
            accelerator: 'CommandOrControl+Shift+N',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-duplicate' )
          },
          {
            type: 'separator'
          },
          {
            label: 'Open in Default App',
            accelerator: 'CommandOrControl+O',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-open-in-app' )
          },
          {
            label: `Reveal in ${is.macOS () ? 'Finder' : 'Folder'}`,
            accelerator: 'CommandOrControl+Alt+R',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-reveal' )
          },
          {
            type: 'separator'
          },
          {
            label: flags && flags.hasNote && flags.isEditorEditing ? 'Stop Editing' : 'Edit',
            accelerator: 'CommandOrControl+E',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-edit-toggle' )
          },
          {
            label: flags && flags.hasNote && flags.isTagsEditing ? 'Stop Editing Tags' : 'Edit Tags',
            accelerator: 'CommandOrControl+Shift+T',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-edit-tags-toggle' )
          },
          {
            label: flags && flags.hasNote && flags.isAttachmentsEditing ? 'Stop Editing Attachments' : 'Edit Attachments',
            accelerator: 'CommandOrControl+Shift+A',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-edit-attachments-toggle' )
          },
          {
            type: 'separator'
          },
          {
            label: flags && flags.hasNote && flags.isNoteFavorited ? 'Unfavorite' : 'Favorite',
            accelerator: 'CommandOrControl+D',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-favorite-toggle' )
          },
          {
            label: flags && flags.hasNote && flags.isNotePinned ? 'Unpin' : 'Pin',
            accelerator: 'CommandOrControl+P',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            click: () => this.win.webContents.send ( 'note-pin-toggle' )
          },
          {
            type: 'separator'
          },
          {
            label: 'Move to Trash',
            accelerator: 'CommandOrControl+Backspace',
            enabled: flags && flags.hasNote && !flags.isNoteDeleted && !flags.isMultiEditorEditing,
            visible: flags && flags.hasNote && !flags.isNoteDeleted && !flags.isEditorEditing,
            click: () => this.win.webContents.send ( 'note-move-to-trash' )
          },
          {
            label: 'Move to Trash',
            accelerator: 'CommandOrControl+Alt+Backspace',
            enabled: flags && flags.hasNote && !flags.isNoteDeleted && !flags.isMultiEditorEditing,
            visible: flags && flags.hasNote && !flags.isNoteDeleted && flags.isEditorEditing,
            click: () => this.win.webContents.send ( 'note-move-to-trash' )
          },
          {
            label: 'Restore',
            accelerator: 'CommandOrControl+Shift+Backspace',
            enabled: flags && flags.hasNote && flags.isNoteDeleted && !flags.isMultiEditorEditing,
            visible: flags && flags.hasNote && flags.isNoteDeleted,
            click: () => this.win.webContents.send ( 'note-restore' )
          },
          {
            label: 'Permanently Delete',
            enabled: flags && flags.hasNote && !flags.isMultiEditorEditing,
            visible: flags && flags.hasNote,
            click: () => this.win.webContents.send ( 'note-permanently-delete' )
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          // { role: 'undo' },
          // { role: 'redo' },
          // { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' },
          {
            type: 'separator'
          },
          {
            label: 'Select Notes - All',
            accelerator: 'CommandOrControl+Alt+A',
            click: () => this.win.webContents.send ( 'multi-editor-select-all' )
          },
          {
            label: 'Select Notes - Invert',
            accelerator: 'CommandOrControl+Alt+I',
            click: () => this.win.webContents.send ( 'multi-editor-select-invert' )
          },
          {
            label: 'Select Notes - Clear',
            accelerator: 'CommandOrControl+Alt+C',
            click: () => this.win.webContents.send ( 'multi-editor-select-clear' )
          },
          {
            type: 'separator'
          },
          {
            label: 'Empty Trash',
            click: () => this.win.webContents.send ( 'trash-empty' )
          },
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
            role: 'toggledevtools',
            visible: Environment.isDevelopment
          },
          {
            type: 'separator',
            visible: Environment.isDevelopment
          },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          {
            label: 'Toggle Focus Mode',
            accelerator: 'CommandOrControl+Alt+F',
            click: () => this.win.webContents.send ( 'window-focus-toggle' )
          },
          { role: 'togglefullscreen' }
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
          {
            type: 'separator'
          },
          {
            label: 'Search',
            accelerator: 'CommandOrControl+F',
            click: () => this.win.webContents.send ( 'search-focus' )
          },
          {
            type: 'separator'
          },
          {
            label: 'Previous Tag',
            accelerator: 'Control+Alt+Shift+Tab',
            click: () => this.win.webContents.send ( 'tag-previous' )
          },
          {
            label: 'Next Tag',
            accelerator: 'Control+Alt+Tab',
            click: () => this.win.webContents.send ( 'tag-next' )
          },
          {
            type: 'separator'
          },
          {
            label: 'Previous Note',
            accelerator: 'Control+Shift+Tab',
            click: () => this.win.webContents.send ( 'search-previous' )
          },
          {
            label: 'Next Note',
            accelerator: 'Control+Tab',
            click: () => this.win.webContents.send ( 'search-next' )
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
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: () => shell.openExternal ( pkg.homepage )
          },
          {
            label: 'Tutorial',
            click: () => this.win.webContents.send ( 'tutorial-dialog' )
          },
          {
            label: 'Support',
            click: () => shell.openExternal ( pkg.bugs.url )
          },
          { type: 'separator' },
          {
            label: 'View Changelog',
            click: () => shell.openExternal ( `${pkg.homepage}/blob/master/CHANGELOG.md` )
          },
          {
            label: 'View License',
            click: () => shell.openExternal ( `${pkg.homepage}/blob/master/LICENSE` )
          },
          { type: 'separator' },
          {
            role: 'toggledevtools'
          }
        ]
      }
    ]);

    const menu = Menu.buildFromTemplate ( template );

    Menu.setApplicationMenu ( menu );

  }

  events () {

    super.events ();

    this.___fullscreenEnter ();
    this.___fullscreenLeave ();
    this.___flagsUpdate ();
    this.___navigateUrl ();

  }

  /* FULLSCREEN ENTER */

  ___fullscreenEnter () {

    this.win.on ( 'enter-full-screen', this.__fullscreenEnter.bind ( this ) );

  }

  __fullscreenEnter () {

    this.win.webContents.send ( 'window-fullscreen-set', true );

  }

  /* FULLSCREEN LEAVE */

  ___fullscreenLeave () {

    this.win.on ( 'leave-full-screen', this.__fullscreenLeave.bind ( this ) );

  }

  __fullscreenLeave () {

    this.win.webContents.send ( 'window-fullscreen-set', false );

  }

  /* FLAGS UPDATE */

  ___flagsUpdate () {

    ipc.on ( 'flags-update', this.__flagsUpdate.bind ( this ) );

  }

  __flagsUpdate ( event, flags ) {

    this.initMenu ( flags );

  }

  /* NAVIGATE URL */

  ___navigateUrl () {

    this.win.webContents.on ( 'new-window', this.__navigateUrl.bind ( this ) );

  }

  __navigateUrl ( event, url ) {

    if ( url === this.win.webContents.getURL () ) return;

    event.preventDefault ();

    shell.openExternal ( url );

  }

}

/* EXPORT */

export default Main;
