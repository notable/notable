
/* IMPORT */

import * as React from 'react';
import {TagSpecials, TagSpecialsNames} from '@renderer/utils/tags';
import TagSingle from './tag_single';

/* TAG FAVORITES */

const TagFavorites = () => (
  <TagSingle icon="star" tag={TagSpecials.FAVORITES} name={TagSpecialsNames.FAVORITES} />
);

/* EXPORT */

export default TagFavorites;
