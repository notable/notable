
/* GLOBALS */

declare const __static: string;
declare const Svelto: any;

/* CASH */

//TODO: Update cash: https://github.com/kenwheeler/cash/issues/274

type cash = typeof import ( 'cash-dom' ).default;
type Cash = ReturnType<cash>;

declare const $: cash & {
  [index: string]: any,
  $document: Cash,
  $window: Cash
};

/* BASE OBJECTS */

type AttachmentObj = {
  fileName: string,
  filePath: string
};

type AttachmentsObj = {
  [fileName: string]: AttachmentObj
};

type MonacoEditor = import ( 'monaco-editor/esm/vs/editor/editor.api.js' ).editor.ICodeEditor & {
  getChangeDate: () => Date | undefined,
  getFilePath: () => string
};

type NoteMetadataObj = {
  attachments: string[],
  created: Date,
  modified: Date,
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

type QuickPanelResultsRawItem = {
  title: string,
  description?: string
};

type QuickPanelResultsNoteItem = NoteObj;

type QuickPanelResultsAttachmentItem = AttachmentObj;

type QuickPanelResultsItem = QuickPanelResultsRawItem | QuickPanelResultsNoteItem | QuickPanelResultsAttachmentItem;

type QuickPanelResults = {
  empty: string,
  items: QuickPanelResultsItem[]
};

type TagObj = {
  collapsed: boolean,
  name: string,
  notes: NoteObj[],
  path: string,
  icon?: string,
  iconCollapsed?: string,
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
  monaco?: MonacoEditor,
  editing: boolean,
  split: boolean
};

type EditorEditingState = {
  filePath: string,
  model: import ( 'monaco-editor/esm/vs/editor/editor.api.js' ).editor.ITextModel | null,
  view: import ( 'monaco-editor/esm/vs/editor/editor.api.js' ).editor.ICodeEditorViewState | null
};

type EditorPreviewingState = {
  filePath: string,
  scrollTop: number
};

type ExportState = {};

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

type QuickPanelState = {
  open: boolean,
  query: string,
  itemIndex: number,
  results: QuickPanelResults
};

type SearchState = {
  query: string,
  notes: NoteObj[]
};

type SkeletonState = {};

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
  fullscreen: boolean,
  sidebar: boolean,
  zen: boolean
};

/* MAIN */

type MainState = {
  attachment: AttachmentState,
  attachments: AttachmentsState,
  editor: EditorState,
  export: ExportState,
  import: ImportState,
  loading: LoadingState,
  multiEditor: MultiEditorState,
  note: NoteState,
  notes: NotesState,
  quickPanel: QuickPanelState,
  search: SearchState,
  skeleton: SkeletonState,
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
  waitIdle (),
  attachment: import ( '@renderer/containers/main/attachment' ).default,
  attachments: import ( '@renderer/containers/main/attachments' ).default,
  editor: import ( '@renderer/containers/main/editor' ).default,
  export: import ( '@renderer/containers/main/export' ).default,
  import: import ( '@renderer/containers/main/import' ).default,
  loading: import ( '@renderer/containers/main/loading' ).default,
  multiEditor: import ( '@renderer/containers/main/multi_editor' ).default,
  note: import ( '@renderer/containers/main/note' ).default,
  notes: import ( '@renderer/containers/main/notes' ).default,
  quickPanel: import ( '@renderer/containers/main/quick_panel' ).default,
  search: import ( '@renderer/containers/main/search' ).default,
  skeleton: import ( '@renderer/containers/main/skeleton' ).default,
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
  get (),
  set (),
  select (),
  selectDefault (),
  openInApp (),
  dialog (),
  tutorial: import ( '@renderer/containers/main/tutorial' ).default
};

type ICWD = CWDCTX & { ctx: CWDCTX };

/* OTHERS */

type StateFlags = {
  hasNote: boolean,
  isAttachmentsEditing: boolean,
  isEditorEditing: boolean,
  isEditorSplitView: boolean,
  isMultiEditorEditing: boolean,
  isNoteDeleted: boolean,
  isNoteFavorited: boolean,
  isNotePinned: boolean,
  isTagsEditing: boolean,
  isNoteTemplate: boolean
};
