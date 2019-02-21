
/* IMPORT */

import * as _ from 'lodash';
import {shell} from 'electron';
import Dialog from 'electron-dialog';
import * as CRC32 from 'crc-32'; // Not a cryptographic hash function, but it's good enough (and fast!) for our purposes
import * as fs from 'fs';
import {Container, autosuspend} from 'overstated';
import * as path from 'path';
import Config from '@common/config';
import Attachments from '@renderer/utils/attachments';
import File from '@renderer/utils/file';
import Markdown from '@renderer/utils/markdown';
import Metadata from '@renderer/utils/metadata';
import Path from '@renderer/utils/path';
import Tags, {TagSpecials} from '@renderer/utils/tags';
import Utils from '@renderer/utils/utils';

const {ALL, FAVORITES, TAGS, TEMPLATES, UNTAGGED, TRASH} = TagSpecials;

/* NOTE */

class Note extends Container<NoteState, MainCTX> {

  /* VARIABLES */

  autosuspend = {
    methods: /^(?!_|middleware|(?:(?:get|is|has)(?![a-z0-9]))|read|sanitize|scrollTo)/
  };

  /* STATE */

  state = {
    note: undefined as NoteObj | undefined
  };

  /* CONSTRUCTOR */

  constructor () {

    super ();

    autosuspend ( this );

  }

  /* HELPERS */

  _inferTitleFromFilePath ( filePath: string ): string {

    return path.basename ( filePath, path.extname ( filePath ) ).replace ( /\∕/g, '/' ).replace ( /\s{2,}/g, ' ' ); // Substituting back dash-like characters

  }

  _inferTitleFromLine ( line: string | null, fallback: string = 'Untitled' ): string {

    return line ? Markdown.strip ( line.trim () ).replace ( /\s{2,}/g, ' ' ) || fallback : fallback;

  }

  /* API */

  new = async () => {

    const {ext, path: notesPath} = Config.notes;

    if ( !notesPath ) return;

    const {filePath, fileName} = await Path.getAllowedPath ( notesPath, `Untitled${ext}` ),
          searchQuery = this.ctx.search.getQuery (),
          searchNotes = this.ctx.search.getNotes (),
          name = searchQuery && !searchNotes.length ? searchQuery : path.parse ( fileName ).name,
          tag = this.ctx.tag.get (),
          metadata: Partial<NoteMetadataObj> = { title: name };

    if ( tag && tag.path !== ALL && tag.path !== TAGS && tag.path !== UNTAGGED ) { // Trying to put the new note in the current tag

      if ( tag.path === TRASH ) {

        metadata.deleted = true;

      } else if ( tag.path === FAVORITES ) {

        metadata.favorited = true;

      } else {

        metadata.tags = [tag.path];

      }

    }

    const plainContent = `# ${name}`,
          content = Metadata.set ( plainContent, metadata ),
          checksum = CRC32.str ( filePath ),
          note = await this.sanitize ({ content, filePath, checksum, plainContent, metadata });

    await this.add ( note );

    let noteAdded = this.get ( filePath );

    await this.write ( note );

    if ( !noteAdded ) {

      noteAdded = await this.getWait ( filePath );

    }

    if ( noteAdded ) { // It's possible that it was never found

      await this.set ( noteAdded, true );

      await this.ctx.editor.toggleEditing ( true );

    }

  }

  add = async ( note: NoteObj, _refresh: boolean = true ) => {

    const notes = _.clone ( this.ctx.notes.get () );

    notes[note.filePath] = note;

    await this.ctx.notes.set ( notes );

    await this.ctx.tags.update ({ add: [note] });

    if ( !_refresh ) return;

    await this.ctx.tag.update ();
    await this.ctx.search.update ();

  }

