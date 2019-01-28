
/* IMPORT */

import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as pify from 'pify';

/* FILE */

const File = {

  /* HELPERS */

  async _handleError ( e, filePath, method, args ) {

    if ( e.code === 'ENOENT' ) {

      await pify ( mkdirp )( path.dirname ( filePath ) );

      return method ( ...args );

    }

  },

  /* API */

  async exists ( filePath: string ): Promise<boolean> {

    try {

      await pify ( fs.access )( filePath, fs.constants.F_OK );

      return true;

    } catch ( e ) {

      return false;

    }

  },

  async stat ( filePath: string ): Promise<fs.Stats | undefined> {

    try {

      return await pify ( fs.stat )( filePath );

    } catch ( e ) {

      return;

    }

  },

  async read ( filePath: string, encoding: string = 'utf8' ): Promise<string | undefined> {

    try {

      return ( await pify ( fs.readFile )( filePath, {encoding} ) ).toString ();

    } catch ( e ) {

      return;

    }

  },

  async copy ( srcPath: string, dstPath: string ) {

    try {

      return await pify ( fs.copyFile )( srcPath, dstPath );

    } catch ( e ) {

      return File._handleError ( e, dstPath, File.copy, [srcPath, dstPath] );

    }

  },

  async rename ( oldPath: string, newPath: string ) {

    try {

      return await pify ( fs.rename )( oldPath, newPath );

    } catch ( e ) {

      return File._handleError ( e, newPath, File.rename, [oldPath, newPath] );

    }

  },

  async write ( filePath: string, content: string ) {

    try {

      return await pify ( fs.writeFile )( filePath, content, {} );

    } catch ( e ) {

      return File._handleError ( e, filePath, File.write, [filePath, content] );

    }

  },

  async unlink ( filePath: string ) {

    try {

      return await pify ( fs.unlink )( filePath );

    } catch ( e ) {}

  }

};

/* EXPORT */

export default File;
