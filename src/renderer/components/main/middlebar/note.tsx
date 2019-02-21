
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* NOTE */

const Note = ({ note, style, title, hasAttachments, isActive, isDeleted, isFavorited, isPinned, isSelected, isMultiEditorEditing, set, toggleNote, toggleNoteRange }) => {

  const onClick = event => Svelto.Keyboard.keystroke.hasCtrlOrCmd ( event ) ? toggleNote ( note ) : ( event.shiftKey ? toggleNoteRange ( note ) : set ( note, true ) );

  return (
    <div style={style} className={`note ${!isMultiEditorEditing && isActive ? 'label' : 'button'} ${( isMultiEditorEditing ? isSelected : isActive ) ? 'active' : ''} list-item`} data-checksum={note.checksum} data-filepath={note.filePath} data-deleted={isDeleted} data-favorited={isFavorited} onClick={onClick}>
      <span className="title small">{title}</span>
      {!hasAttachments ? null : (
        <i className="icon xxsmall">paperclip</i>
      )}
      {!isFavorited ? null : (
        <i className="icon xxsmall">star</i>
      )}
      {!isPinned ? null : (
        <i className="icon xxsmall">pin</i>
      )}
    </div>
  );

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, style, itemKey }) => {

    const note = container.note.get ( itemKey );

    return ({
      note, style,
      title: container.note.getTitle ( note ),
      hasAttachments: !!container.note.getAttachments ( note ).length,
      isActive: container.note.get () === note,
      isDeleted: container.note.isDeleted ( note ),
      isFavorited: container.note.isFavorited ( note ),
      isPinned: container.note.isPinned ( note ),
      isSelected: container.multiEditor.isNoteSelected ( note ),
      isMultiEditorEditing: container.multiEditor.isEditing (),
      set: container.note.set,
      toggleNote: container.multiEditor.toggleNote,
      toggleNoteRange: container.multiEditor.toggleNoteRange
    });

  }
})( Note );