  duplicate = async ( note: NoteObj | undefined = this.state.note, resetTemplate: boolean = false ) => {

    if ( !note ) return;

    const notesPath = Config.notes.path;

    if ( !notesPath ) return;

    const duplicateNote = _.cloneDeep ( note ),
          baseName = path.basename ( note.filePath ),
          {filePath} = await Path.getAllowedPath ( notesPath, baseName );

    duplicateNote.filePath = filePath;
    duplicateNote.checksum = CRC32.str ( filePath );
    duplicateNote.metadata.title = this._inferTitleFromFilePath ( filePath );

    if ( resetTemplate ) {

      duplicateNote.metadata.favorited = false;
      duplicateNote.metadata.pinned = false;

      const tagsTemplates = this.getTags ( duplicateNote, TEMPLATES );

      duplicateNote.metadata.tags = _.without ( duplicateNote.metadata.tags, ...tagsTemplates );

    }

    await this.add ( duplicateNote );

    let noteAdded = this.get ( filePath );

    await this.write ( duplicateNote );

    if ( !noteAdded ) {

      noteAdded = await this.getWait ( filePath );

    }

    if ( noteAdded ) { // It's possible that it was never found

      await this.set ( noteAdded, true );

      await this.ctx.editor.toggleEditing ( true );

    }

  }

  delete = async ( note: NoteObj | undefined = this.state.note, confirmed: boolean = false, _refresh: boolean = true ) => {

    if ( !note ) return;

    const title = this.getTitle ( note ),
          attachments = this.getAttachments ( note ).map ( attachment => this.ctx.attachment.get ( attachment ) ).filter ( _.identity ) as AttachmentObj[],
          attachmentsUnique = attachments.filter ( attachment => this.ctx.attachment.getNotes ( attachment ).length < 2 );

    if ( !confirmed && !Dialog.confirm ( `Are you sure you want to permanently delete "${title}"${attachmentsUnique.length ? ` and ${attachmentsUnique.length === attachments.length ? 'all' : `${attachmentsUnique.length} out of ${attachments.length}`} attachments` : ''}?` ) ) return;

    if ( await File.exists ( note.filePath ) ) File.unlink ( note.filePath );

    const index = this.ctx.search.getNoteIndex ( note ),
          notes = _.clone ( this.ctx.notes.get () );

    delete notes[note.filePath];

    await this.ctx.notes.set ( notes );

    await this.ctx.tags.update ({ remove: [note] });

    await Promise.all ( attachmentsUnique.map ( attachment => this.ctx.attachment.delete ( attachment, true ) ) );

    if ( !_refresh || this.ctx.multiEditor.isSkippable () ) return;

    await this.ctx.tag.update ();
    await this.ctx.search.update ( index );

  }

  get = ( filePath?: string ): NoteObj | undefined => {

    return filePath ? this.ctx.notes.get ()[filePath] : this.state.note;

  }

  getWait = ( filePath?: string ): Promise<NoteObj | undefined> => { // Get the note waiting for it to become available (maybe it's being written to disk or something)

    let iteration = 0;

    return new Promise ( resolve => {

      const loop = () => {

        if ( iteration++ >= 1000 ) return resolve (); // Something unexpected probably happened, stop checking

        const note = this.get ( filePath );

        if ( !note ) return requestAnimationFrame ( loop );

        resolve ( note );

      };

      loop ();

    });

  }

  is = ( note1?: NoteObj, note2?: NoteObj, loose: boolean = false ): boolean => {

    return note1 === note2 || ( !!note1 && !!note2 && note1.filePath === note2.filePath && ( loose || note1.content === note2.content ) );

  }

  getAttachments = ( note: NoteObj | undefined = this.state.note ): string[] => {

    return note ? note.metadata.attachments : [];

  }

  getContent = ( note: NoteObj | undefined = this.state.note ): string => {

    return note ? note.content : '';

  }

  getPlainContent = ( note: NoteObj | undefined = this.state.note ): string => {

    return note ? note.plainContent : '';

  }

  getCreated = ( note: NoteObj | undefined = this.state.note ): Date => {

    return note ? note.metadata.created : new Date ();

  }

