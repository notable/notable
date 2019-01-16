
/* GLOBALS */

declare const __static: string;
declare const Svelto: any;
declare const $: any;

/* BASE OBJECTS */

type AttachmentObj = {
  fileName: string,
  filePath: string
};

type AttachmentsObj = {
  [fileName: string]: AttachmentObj
};

type NoteMetadataObj = {
  attachments: string[],
  created?: number,
  dateCreated: Date,
  dateModified: Date,
  deleted: boolean,
  favorited: boolean,
  pinned: boolean,
  stat: import ( 'fs' ).Stats,
  tags: string[],
  title: string
};

type NoteObj = {
  content: string,
  filePath: string,
  checksum: number,
  plainContent: string,
  metadata: NoteMetadataObj
};

type NotesObj = {
  [filePath: string]: NoteObj
};

type TagObj = {
  collapsed: boolean,
  name: string,
  notes: NoteObj[],
  path: string,
  tags: {
    [name: string]: TagObj
  }
};

type TagsObj = {
  [filePath: string]: TagObj
};

/* MAIN CONTAINERS STATES */

type AttachmentState = {};

type AttachmentsState = {
  attachments: AttachmentsObj
  editing: boolean
};

type EditorState = {
  editing: boolean
};

type EditorEditingState = undefined | {
  filePath: string,
  scrollTop: number,
  selections: any[]
};

type EditorPreviewingState = undefined | {
  filePath: string,
  scrollTop: number
};

type ImportState = {};

type LoadingState = {
  loading: boolean
};

type MultiEditorState = {
  notes: NoteObj[],
  skippable: boolean
};

type NoteState = {
  note: NoteObj | undefined
};

type NotesState = {
  notes: NotesObj
};

type SearchState = {
  query: string,
  notes: NoteObj[]
};

type SortingState = {
  by: import ( '@renderer/utils/sorting' ).SortingBys,
  type: import ( '@renderer/utils/sorting' ).SortingTypes
};

type TagState = {
  tag: string
};

type TagsState = {
  tags: TagsObj,
  editing: boolean
};

type TrashState = {};

type TutorialState = {};

type WindowState = {
  focus: boolean,
  fullscreen: boolean
};

/* MAIN */

type MainState = {
  attachment: AttachmentState,
  attachments: AttachmentsState,
  editor: EditorState,
  import: ImportState,
  loading: LoadingState,
  multiEditor: MultiEditorState,
  note: NoteState,
  notes: NotesState,
  search: SearchState,
  sorting: SortingState,
  tag: TagState,
  tags: TagsState,
  trash: TrashState,
  tutorial: TutorialState,
  window: WindowState
};

type MainCTX = {
  _prevFlags?: StateFlags,
  state: MainState,
  suspend (),
  unsuspend (),
  suspendMiddlewares (),
  unsuspendMiddlewares (),
  refresh (),
  listen (),
  attachment: import ( '@renderer/containers/main/attachment' ).default,
  attachments: import ( '@renderer/containers/main/attachments' ).default,
  editor: import ( '@renderer/containers/main/editor' ).default,
  import: import ( '@renderer/containers/main/import' ).default,
  loading: import ( '@renderer/containers/main/loading' ).default,
  multiEditor: import ( '@renderer/containers/main/multi_editor' ).default,
  note: import ( '@renderer/containers/main/note' ).default,
  notes: import ( '@renderer/containers/main/notes' ).default,
  search: import ( '@renderer/containers/main/search' ).default,
  sorting: import ( '@renderer/containers/main/sorting' ).default,
  tag: import ( '@renderer/containers/main/tag' ).default,
  tags: import ( '@renderer/containers/main/tags' ).default,
  trash: import ( '@renderer/containers/main/trash' ).default,
  tutorial: import ( '@renderer/containers/main/tutorial' ).default,
  window: import ( '@renderer/containers/main/window' ).default
};

type IMain = MainCTX & { ctx: MainCTX };

/* CWD */

type CWDState = {};

type CWDCTX = {
  get ();
  set ();
  select ();
  selectDefault ();
  openInApp ();
  dialog ();
  tutorial: import ( '@renderer/containers/main/tutorial' ).default
};

type ICWD = CWDCTX & { ctx: CWDCTX };

/* OTHERS */

type StateFlags = {
  hasNote: boolean,
  isAttachmentsEditing: boolean,
  isEditorEditing: boolean,
  isMultiEditorEditing: boolean,
  isNoteDeleted: boolean,
  isNoteFavorited: boolean,
  isNotePinned: boolean,
  isTagsEditing: boolean,
  isNoteTemplate: boolean
};
