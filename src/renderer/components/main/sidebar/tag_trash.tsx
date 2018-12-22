
/* IMPORT */

import * as React from 'react';
import {TagSpecials, TagSpecialsNames} from '@renderer/utils/tags';
import TagSingle from './tag_single';

/* TAG TRASH */

const TagTrash = () => (
  <TagSingle icon="delete" tag={TagSpecials.TRASH} name={TagSpecialsNames.TRASH} />
);

/* EXPORT */

export default TagTrash;
