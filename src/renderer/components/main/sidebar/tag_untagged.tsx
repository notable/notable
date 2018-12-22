
/* IMPORT */

import * as React from 'react';
import {TagSpecials, TagSpecialsNames} from '@renderer/utils/tags';
import TagSingle from './tag_single';

/* TAG UNTAGGED */

const TagUntagged = () => (
  <TagSingle icon="tag_crossed" tag={TagSpecials.UNTAGGED} name={TagSpecialsNames.UNTAGGED} />
);

/* EXPORT */

export default TagUntagged;
