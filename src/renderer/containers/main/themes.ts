
/* IMPORT */

import {Container, autosuspend} from 'overstated';

/* THEMES */

class Themes extends Container<ThemesState, MainCTX> {

  /* STATE */

  state = {
    themes: ['light', 'dark']
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* API */

  get = (): string[] => {

    return this.state.themes;

  }

  set = ( themes: string[] ) => {

    return this.setState ({ themes });

  }

}

/* EXPORT */

export default Themes;
