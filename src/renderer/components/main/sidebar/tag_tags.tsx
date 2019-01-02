
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Tags, {TagSpecials} from '@renderer/utils/tags';
import TagGroup from './tag_group';

/* TAG TAGS */

const TagTags = ({ tags, notebooks, templates }) => {

  if ( notebooks.notes.length || templates.notes.length ) return <TagGroup tag={tags} />;

  return Tags.sort ( Object.values ( tags.tags ) ).map ( ( tag: any ) => (
    <TagGroup key={tag.path} tag={tag} />
  ));

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    tags: container.tag.get ( TagSpecials.TAGS ),
    notebooks: container.tag.get ( TagSpecials.NOTEBOOKS ),
    templates: container.tag.get ( TagSpecials.TEMPLATES )
  })
})( TagTags );
