
/* IMPORT */

import {shell} from 'electron';
import Dialog from 'electron-dialog';
import * as unzip from 'extract-zip';
import {Container, autosuspend} from 'overstated';
import * as path from 'path';
import * as pify from 'pify';
import pkg from '@root/package.json';

/* TUTORIAL */

class Tutorial extends Container<TutorialState, MainCTX> {

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* API */

  import = async () => {

    const cwd = this.ctx.cwd.get ();

    if ( !cwd ) return;

    const tutorialPath = path.join ( __static, 'tutorial.zip' );

    try {

      await pify ( unzip )( tutorialPath, { dir: cwd } );

    } catch ( e ) {

      Dialog.alert ( 'Failed to import the tutorial notes, please report the issue' );

    }

  }

  open = () => {

    shell.openExternal ( pkg['tutorial'].url );

  }

  dialog = () => {

    const choice = Dialog.choice ( 'Do you want to browse the tutorial online or do you want to import all the notes?', ['Cancel', 'Import Notes', 'Online Tutorial'] );

    switch ( choice ) {

      case 1:
        this.import ();
        break;

      case 2:
        this.open ();
        break;

    }

  }

}

/* EXPORT */

export default Tutorial;
