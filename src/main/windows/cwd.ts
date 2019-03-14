
/* IMPORT */

import Route from './route';

/* CWD */

class CWD extends Route {

  /* CONSTRUCTOR */

  constructor ( name = 'cwd', options = { resizable: false, minWidth: 560, minHeight: 485 }, stateOptions = { defaultWidth: 560, defaultHeight: 485 } ) {

    super ( name, options, stateOptions );

  }

}

/* EXPORT */

export default CWD;