  getModified = ( note: NoteObj | undefined = this.state.note ): Date => {

    return note ? note.metadata.modified : new Date ();

  }

  getChecksum = ( note: NoteObj | undefined = this.state.note ): number => {

    return note ? note.checksum : NaN;

  }

  getTags = ( note: NoteObj | undefined = this.state.note, startingWith?: string ): string[] => {

    if ( !note ) return [];

    const tags = note.metadata.tags;

    return startingWith ? tags.filter ( tag => tag === startingWith || tag.startsWith ( `${startingWith}${Tags.SEPARATOR}` ) ) : tags;

  }

  getTitle = ( note: NoteObj | undefined = this.state.note ): string => {

    return note ? note.metadata.title : '';

  }

  hasAttachment = ( note: NoteObj | undefined = this.state.note, attachment: AttachmentObj ): boolean => {

    if ( !attachment ) return false;

    const attachments = this.getAttachments ( note );

    return attachments.includes ( attachment.fileName );

  }

  addAttachments = async ( note: NoteObj | undefined = this.state.note, filePaths?: string[] ) => {

    if ( !note ) return;

    const attachmentsPath = Config.attachments.path;

    if ( !attachmentsPath ) return;

    if ( !filePaths ) filePaths = this.ctx.attachments.dialog ();

    if ( !filePaths.length ) return;

    const nextNote = _.cloneDeep ( note );

    for ( let srcPath of filePaths ) {

      let attachment = this.ctx.attachment.get ( srcPath );

      if ( !attachment ) { // Not an existing attachment

        attachment = this.ctx.attachment.read ( srcPath );

        const {filePath: dstPath, fileName} = await Path.getAllowedPath ( attachmentsPath, attachment.fileName );

        attachment.fileName = fileName;

        File.copy ( srcPath, dstPath );

      }

      nextNote.metadata.attachments.push ( attachment.fileName );

      nextNote.metadata.attachments = Attachments.sort ( nextNote.metadata.attachments );

    }

    await this.ctx.note.write ( nextNote );

  }

  _removeAttachment = ( note: NoteObj | undefined = this.state.note, attachment: AttachmentObj ) => { // Just remove the attachment from the note //UGLY

    if ( !note ) return;

    const nextNote = _.cloneDeep ( note );

    nextNote.metadata.attachments = _.without ( nextNote.metadata.attachments, attachment.fileName );

    return this.ctx.note.write ( nextNote );

  }

  removeAttachment = async ( note: NoteObj | undefined = this.state.note, attachment: AttachmentObj, confirmed: boolean = false ) => {

    if ( !note ) return;

    const notesWithAttachment = this.ctx.attachment.getNotes ( attachment ),
          willDeleteFile = ( notesWithAttachment.length < 2 );

    if ( !Dialog.confirm ( `Are you sure you want to ${willDeleteFile ? 'permanently delete' : 'remove, just from this note,'} "${attachment.fileName}"?` ) ) return;

    await this._removeAttachment ( note, attachment );

    if ( willDeleteFile ) {

      await this.ctx.attachment.delete ( attachment, true );

    }

  }

  replaceAttachment = ( note: NoteObj | undefined = this.state.note, attachment: AttachmentObj, nextAttachment: AttachmentObj ) => {

    if ( !note ) return;

    const nextNote = _.cloneDeep ( note );

    nextNote.metadata.attachments = _.without ( nextNote.metadata.attachments, attachment.fileName );

    nextNote.metadata.attachments.push ( nextAttachment.fileName );

    nextNote.metadata.attachments = Attachments.sort ( nextNote.metadata.attachments );

    return this.write ( nextNote );

  }

  addTag = ( note: NoteObj | undefined = this.state.note, tag: string ) => {

    if ( !note ) return;

    if ( note.metadata.tags.includes ( tag ) ) return;

    const nextTags = note.metadata.tags.concat ([ tag ]);

    return this.replaceTags ( note, nextTags );

  }

