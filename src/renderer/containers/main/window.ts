
/* IMPORT */

import {remote} from 'electron';
import {Container, autosuspend} from 'overstated';

/* WINDOW */

class Window extends Container<WindowState, MainCTX> {

  /* STATE */

  state = {
    focus: false,
    fullscreen: remote.getCurrentWindow ().isFullScreen (),
    sidebar: true
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* API */

  isFullscreen = (): boolean => {

    return this.state.fullscreen;

  }

  toggleFullscreen = ( fullscreen: boolean = !this.state.fullscreen ) => {

    return this.setState ({ fullscreen });

  }

  isFocus = (): boolean => {

    return this.state.focus;

  }

  toggleFocus = ( focus: boolean = !this.state.focus ) => {

    return this.setState ({ focus });

  }

  hasSidebar = (): boolean => {

    return this.state.sidebar;

  }

  toggleSidebar = ( sidebar: boolean = !this.state.sidebar ) => {

    return this.setState ({ sidebar });

  }

}

/* EXPORT */

export default Window;
