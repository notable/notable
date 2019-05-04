
/* IMPORT */

import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as pify from 'pify';

/* STORAGE */

const Storage = { //TODO: This shouldn't be here

  /* VARIABLES */

  operations: 0, // Number of currently pending operations

  /* HELPERS */

  _wrapAction ( action: Function ) {

    return async function wrappedAction ( ...args: any[] ) {
      Storage.operations++;
      const res = await action.apply ( undefined, args );
      Storage.operations--;
      return res;
    };

  },

  /* API */

  isIdle () {

    return !Storage.operations;

  }

};

/* FILE */

const File = {

  /* VARIABLES */

  storage: Storage,

  /* HELPERS */

  _handleError: async ( e: NodeJS.ErrnoException, filePath: string, method: Function, args: any[] ) => {

    if ( e.code === 'ENOENT' ) {

      await pify ( mkdirp )( path.dirname ( filePath ) );

      return method ( ...args );

    }

  },

  /* API */

  exists: Storage._wrapAction ( async ( filePath: string ): Promise<boolean> => {

    try {

      await pify ( fs.access )( filePath, fs.constants.F_OK );

      return true;

    } catch ( e ) {

      return false;

    }

  }),

  stat: Storage._wrapAction ( async ( filePath: string ): Promise<fs.Stats | undefined> => {

    try {

      return await pify ( fs.stat )( filePath );

    } catch ( e ) {}

  }),

  read: Storage._wrapAction ( async ( filePath: string, encoding: string = 'utf8' ): Promise<string | undefined> => {

    try {

      return ( await pify ( fs.readFile )( filePath, {encoding} ) ).toString ();

    } catch ( e ) {}

  }),

  copy: Storage._wrapAction ( async ( srcPath: string, dstPath: string ) => {

    try {

      return await pify ( fs.copyFile )( srcPath, dstPath );

    } catch ( e ) {

      return await File._handleError ( e, dstPath, File.copy, [srcPath, dstPath] );

    }

  }),

  rename: Storage._wrapAction ( async ( oldPath: string, newPath: string ) => {

    try {

      return await pify ( fs.rename )( oldPath, newPath );

    } catch ( e ) {

      return await File._handleError ( e, newPath, File.rename, [oldPath, newPath] );

    }

  }),

  write: Storage._wrapAction ( async ( filePath: string, content: string ) => {

    try {

      return await pify ( fs.writeFile )( filePath, content, {} );

    } catch ( e ) {

      return await File._handleError ( e, filePath, File.write, [filePath, content] );

    }

  }),

  unlink: Storage._wrapAction ( async ( filePath: string ) => {

    try {

      return await pify ( fs.unlink )( filePath );

    } catch ( e ) {}

  })

};

/* EXPORT */

export default File;
