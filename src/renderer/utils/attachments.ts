
/* IMPORT */

import * as _ from 'lodash';

/* ATTACHMENTS */

const Attachments = {

  sort ( attachments: string[] ): string[] {

    return _.sortBy ( attachments, attachment => attachment.toLowerCase () );

  }

};

/* EXPORT */

export default Attachments;
