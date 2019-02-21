
const lodash = require ( 'lodash' ); // Avoiding using 2 instances of lodash, improves performance

window._ = lodash.clone ( lodash ); // Closing it because some of its methods are re-implemented
