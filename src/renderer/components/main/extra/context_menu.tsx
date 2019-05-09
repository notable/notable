
/* IMPORT */

import * as _ from 'lodash';
import {MenuItem, MenuItemConstructorOptions} from 'electron';
import contextMenu from 'electron-context-menu';
import Dialog from 'electron-dialog';
import * as is from 'electron-is';
import {connect} from 'overstated';
import * as path from 'path';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';
import {TagSpecials} from '@renderer/utils/tags';

/* CONTEXT MENU */

class ContextMenu extends Component<{ container: IMain }, {}> {

  /* VARIABLES */

  ele; attachment; note; tag; // Globals pointing to the current element/attachment/note/tag object

  /* SPECIAL */

  componentDidMount () {

    this.initInputMenu ();
    this.initAttachmentMenu ();
    this.initNoteMenu ();
    this.initNoteTagMenu ();
    this.initTagMenu ();
    this.initTrashMenu ();
    this.initEditorMenu ();
    this.initFallbackMenu ();

  }

  /* HELPERS */

  _getItem = ( x, y, selector: string ): Element | undefined => {

    const eles = document.elementsFromPoint ( x, y );

    return eles.find ( ele => $(ele).is ( selector ) );

  }

  _makeMenu = ( selector: string | Function = '*', items: MenuItemConstructorOptions[] = [], itemsUpdater = _.noop ) => {

    contextMenu ({
      prepend: () => items as MenuItem[], //TSC: Looks like a bug in `electron-context-menu`?
      shouldShowMenu: ( event, { x, y } ) => {

        const ele = _.isString ( selector ) ? this._getItem ( x, y, selector ) : selector ( x, y );

        if ( !ele ) return false;

        this.ele = ele;

        itemsUpdater ( items );

        return true;

      }
    });

  }

  /* INIT */

  initAttachmentMenu = () => {

    this._makeMenu ( '.attachment', [
      {
        label: 'Open',
        click: () => this.props.container.attachment.openInApp ( this.attachment )
      },
      {
        label: `Reveal in ${is.macOS () ? 'Finder' : 'Folder'}`,
        click: () => this.props.container.attachment.reveal ( this.attachment )
      },
      {
        type: 'separator'
      },
      {
        label: 'Copy',
        click: () => this.props.container.clipboard.set ( this.attachment.fileName )
      },
      {
        type: 'separator'
      },
      {
        label: 'Rename',
        click: () => Dialog.alert ( 'Simply rename the actual attachment file while Notable is open' )
      },
      {
        label: 'Delete',
        click: () => this.props.container.note.removeAttachment ( undefined, this.attachment )
      }
    ], this.updateAttachmentMenu );

  }

  initEditorMenu = () => {

    this._makeMenu ( '.monaco-editor', [
      {
        label: 'Cut',
        click: this.props.container.editor.cut
      },
      {
        label: 'Copy',
        click: this.props.container.editor.copy
      },
      {
        label: 'Paste',
        click: this.props.container.editor.paste
      }
    ], this.updateEditorMenu );

  }

  initInputMenu = () => {

    this._makeMenu ( ( x, y ) => this._getItem ( x, y, 'input, textarea' ) );

  }