  addTags = ( note: NoteObj | undefined = this.state.note, tags: string[] ) => {

    if ( !note ) return;

    let nextTags = note.metadata.tags;

    for ( let tag of tags ) {

      if ( note.metadata.tags.includes ( tag ) ) continue;

      nextTags = nextTags.concat ([ tag ]);

    }

    return this.replaceTags ( note, nextTags );

  }

  removeTag = ( note: NoteObj | undefined = this.state.note, tag: string ) => {

    if ( !note ) return;

    const nextTags = _.without ( note.metadata.tags, tag );

    return this.replaceTags ( note, nextTags );

  }

  removeTags = ( note: NoteObj | undefined = this.state.note, tags: string[] ) => {

    if ( !note ) return;

    let nextTags = note.metadata.tags;

    for ( let tag of tags ) {

      nextTags = _.without ( nextTags, tag );

    }

    return this.replaceTags ( note, nextTags );

  }

  replaceTags = async ( note: NoteObj | undefined = this.state.note, tags: string[] ) => {

    if ( !note ) return;

    if ( _.isEqual ( note.metadata.tags, tags ) ) return;

    const nextNote = _.cloneDeep ( note );

    nextNote.metadata.tags = this.sanitizeTags ( tags );

    await this.write ( nextNote );

    await this.ctx.tags.update ({ add: [nextNote], remove: [note] });

    if ( this.ctx.multiEditor.isSkippable () ) return;

    await this.ctx.tag.update ();

  }

  isDeleted = ( note: NoteObj | undefined = this.state.note ): boolean => {

    return note ? !!note.metadata.deleted : false;

  }

  toggleDeleted = ( note: NoteObj | undefined = this.state.note, force: boolean = !this.isDeleted ( note ) ) => {

    if ( !note ) return;

    if ( force === this.isDeleted ( note ) ) return;

    const nextNote = _.cloneDeep ( note );

    nextNote.metadata.deleted = force;

    return this.write ( nextNote );

  }

  isFavorited = ( note: NoteObj | undefined = this.state.note ): boolean => {

    return note ? !!note.metadata.favorited : false;

  }

  toggleFavorite = async ( note: NoteObj | undefined = this.state.note, force: boolean = !this.isFavorited ( note ) ) => {

    if ( !note ) return;

    if ( force === this.isFavorited ( note ) ) return;

    const nextNote = _.cloneDeep ( note );

    nextNote.metadata.favorited = force;

    return this.write ( nextNote );

  }

  isPinned = ( note: NoteObj | undefined = this.state.note ): boolean => {

    return note ? !!note.metadata.pinned : false;

  }

  togglePin = ( note: NoteObj | undefined = this.state.note, force: boolean = !this.isPinned ( note ) ) => {

    if ( !note ) return;

    if ( force === this.isPinned ( note ) ) return;

    const nextNote = _.cloneDeep ( note );

    nextNote.metadata.pinned = force;

    return this.write ( nextNote );

  }

  toggleCheckboxNth = ( note: NoteObj | undefined = this.state.note, nth: number, force?: boolean ) => {

    if ( !note ) return;

    const plainContent = this.getPlainContent ( note ),
          plainContentNext = Markdown.extensions.utilities.toggleCheckbox ( plainContent, nth, force );

    return this.save ( note, plainContentNext );

  }

  openInApp = ( note: NoteObj | undefined = this.state.note ) => {

    if ( !note ) return Dialog.alert ( 'This note is no longer stored in disk' );

    return shell.openItem ( note.filePath );

  }

  read = async ( filePath: string ): Promise<NoteObj | undefined> => {

    const content = await File.read ( filePath );

    if ( _.isUndefined ( content ) ) return;

    const checksum = CRC32.str ( filePath ),
          metadata = Metadata.get ( content ),
          plainContent = Metadata.remove ( content ),
          note = await this.sanitize ({ content, filePath, checksum, plainContent, metadata });

    return note;

  }

