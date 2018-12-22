
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {pure} from 'recompose';
import Tags from '@renderer/utils/tags';
import TagSingle from './tag_single';

/* TAG GROUP */

const TagGroup = pure ( function TagGroup ({ tag, ...props }) {

  if ( !tag.notes.length ) return null;

  return (
    <div className="tag-group multiple vertical fluid">
      <TagSingle tag={tag.path} name={tag.name} {...props} />
      {tag.collapsed ? null : (
        Tags.sort ( Object.values ( tag.tags ) ).map ( ( tag: any ) => (
          <TagGroup key={tag.path} tag={tag} {...props} />
        ))
      )}
    </div>
  );

});

/* EXPORT */

export default TagGroup;
