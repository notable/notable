
/* IMPORT */

import Environment from '@common/environment';

/* DEBUGGING */

async function debugging () {

  if ( !Environment.isDevelopment ) return;

  const {debug, HMR} = await import ( 'overstated' );
  const {default: logUpdates} = await import ( 'react-log-updates' );

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
