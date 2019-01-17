
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Markdown from '@renderer/utils/markdown';
import Main from '@renderer/containers/main';
import NoteBadge from './note_badge';

/* NOTE */

const Note = ({ note, style, title, hasAttachments, isActive, isSelected, isDeleted, isFavorited, isPinned, isMultiEditorEditing, set, toggleNote, toggleNoteRange }) => {

  const html = Markdown.render ( title ),
        onClick = event => Svelto.Keyboard.keystroke.hasCtrlOrCmd ( event ) ? toggleNote ( note ) : ( event.shiftKey ? toggleNoteRange ( note ) : set ( note, true ) );

  return (
    <div style={style} className={`note-button ${!isMultiEditorEditing && isActive ? 'label' : 'button'} ${( isMultiEditorEditing ? isSelected : isActive ) ? 'active' : ''} small fluid compact circular`} data-checksum={note.checksum} data-filepath={note.filePath} data-deleted={isDeleted} data-favorited={isFavorited} onClick={onClick} tabIndex={0}> {/* tabIndex is need in order to have the notes focusable, we use that for navigating with arrow */}
      <span className="title" dangerouslySetInnerHTML={{ __html: html }}></span>
      {!hasAttachments ? null : (
        <NoteBadge icon="paperclip" />
      )}
      {!isFavorited ? null : (
        <NoteBadge icon="star" />
      )}
      {!isPinned ? null : (
        <NoteBadge icon="pin" />
      )}
    </div>
  );

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container, note, style }) => ({
    note, style,
    title: container.note.getTitle ( note ),
    hasAttachments: !!container.note.getAttachments ( note ).length,
    isActive: ( container.note.get () === note ),
    isSelected: container.multiEditor.isNoteSelected ( note ),
    isDeleted: container.note.isDeleted ( note ),
    isFavorited: container.note.isFavorited ( note ),
    isPinned: container.note.isPinned ( note ),
    isMultiEditorEditing: container.multiEditor.isEditing (),
    set: container.note.set,
    toggleNote: container.multiEditor.toggleNote,
    toggleNoteRange: container.multiEditor.toggleNoteRange
  })
})( Note );
