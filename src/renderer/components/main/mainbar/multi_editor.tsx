
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Button from './multi_editor_button';
import Tagbox from './multi_editor_tagbox';

/* MULTI EDITOR */

const MultiEditor = ({ notesNr, favorite, unfavorite, pin, unpin, trash, untrash, del, tagsAdd, tagsRemove, openInApp }) => (
  <div className="multi-editor">
    <h1>{notesNr} notes selected</h1>
    <div className="container bordered actions">
      <div className="multiple fluid vertical">
        <div className="multiple fluid">
          <div className="multiple fluid joined actions-favorite">
            <Button icon="star_outline" title="Unfavorite" onClick={unfavorite} />
            <Button icon="star" title="Favorite" onClick={favorite} />
          </div>
          <div className="multiple fluid joined actions-pin">
            <Button icon="pin_outline" title="Unpin" onClick={unpin} />
            <Button icon="pin" title="Pin" onClick={pin} />
          </div>
        </div>
        <div className="multiple fluid">
          <div className="multiple fluid joined actions-delete">
            <Button icon="delete" title="Move to Trash" onClick={trash} />
            <Button icon="delete_restore" title="Restore" onClick={untrash} />
            <Button icon="delete_forever" color="red inverted" title="Permanently Delete" onClick={del} />
          </div>
          <Button icon="open_in_new" title="Open in Default App" onClick={openInApp} />
        </div>
        <Tagbox icon="tag_plus" title="Add Tags" placeholder="Add Tag..." onClick={tagsAdd} />
        <Tagbox icon="tag_minus" title="Remove Tags" placeholder="Remove Tag..." onClick={tagsRemove} />
      </div>
    </div>
  </div>
);

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    notesNr: container.multiEditor.getNotes ().length,
    favorite: container.multiEditor.favorite,
    unfavorite: container.multiEditor.unfavorite,
    pin: container.multiEditor.pin,
    unpin: container.multiEditor.unpin,
    trash: container.multiEditor.trash,
    untrash: container.multiEditor.untrash,
    del: container.multiEditor.delete,
    tagsAdd: container.multiEditor.tagsAdd,
    tagsRemove: container.multiEditor.tagsRemove,
    openInApp: container.multiEditor.openInApp
  })
})( MultiEditor );
