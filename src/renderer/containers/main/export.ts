
/* IMPORT */

import * as _ from 'lodash';
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

  _getResources = _.memoize ( async ( resources: string[], options = { minify: true } ) => {

    const contents = await Promise.all ( resources.map ( async resource => {

      const absolutePath = path.resolve ( '', resource );

      return await File.read ( absolutePath );

    }));

    let content = contents.join ( '\n' );

    if ( options.minify ) {
      content = content.replace ( / *\n+ */gm, '' );
    }

    return content;

  }, _.join )

  /* RENDERERS */

  renderers = {

    html: async ( note: NoteObj, notePath: string, options = { base64: true, icons: false, metadata: true } ) => {

      //TODO: Remove the inline style once `misc.css` gets integrated with Svelto

      const css = await this._getResources ([
        'node_modules/codemirror/lib/codemirror.css',
        'node_modules/codemirror-github-light/lib/codemirror-github-light-theme.css',
        'node_modules/highlight.js/styles/github.css',
        'node_modules/katex/dist/katex.min.css',
        'node_modules/primer-markdown/build/build.css',
        `${__static}/css/notable.min.css`
      ]);

      let content = Markdown.render ( note.plainContent ),
          metadata: string[] = [];

      if ( !options.icons ) {
        content = content.replace ( /<i class="icon[^"]*?">([^<]*?)<\/i>/gi, '' ); // Removing icons, as they won't get renderer
      }

      if ( options.metadata ) {
        metadata.push (
          `<meta name="metadata:attachments" content="${this.ctx.note.getAttachments ( note ).join ( ', ' )}">`,
          `<meta name="metadata:tags" content="${this.ctx.note.getTags ( note ).join ( ', ' )}">`,
          `<meta name="metadata:deleted" content="${this.ctx.note.isDeleted ()}">`,
          `<meta name="metadata:favorited" content="${this.ctx.note.isFavorited ()}">`,
          `<meta name="metadata:pinned" content="${this.ctx.note.isPinned ()}">`,
          `<meta name="metadata:created" content="${this.ctx.note.getCreated ().toISOString ()}">`,
          `<meta name="metadata:modified" content="${this.ctx.note.getModified ().toISOString ()}">`
        );
      }

      if ( options.base64 ) {
        const re = /<img([^>]*?)src="file:\/\/([^"]*)"/gi;
        const matches = stringMatches ( content, re );
        for ( let match of matches ) {
          const type = mime.lookup ( match[2] );
          const base64 = await File.read ( match[2], 'base64' );
          if ( mime && base64 ) {
            content = content.replace ( match[0], `<img${match[1]}src="data:${type};base64,${base64}"` );
          }
        }
      }

      return `
<html>
  <head>
    <meta charset="utf-8">
    ${metadata.join ( '\n    ' )}
    <title>${note.metadata.title}</title>
    <style>${css}</style>
    <style>body.markdown-body {padding: 20px;}</style>
  </head>
  <body class="markdown-body">

${content}

  </body>
</html>
      `;

    },

    markdown: async ( note: NoteObj ) => {

      return note.content;

    },

    pdf: async ( note: NoteObj, dst: string ) => {

      const html = await this.renderers.html ( note, dst, { base64: false, icons: false, metadata: false } );

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
