
/* IMPORT */

import {debug, HMR} from 'overstated';
import logUpdates from 'react-log-updates';
import Environment from '@common/environment';

/* DEBUGGING */

async function debugging () {

  logUpdates ({
    enabled: Environment.isDevelopment,
    exclude: /^(Consumer|ContainersProvider|PropsChangeComponent|pure\(|SelectorComponent|Subscribe)/i
  });

  debug.isEnabled = Environment.isDevelopment;
  debug.logStateChanges = false;

  HMR.isEnabled = Environment.isDevelopment;

}

/* EXPORT */

export default debugging;
