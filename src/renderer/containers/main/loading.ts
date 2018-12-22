
/* IMPORT */

import {Container} from 'overstated';

/* LOADING */

class Loading extends Container<LoadingState, MainCTX> {

  /* STATE */

  state = {
    loading: true
  };

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
