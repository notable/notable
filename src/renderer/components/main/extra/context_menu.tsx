
/* IMPORT */

import * as _ from 'lodash';
import contextMenu from 'electron-context-menu';
import Dialog from 'electron-dialog';
import * as is from 'electron-is';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';
import {TagSpecials} from '@renderer/utils/tags';

/* CONTEXT MENU */

class ContextMenu extends Component<{ container: IMain }, undefined> {

  /* VARIABLES */

  ele; attachment; note; tag; // Globals pointing to the current element/attachment/note/tag object

  /* SPECIAL */

  componentDidMount () {

    this.initAttachmentMenu ();
    this.initNoteMenu ();
    this.initNoteTagMenu ();
    this.initTagMenu ();
    this.initTrashMenu ();
    this.initFallbackMenu ();

  }

  /* HELPERS */

  _getItem = ( x, y, selector ) => {

    const eles = document.elementsFromPoint ( x, y );

    return $(eles).filter ( selector )[0];

  }

  _makeMenu = ( selector: string | Function = '*', items: any[] = [], itemsUpdater = _.noop ) => {

    contextMenu ({
      prepend: () => items,
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
        label: 'Rename',
        click: () => Dialog.alert ( 'Simply rename the actual attachment file while Notable is open' )
      },
      {
        label: 'Delete',
        click: () => this.props.container.note.removeAttachment ( undefined, this.attachment )
      }
    ], this.updateAttachmentMenu );

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

    this._makeMenu ( '.tag:not([data-has-children]):not(a)', [
      {
        label: 'Remove',
        click: () => this.props.container.note.removeTag ( undefined, $(this.ele).attr ( 'data-tag' ) )
      }
    ]);

  }

  initTagMenu = () => {

    this._makeMenu ( '.tag[data-has-children="true"], .tag[data-collapsed="true"]', [
      {
        label: 'Collapse',
        click: () => this.props.container.tag.toggleCollapse ( this.tag, true )
      },
      {
        label: 'Expand',
        click: () => this.props.container.tag.toggleCollapse ( this.tag, false )
      }
    ], this.updateTagMenu );

  }

  initTrashMenu = () => {

    this._makeMenu ( '.tag[title="Trash"]', [
      {
        label: 'Empty Trash',
        click: this.props.container.trash.empty
      }
    ], this.updateTrashMenu );

  }

  initFallbackMenu = () => {

    this._makeMenu ( ( x, y ) => !this._getItem ( x, y, '.attachment, .note, .tag:not([data-has-children]), .tag[data-has-children="true"], .tag[data-collapsed="true"], .tag[title="Trash"]' ) );

  }

  /* UPDATE */

  updateAttachmentMenu = ( items ) => {

    const fileName = $(this.ele).data ( 'filename' );

    this.attachment = this.props.container.attachment.get ( fileName );

  }

  updateNoteMenu = ( items ) => {

    const filePath = $(this.ele).data ( 'filepath' );

    this.note = this.props.container.note.get ( filePath );

    const isFavorited = this.props.container.note.isFavorited ( this.note ),
          isDeleted = this.props.container.note.isDeleted ( this.note ),
          isTemplate = !!this.props.container.note.getTags ( this.note, TagSpecials.TEMPLATES ).length;

    items[3].visible = !!isTemplate;
    items[6].visible = !isFavorited;
    items[7].visible = !!isFavorited;
    items[9].visible = !isDeleted;
    items[10].visible = !!isDeleted;

  }

  updateTagMenu = ( items ) => {

    this.tag = $(this.ele).attr ( 'data-tag' );

    const isCollapsed = this.props.container.tag.isCollapsed ( this.tag );

    items[0].visible = !isCollapsed;
    items[1].visible = isCollapsed;

  }

  updateTrashMenu = ( items ) => {

    items[0].enabled = !this.props.container.trash.isEmpty ();

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( ContextMenu );