  autosave = () => {

    if ( !this.ctx.editor.isEditing () ) return;

    const note = this.get ();

    if ( !note ) return;

    const data = this.ctx.editor.getData ();

    if ( !data ) return;

    return this.save ( note, data.content, data.modified );

  }

  save = async ( note: NoteObj | undefined = this.state.note, plainContent: string, modified: Date = new Date () ) => {

    if ( !note ) return;

    if ( note.plainContent === plainContent ) return;

    if ( !this.get ( note.filePath ) ) return; // The note got deleted in the mean time

    const nextNote = _.cloneDeep ( note ),
          titleLinePrev = Utils.getFirstUnemptyLine ( note.plainContent ),
          titleLineNext = Utils.getFirstUnemptyLine ( plainContent ),
          title = ( titleLinePrev !== titleLineNext ) ? this._inferTitleFromLine ( titleLineNext ) : note.metadata.title,
          didTitleChange = ( title !== note.metadata.title );

    nextNote.plainContent = plainContent;
    nextNote.metadata.modified = modified;
    nextNote.metadata.title = title;

    if ( didTitleChange ) {

      await this.replace ( note, nextNote ); // In order to immediately update the structures, this avoids some problems when editing a file very quickly

      const ext = path.extname ( note.filePath ) || Config.notes.ext,
            {filePath} = await Path.getAllowedPath ( path.dirname ( nextNote.filePath ), `${title}${ext}` );

      nextNote.filePath = filePath;

      await this.replace ( note, nextNote );

    }

    await this.write ( nextNote, modified );

  }

  write = async ( note: NoteObj, modified: Date = new Date () ) => { // Remember to update the export methods when modifying the written metadata

    const metadata = _.clone ( note.metadata );

    delete metadata.stat;

    metadata.created = metadata.created.toISOString () as any;
    metadata.modified = modified.toISOString () as any;

    if ( !this.getAttachments ( note ).length ) delete metadata.attachments;
    if ( !this.getTags ( note ).length ) delete metadata.tags;
    if ( !this.isDeleted ( note ) ) delete metadata.deleted;
    if ( !this.isFavorited ( note ) ) delete metadata.favorited;
    if ( !this.isPinned ( note ) ) delete metadata.pinned;

    note.content = Metadata.set ( note.plainContent, metadata );

    const notePrev = this.get ( note.filePath );

    if ( notePrev && notePrev !== note ) {

      await this.replace ( notePrev, note );

    }

    File.write ( note.filePath, note.content );

  }

  reveal = ( note: NoteObj | undefined = this.state.note ) => {

    if ( !note ) return Dialog.alert ( 'This note is no longer stored in disk' );

    return shell.showItemInFolder ( note.filePath );

  }

  sanitize = async ( note: Pick<NoteObj, Exclude<keyof NoteObj, 'metadata'>> & { metadata: Partial<NoteObj['metadata']> } ): Promise<NoteObj> => {

    if ( note.metadata.title && _.isNumber ( note.metadata.title ) ) {

      note.metadata.title = String ( note.metadata.title );

    } else if ( !note.metadata.title || !_.isString ( note.metadata.title ) ) {

      note.metadata.title = this._inferTitleFromFilePath ( note.filePath );

    }

    if ( !note.metadata.stat || !( note.metadata.stat instanceof fs.Stats ) ) {

      const stats = await File.stat ( note.filePath );

      if ( stats ) {

        note.metadata.stat = stats;

      }

    }

    if ( !note.metadata.created || !_.isDate ( note.metadata.created ) ) {

      note.metadata.created = note.metadata.created ? new Date ( note.metadata.created ) : ( note.metadata.stat ? new Date ( note.metadata.stat.birthtimeMs ): new Date () );

      if ( _.isNaN ( note.metadata.created.getTime () ) ) note.metadata.created = new Date ();

    }

    if ( !note.metadata.modified || !_.isDate ( note.metadata.modified ) ) {

      note.metadata.modified = note.metadata.modified ? new Date ( note.metadata.modified ) : ( note.metadata.stat ? new Date ( note.metadata.stat.mtimeMs ) : new Date () );

      if ( _.isNaN ( note.metadata.modified.getTime () ) ) note.metadata.modified = new Date ();

    }

    if ( !_.isArray ( note.metadata.attachments ) ) {

      note.metadata.attachments = [];

    } else {

      note.metadata.attachments = Attachments.sort ( this.sanitizeAttachments ( note.metadata.attachments ) );

    }

    if ( !_.isArray ( note.metadata.tags ) ) {

      note.metadata.tags = [];

    } else {

      note.metadata.tags = Tags.sort ( this.sanitizeTags ( note.metadata.tags ) ) as string[];

    }

    note.metadata.deleted = !!note.metadata.deleted;
    note.metadata.favorited = !!note.metadata.favorited;
    note.metadata.pinned = !!note.metadata.pinned;

    return note as NoteObj; //TSC

  }

