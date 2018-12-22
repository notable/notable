
const lodash = require ( 'lodash' ); // Avoiding using 2 instances of lodash, improves performance

window._ = lodash.clone ( lodash );
