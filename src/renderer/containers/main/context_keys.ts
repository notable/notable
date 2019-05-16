
/* IMPORT */

import * as _ from 'lodash';
import {ipcRenderer as ipc} from 'electron';
import {Container} from 'overstated';
import {TagSpecials} from '@renderer/utils/tags';

/* CONTEXT KEYS */

class ContextKeys extends Container<ContextKeysState, IMain> {

  /* VARIABLES */

  _prevKeys?: ContextKeysObj;

  /* API */

  get = (): ContextKeysObj => {

    return {
      hasNote: !!this.ctx.note.get (),
      isAttachmentsEditing: this.ctx.attachments.isEditing (),
      isEditorEditing: this.ctx.editor.isEditing (),
      isEditorSplitView: this.ctx.editor.isSplit (),
      isMultiEditorEditing: this.ctx.multiEditor.isEditing (),
      isNoteDeleted: this.ctx.note.isDeleted (),
      isNoteFavorited: this.ctx.note.isFavorited (),
      isNotePinned: this.ctx.note.isPinned (),
      isNoteTemplate: !!this.ctx.note.getTags ( undefined, TagSpecials.TEMPLATES ).length,
      isTagsEditing: this.ctx.tags.isEditing (),
      theme: this.ctx.theme.get ()
    };

  }

  update = () => {

    const keys = this.get ();

    if ( _.isEqual ( this._prevKeys, keys ) ) return; // Nothing changed, no need to update the main process

    this._prevKeys = keys;

    ipc.send ( 'context-keys-update', keys );

  }

}

/* EXPORT */

export default ContextKeys;
