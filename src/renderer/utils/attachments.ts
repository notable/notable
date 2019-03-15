
/* IMPORT */

import {orderBy} from 'natural-orderby';

/* ATTACHMENTS */

const Attachments = {

  sort ( attachments: string[] ): string[] {

    return orderBy ( attachments, attachment => attachment.toLowerCase () );

  }

};

/* EXPORT */

export default Attachments;
