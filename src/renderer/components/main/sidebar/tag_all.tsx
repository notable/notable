
/* IMPORT */

import * as React from 'react';
import {TagSpecials, TagSpecialsNames} from '@renderer/utils/tags';
import TagSingle from './tag_single';

/* TAG ALL */

const TagAll = () => (
  <TagSingle icon="note" tag={TagSpecials.ALL} name={TagSpecialsNames.ALL} showIfEmpty={true} />
);

/* EXPORT */

export default TagAll;
