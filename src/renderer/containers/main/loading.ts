
/* IMPORT */

import {Container, autosuspend} from 'overstated';

/* LOADING */

class Loading extends Container<LoadingState, MainCTX> {

  /* STATE */

  state = {
    loading: true
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* API */

  get = (): boolean => {

    return this.state.loading;

  }

  set = ( loading: boolean ) => {

    return this.setState ({ loading });

  }

}

/* EXPORT */

export default Loading;