  sanitizeAttachments = ( attachments: string [] ): string[] => {

    return attachments.filter ( _.isString )
                      .filter ( _.identity );

  }

  sanitizeTags = ( tags: string[] ): string[] => {

    return tags.filter ( _.isString )
               .map ( tag => _.trim ( tag, Tags.SEPARATOR ) )
               .filter ( tag => !/\/\s*\//.test ( tag ) ) //TODO: Should use `Tags.SEPARATOR`
               .filter ( _.identity );

  }

  scrollTo = ( note: NoteObj | undefined = this.state.note ) => {

    if ( !note ) return;

    const index = this.ctx.search.getNoteIndex ( note );

    if ( index === -1 ) return;

    $('#list-notes').trigger ( 'scroll-to-item', index );

  }

  set = async ( note?: NoteObj, clearSelection: boolean = false ) => {

    if ( !note || !this.get ( note.filePath ) ) note = undefined;

    const notePrev = this.state.note;

    if ( note === notePrev && !this.ctx.multiEditor.isEditing () ) return;

    await this.setState ({ note });

    await this.ctx.tag.setFromNote ( note );

    if ( clearSelection ) {

      await this.ctx.multiEditor.selectClear ();

    }

    this.scrollTo ( note );

  }

  replace = async ( note: NoteObj, nextNote: NoteObj, _refresh: boolean = true ) => {

    const isSameFile = ( note.filePath === nextNote.filePath ),
          isActiveNote = this.state.note && this.state.note.filePath === note.filePath;

    if ( !isSameFile ) {

      if ( await File.exists ( note.filePath ) ) File.unlink ( note.filePath );

    }

    const index = this.ctx.search.getNoteIndex ( note ),
          notes = _.clone ( this.ctx.notes.get () );

    delete notes[note.filePath];

    notes[nextNote.filePath] = nextNote;

    await this.ctx.notes.set ( notes );

    await this.ctx.tags.update ({ add: [nextNote], remove: [note] });

    if ( !_refresh || this.ctx.multiEditor.isSkippable () ) return;

    if ( isActiveNote ) {

      await this.ctx.tag.setFromNote ( nextNote );

    }

    await this.ctx.tag.update ();
    await this.ctx.search.update ( index ); //OPTIMIZE: This could be skipped

    if ( isActiveNote && this.ctx.search.getNoteIndex ( nextNote ) >= 0 ) {

      await this.set ( nextNote );

    }

  }

  update = ( prevIndex?: number ) => {

    const notes = this.ctx.search.getNotes (),
          note = this.state.note;

    if ( note && notes.includes ( note ) ) return;

    const index = prevIndex && prevIndex >= 0 ? Math.min ( notes.length - 1, prevIndex ) : 0,
          noteNext = notes[index];

    return this.set ( noteNext ); //TODO: Maybe this call should `clearSelection`

  }

}

/* EXPORT */

export default Note;
