
/* IMPORT */

import {remote} from 'electron';
import {Container} from 'overstated';

/* WINDOW */

class Window extends Container<WindowState, MainCTX> {

  /* STATE */

  state = {
    focus: false,
    statusbar: false,
    fullscreen: remote.getCurrentWindow ().isFullScreen ()
  };

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

  isStatusbar = (): boolean => {

    return this.state.statusbar;

  }

  toggleStatusbar = ( statusbar: boolean = !this.state.statusbar ) => {

    return this.setState ({ statusbar });

  }

}

/* EXPORT */

export default Window;
