
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import TagAll from './tag_all';
import TagFavorites from './tag_favorites';
import TagNotebooks from './tag_notebooks';
import TagTags from './tag_tags';
import TagTemplates from './tag_templates';
import TagTrash from './tag_trash';
import TagUntagged from './tag_untagged';

/* CONTENT */

const Content = ({ isLoading }) => (
  <div className="layout-content">
    {isLoading ? null : (
      <div className="multiple vertical fluid">
        <TagAll />
        <TagFavorites />
        <TagNotebooks />
        <TagTags />
        <TagTemplates />
        <TagUntagged />
        <TagTrash />
      </div>
    )}
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: ['container.tags.state', 'container.loading.state'],
  selector: ({ container }) => ({
    isLoading: container.loading.get ()
  })
})( Content );
