
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import {TagSpecials} from '@renderer/utils/tags';
import TagGroup from './tag_group';

/* TAG FAVORITES */

const TagTemplates = ({ tag }) => (
  <TagGroup icon="tag_outline" iconCollapsed={"tag_outline_multiple"} tag={tag} />
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    tag: container.tag.get ( TagSpecials.TEMPLATES )
  })
})( TagTemplates );
