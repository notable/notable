
/* IMPORT */

import {shell} from 'electron';
import Dialog from 'electron-dialog';
import {Container, autosuspend} from 'overstated';
import * as path from 'path';
import pkg from '@root/package.json';
import Config from '@common/config';

/* IMPORT LAZY */

const laxy = require ( 'laxy' ),
      decompress = laxy ( () => require ( 'decompress' ) )();

/* TUTORIAL */

class Tutorial extends Container<TutorialState, MainCTX> {

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* API */

  import = () => {

    const cwd = Config.cwd;

    if ( !cwd ) return;

    const tutorialPath = path.join ( __static, 'tutorial.tar' );

    return decompress ( tutorialPath, cwd, {
      filter: file => !/^\./.test ( path.basename ( file.path ) ) // Some dot files junk might get included
    });

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
