
/* IMPORT */

import {ipcRenderer as ipc, remote, shell} from 'electron';
import Dialog from 'electron-dialog';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import {Container, compose} from 'overstated';
import * as path from 'path';
import * as pify from 'pify';
import Tutorial from '@renderer/containers/main/tutorial';
import Config from '@common/config';
import Settings from '@common/settings';

/* CWD */

class CWD extends Container<CWDState, CWDCTX> {

  /* API */

  get = () => {

    return Config.cwd;

  }

  set = async ( folderPath: string ) => {

    try {

      const hadTutorial = !!Settings.get ( 'tutorial' );

      await pify ( mkdirp )( folderPath );

      await pify ( fs.access )( folderPath, fs.constants.F_OK );

      Settings.set ( 'cwd', folderPath );

      if ( !hadTutorial && Config.flags.TUTORIAL ) {

        await this.ctx.tutorial.import ();

        Settings.set ( 'tutorial', true );

      }

      ipc.send ( 'cwd-changed' );

    } catch ( e ) {

      Dialog.alert ( `Couldn't access path: "${folderPath}"` );
      Dialog.alert ( e.message );

    }

  }

  select = () => {

    const folderPath = this.dialog ();

    if ( !folderPath ) return;

    return this.set ( folderPath );

  }

  selectDefault = () => {

    const folderPath = path.join ( os.homedir (), '.notable' );

    return this.set ( folderPath );

  }

  openInApp = () => {

    const cwd = this.get ();

    if ( !cwd ) return Dialog.alert ( 'No data directory set' );

    shell.openItem ( cwd );

  }

  dialog = (): string | undefined => {

    const folderPaths = remote.dialog.showOpenDialog ({
      title: 'Select Data Directory',
      buttonLabel: 'Select',
      properties: ['openDirectory', 'createDirectory', 'showHiddenFiles']
    });

    if ( !folderPaths || !folderPaths.length ) return;

    return folderPaths[0];

  }

}

/* EXPORT */

export default compose ({
  tutorial: Tutorial
})( CWD ) as ICWD;
