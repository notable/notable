
/* IMPORT */

import * as _ from 'lodash';
import critically from 'critically';
import {ipcRenderer as ipc, remote} from 'electron';
import Dialog from 'electron-dialog';
import * as mime from 'mime-types';
import * as os from 'os';
import {Container, autosuspend} from 'overstated';
import * as path from 'path';
import stringMatches from 'string-matches';
import * as sha1 from 'sha1';
import File from '@renderer/utils/file';
import Markdown from '@renderer/utils/markdown';
import Path from '@renderer/utils/path';

/* EXPORT */

class Export extends Container<ExportState, MainCTX> {

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* HELPERS */

  _getResource = _.memoize ( async ( resource: string, options = { minify: true } ) => {

    let content = await File.read ( resource ) || '';

    if ( options.minify ) {

      content = content.replace ( / *\n+ */gm, '' );

    }

    return content;

  })

  _getResources = async ( resources: string[], options = { minify: true } ) => {

    const contents = await Promise.all ( resources.map ( resource => this._getResource ( resource, options ) ) );

    return contents.join ( '\n' );

  }

  /* RENDERERS */

  renderers = {

    html: async ( note: NoteObj, notePath: string, options = { base64: true, metadata: true, critical: true, favicon: true, scrollable: true } ) => {

      //TODO: Perhaps we should update the theme we are exporting to, as long as it's light, in order to not waste huge amounts of ink

      let css = await this._getResources ([
        __non_webpack_require__.resolve ( 'katex/dist/katex.min.css' ), // Simply using `require` won't work with WebPack
        `${__static}/css/notable.min.css`
      ]);

      let content = Markdown.render ( note.plainContent, Infinity ),
          metadata: string[] = [];

      if ( options.metadata ) {
        metadata.push (
          `<meta name="metadata:tags" content="${this.ctx.note.getTags ( note ).join ( ', ' )}">`,
          `<meta name="metadata:attachments" content="${this.ctx.note.getAttachments ( note ).join ( ', ' )}">`,
          `<meta name="metadata:deleted" content="${this.ctx.note.isDeleted ()}">`,
          `<meta name="metadata:favorited" content="${this.ctx.note.isFavorited ()}">`,
          `<meta name="metadata:pinned" content="${this.ctx.note.isPinned ()}">`,
          `<meta name="metadata:created" content="${this.ctx.note.getCreated ().toISOString ()}">`,
          `<meta name="metadata:modified" content="${this.ctx.note.getModified ().toISOString ()}">`
        );
      }

      let html = `
        <html>
          <head>
            <meta charset="utf-8">
            ${metadata.join ( '\n' )}
            <title>${note.metadata.title}</title>
            ${options.favicon ? '<link rel="shortcut icon" type="image/png" href="data:image/png;base64,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">' : ''}
            <style>${css}</style>
            ${options.scrollable ? '' : `
              <style>
                .preview code {
                  white-space: pre-wrap !important;
                }
              </style>
            `}
          </head>
          <body class="theme-light">
            <div class="preview">
              ${content}
            </div>
          </body>
        </html>
      `;

      if ( options.critical ) {
        html = ( await critically ({ html }) ).html;
      }

      if ( options.base64 ) { // Images
        const re = /<img([^>]*?)src="file:\/\/([^"]*)"/gi;
        const matches = stringMatches ( html, re );
        for ( let match of matches ) {
          const type = mime.lookup ( match[2] );
          const base64 = await File.read ( match[2], 'base64' );
          if ( mime && base64 ) {
            html = html.replace ( match[0], `<img${match[1]}src="data:${type};base64,${base64}"` );
          }
        }
      }

      if ( options.base64 ) { // Fonts
        const re = /url\("?([^)]*?\.woff2[^)]*?)"?\)/gi;
        const matches = stringMatches ( html, re );
        for ( let match of matches ) {
          const filePath = /katex/i.test ( match[1] ) ? __non_webpack_require__.resolve ( `katex/dist/${match[1]}` ): `${__static}/fonts/IconFont.woff2`; // Simply using `require` won't work with WebPack //UGLY
          const base64 = await File.read ( filePath, 'base64' );
          if ( base64 ) {
            html = html.replace ( match[0], `url(data:font/woff2;base64,${base64})` );
          }
        }
      }

      return html;

    },

    markdown: async ( note: NoteObj ) => {

      return note.content;

    },

    pdf: async ( note: NoteObj, dst: string ) => {

      const html = await this.renderers.html ( note, dst, { base64: true, metadata: false, critical: true, favicon: false, scrollable: false } );

      ipc.send ( 'print-pdf', { html, dst } );

    }

  }

  /* API */

  export = async ( notes: NoteObj[] = this.ctx.multiEditor.getNotes (), renderer: Function, extension: string ) => {

    if ( !notes.length ) return Dialog.alert ( 'No notes to export' );

    if ( !renderer || !extension ) return Dialog.alert ( 'Invalid export configuration' );

    const basePath = this.dialog ();

    if ( !basePath ) return;

    const exportId = sha1 ( Date.now ().toString () ).slice ( 0, 4 ),
          exportName = `Notable - Export ${exportId}`,
          {filePath: exportPath} = await Path.getAllowedPath ( basePath, exportName ),
          notesPath = exportPath,
          attachmentsPath = path.join ( exportPath, 'attachments' );

    notes.forEach ( async note => {

      /* CONTENT */

      const {name} = path.parse ( note.filePath ),
            baseName = `${name}.${extension}`,
            {filePath: notePath} = await Path.getAllowedPath ( notesPath, baseName ),
            content = await renderer ( note, notePath );

      if ( content ) {
        File.write ( notePath, content );
      }

      /* ATTACHMENTS */

      const attachments = this.ctx.note.getAttachments ( note );

      attachments.forEach ( async fileName => {

        const attachment = this.ctx.attachment.get ( fileName );

        if ( !attachment ) return;

        const {filePath: attachmentPath} = await Path.getAllowedPath ( attachmentsPath, fileName );

        File.copy ( attachment.filePath, attachmentPath );

      });

    });

  }

  exportHTML = ( notes: NoteObj[] = this.ctx.multiEditor.getNotes () ) => {

    return this.export ( notes, this.renderers.html, 'html' );

  }

  exportMarkdown = ( notes: NoteObj[] = this.ctx.multiEditor.getNotes () ) => {

    return this.export ( notes, this.renderers.markdown, 'md' );

  }

  exportPDF = ( notes: NoteObj[] = this.ctx.multiEditor.getNotes () ) => {

    return this.export ( notes, this.renderers.pdf, 'pdf' );

  }

  dialog = () => {

    const folderPaths = remote.dialog.showOpenDialog ({
      title: 'Export Notes',
      buttonLabel : 'Export',
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: os.homedir ()
    });

    if ( !folderPaths || !folderPaths.length ) return;

    return folderPaths[0];

  }

}

/* EXPORT */

export default Export;
