
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Tags from '@renderer/utils/tags';
import Popover from './popover';
import Tag from './tag';
import Tagbox from './tagbox';

/* POPOVER NOTE TAGS */

const PopoverNoteTags = ({ tags, isEditing, toggleEditing, replaceTags }) => (
  <Popover open={isEditing} onBeforeClose={() => _.defer ( () => toggleEditing ( false ) )} anchor="#popover-note-tags-trigger">
    <div className="card-block">
      <div className="multiple vertical">
        {!tags.length ? (
          <p className="small centered">No tags</p>
        ) : (
          tags.map ( tag => (
            <Tag key={tag} tag={tag} />
          ))
        )}
      </div>
    </div>
    <Tagbox className="card-footer" tags={_.clone ( tags )} onChange={tags => replaceTags ( undefined, Tags.sort ( tags ) )} />
  </Popover>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    note: container.note.get (),
    tags: container.note.getTags (),
    isEditing: container.tags.isEditing (),
    toggleEditing: container.tags.toggleEditing,
    replaceTags: container.note.replaceTags
  })
})( PopoverNoteTags );
