
/* IMPORT */

import {remote} from 'electron';
import Dialog from 'electron-dialog';
import {Container} from 'overstated';
import * as path from 'path';
import * as sha1 from 'sha1';
import Config from '@common/config';
import File from '@renderer/utils/file';
import Metadata from '@renderer/utils/metadata';
import Path from '@renderer/utils/path';

/* IMPORT LAZY */

const laxy = require ( 'laxy' ),
      EnexDump = laxy ( () => require ( 'enex-dump' ) )();

/* IMPORT */

class Import extends Container<ImportState, MainCTX> {

  /* HELPERS */

  _getImportTag ( str: string ): string {

    const importId = sha1 ( str ).slice ( 0, 4 ),
          importTag = `Import-${importId}`;

    return importTag;

  }

  _importEnex = async ( filePath: string ) => { //TODO: Run this on a separate process

    const importTag = this._getImportTag ( filePath );

    await EnexDump ({
      path: {
        src: [filePath],
        dst: Config.cwd
      },
      dump: {
        tags: [importTag]
      }
    });

    const tag = await this.ctx.tag.get ( importTag );

    if ( tag ) this.ctx.tag.set ( importTag );

  }

  _importMarkdown = async ( filePath: string, importTag: string ) => {

    const notesPath = Config.notes.path;

    if ( !notesPath ) return;

    const content = await File.read ( filePath );

    if ( !content ) return;

    const metadata = Metadata.get ( content );

    if ( !metadata['tags'] ) metadata['tags'] = [];

    metadata['tags'].push ( importTag );

    const contentNext = Metadata.set ( content, metadata ),
          baseName = path.basename ( filePath ),
          {filePath: filePathNext} = await Path.getAllowedPath ( notesPath, baseName );

    File.write ( filePathNext, contentNext );

  }

  /* API */

  import = async ( filePaths: string[] ) => {

    const importTag = this._getImportTag ( filePaths.join ( '' ) );

    for ( let filePath of filePaths ) {

      const ext = path.extname ( filePath );

      switch ( ext ) {

        case '.enex':
          await this._importEnex ( filePath );
          break;

        case '.md':
        case '.mkd':
        case '.mdwn':
        case '.mdown':
        case '.markdown':
        case '.markdn':
        case '.mdtxt':
        case '.mdtext':
        case '.txt':
          await this._importMarkdown ( filePath, importTag );
          break;

        default:
          Dialog.alert ( 'Unsupported file type' );

      }

    }

  }

  select = async () => {

    const filePaths = this.dialog ();

    return this.import ( filePaths );

  }

  dialog = (): string[] => {

    const filePaths = remote.dialog.showOpenDialog ({
      title: 'Import Notes',
      buttonLabel: 'Import',
      filters: [
        { name: 'All Supported Formats', extensions: ['enex', 'md', 'mkd', 'mdwn', 'mdown', 'markdown', 'markdn', 'mdtxt', 'mdtext', 'txt'] },
        { name: 'Evernote', extensions: ['enex'] },
        { name: 'Markdown', extensions: ['md', 'mkd', 'mdwn', 'mdown', 'markdown', 'markdn', 'mdtxt', 'mdtext', 'txt'] }
      ],
      properties: ['openFile', 'multiSelections']
    });

    return filePaths || [];

  }

}

/* EXPORT */

export default Import;
