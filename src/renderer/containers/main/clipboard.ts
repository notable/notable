
/* IMPORT */

import {clipboard} from 'electron';
import {Container} from 'overstated';

/* CLIPBOARD */

class Clipboard extends Container<ClipboardState, MainCTX> {

  /* API */

  get = (): string  => {

    return clipboard.readText ();

  }

  set = ( text: string ): void => {

    clipboard.writeText ( text );

  }

  reset = (): void => {

    clipboard.clear ();

  }

}

/* EXPORT */

export default Clipboard;
