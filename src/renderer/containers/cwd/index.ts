
/* IMPORT */

import {ipcRenderer as ipc, remote, shell} from 'electron';
import Dialog from 'electron-dialog';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import {Container, compose} from 'overstated';
import * as path from 'path';
import * as pify from 'pify';
import Config from '@common/config';
import Settings from '@common/settings';
import Tutorial from '@renderer/containers/main/tutorial';
import File from '@renderer/utils/file';
import Markdown from '@renderer/utils/markdown';

/* CWD */

class CWD extends Container<CWDState, CWDCTX> {

  /* API */

  get = () => {

    return Config.cwd;

  }

  set = async ( folderPath: string ) => {

    try {

      const hadTutorial = !!Settings.get ( 'tutorial' );

      await pify ( mkdirp )( folderPath );

      await pify ( fs.access )( folderPath, fs.constants.F_OK );

      Settings.set ( 'cwd', folderPath );

      const notesPath = Config.notes.path,
            hadNotes = ( notesPath && await File.exists ( notesPath ) );

      if ( !hadTutorial && !hadNotes && Config.flags.TUTORIAL ) {

        await this.ctx.tutorial.import ();

        Settings.set ( 'tutorial', true );

      }

      ipc.send ( 'cwd-changed' );

    } catch ( e ) {

      Dialog.alert ( `Couldn't access path: "${folderPath}"` );
      Dialog.alert ( e.message );

    }

  }

  select = () => {

    const folderPath = this.dialog ();

    if ( !folderPath ) return;

    return this.set ( folderPath );

  }

  selectDefault = () => {

    const folderPath = path.join ( os.homedir (), '.notable' );

    return this.set ( folderPath );

  }

  openInApp = () => {

    const cwd = this.get ();

    if ( !cwd ) return Dialog.alert ( 'No data directory set' );

    shell.openItem ( cwd );

  }

  dialog = (): string | undefined => {

    const folderPaths = remote.dialog.showOpenDialog ({
      title: 'Select Data Directory',
      buttonLabel: 'Select',
      properties: ['openDirectory', 'createDirectory', 'showHiddenFiles']
    });

    if ( !folderPaths || !folderPaths.length ) return;

    return folderPaths[0];

  }

  export = (note) => {
    const filepath = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
      title: 'Export Note',
      defaultPath: note.getTitle(),
      buttonLabel : 'Export',
      filters :[
       {name: 'HTML', extensions: ['html']}
      ]
    });

    let exportContent = '';;
    const { plainContent } = note.get();    
    const fileType = filepath.substr(filepath.lastIndexOf('.') + 1).toLowerCase();
    switch(fileType) {
      case 'html':
        const cssList = [
          'node_modules/primer-markdown/build/build.css', 
          'node_modules/codemirror/lib/codemirror.css', 
          'node_modules/codemirror-github-light/lib/codemirror-github-light-theme.css'];
        const style = cssList.map(css => fs.readFileSync(path.resolve('', css), 'utf8')).join('');
        exportContent = `
        <head>
          <style>${style}</style>
        </head>
        <div class='markdown-body'>
          ${Markdown.render(plainContent)}
        </div>
        `;
        break;
    }
    fs.writeFile(filepath, exportContent, err => {
      if (err) {
        Dialog.alert(err.message);
        return;
      }
      Dialog.alert('Export file success!');
    });
  }

}

/* EXPORT */

export default compose ({
  tutorial: Tutorial
})( CWD ) as ICWD;