  initNoteMenu = () => {

    this._makeMenu ( '.note', [
      {
        label: 'Open in Default App',
        click: () => this.props.container.note.openInApp ( this.note )
      },
      {
        label: `Reveal in ${is.macOS () ? 'Finder' : 'Folder'}`,
        click: () => this.props.container.note.reveal ( this.note )
      },
      {
        type: 'separator'
      },
      {
        label: 'New from Template',
        click: () => this.props.container.note.duplicate ( this.note, true )
      },
      {
        label: 'Duplicate',
        click: () => this.props.container.note.duplicate ( this.note )
      },
      {
        type: 'separator'
      },
      {
        label: 'Copy',
        click: () => {
          const title = this.note ? this.props.container.note.getTitle ( this.note ) : path.parse ( $(this.ele).data ( 'filepath' ) ).name; // Maybe we are linking to a non-existent note
          this.props.container.clipboard.set ( title );
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Favorite',
        click: () => this.props.container.note.toggleFavorite ( this.note, true )
      },
      {
        label: 'Unfavorite',
        click: () => this.props.container.note.toggleFavorite ( this.note, false )
      },
      {
        type: 'separator'
      },
      {
        label: 'Move to Trash',
        click: () => this.props.container.note.toggleDeleted ( this.note, true )
      },
      {
        label: 'Restore',
        click: () => this.props.container.note.toggleDeleted ( this.note, false )
      },
      {
        label: 'Permanently Delete',
        click: () => this.props.container.note.delete ( this.note )
      }
    ], this.updateNoteMenu );

  }

  initNoteTagMenu = () => {

    this._makeMenu ( '.popover-note-tags-list .tag', [
      {
        label: 'Copy',
        click: () => this.props.container.clipboard.set ( this.tag )
      },
      {
        type: 'separator'
      },
      {
        label: 'Remove',
        click: () => this.props.container.note.removeTag ( undefined, this.tag )
      }
    ], this.updateNoteTagMenu );

  }

  initTagMenu = () => {

    this._makeMenu ( '.sidebar .tag, .preview .tag', [
      {
        label: 'Collapse',
        click: () => this.props.container.tag.toggleCollapse ( this.tag, true )
      },
      {
        label: 'Expand',
        click: () => this.props.container.tag.toggleCollapse ( this.tag, false )
      },
      {
        type: 'separator'
      },
      {
        label: 'Copy',
        click: () => this.props.container.clipboard.set ( this.tag )
      }
    ], this.updateTagMenu );

  }

  initTrashMenu = () => {

    this._makeMenu ( '.tag[data-tag="__TRASH__"]', [
      {
        label: 'Empty Trash',
        click: this.props.container.trash.empty
      }
    ], this.updateTrashMenu );

  }

  initFallbackMenu = () => {

    this._makeMenu ( ( x, y ) => !this._getItem ( x, y, '.attachment, .monaco-editor, .note, .popover-note-tags-list .tag, .sidebar .tag, .preview .tag, .tag[data-tag="__TRASH__"]' ) );

  }

  /* UPDATE */

  updateAttachmentMenu = ( items: MenuItem[] ) => {

    const fileName = $(this.ele).data ( 'filename' );

    this.attachment = this.props.container.attachment.get ( fileName );

  }

  updateEditorMenu = ( items: MenuItem[] ) => {

    const canCopy = !!this.props.container.editor._getSelectedText (),
          canPaste = !!this.props.container.clipboard.get ();

    items[0].enabled = canCopy;
    items[1].enabled = canCopy;
    items[2].enabled = canPaste;

  }

  updateNoteMenu = ( items: MenuItem[] ) => {

    const filePath = $(this.ele).data ( 'filepath' );

    this.note = this.props.container.note.get ( filePath );

    const isFavorited = this.props.container.note.isFavorited ( this.note ),
          isDeleted = this.props.container.note.isDeleted ( this.note ),
          isTemplate = !!this.props.container.note.getTags ( this.note, TagSpecials.TEMPLATES ).length;

    items[3].visible = !!isTemplate;
    items[8].visible = !isFavorited;
    items[9].visible = !!isFavorited;
    items[11].visible = !isDeleted;
    items[12].visible = !!isDeleted;

  }

  updateNoteTagMenu = ( items: MenuItem[] ) => {

    this.tag = $(this.ele).data ( 'tag' );

  }

  updateTagMenu = ( items: MenuItem[] ) => {

    this.tag = $(this.ele).data ( 'tag' );

    const hasChildren = this.props.container.tag.hasChildren ( this.tag ),
          isCollapsed = hasChildren && this.props.container.tag.isCollapsed ( this.tag ),
          isCopyable = !/^__.*__$/.test ( this.tag ); //TODO: Write a proper function for this somewhere

    items[0].visible = hasChildren && !isCollapsed;
    items[1].visible = hasChildren && isCollapsed;
    items[2].visible = hasChildren && isCopyable;
    items[3].visible = isCopyable;

  }

  updateTrashMenu = ( items: MenuItem[] ) => {

    items[0].enabled = !this.props.container.trash.isEmpty ();

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( ContextMenu );
