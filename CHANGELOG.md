## Version 1.8.4

##### Improvements
- Bundling OS-specific dependencies only when needed
  - This removes a file from Windows bundles that tripped Windows Defender into finding a false positive
- Importing: ensuring arbitrarily large notes collections containing arbitrarily many files with the same name are still imported correctly, assuming the underlying importing library can parse the collection in the first place

##### Bug Fixes
- Editor: disabled automatic clipboard copying when selecting in favor of being able to create multiple cursors while dragging with the middle click (Linux)
- Ensuring both creation date and modification date are updated when duplicating a note
- Ensuring paste actions when dragging with the middle click are only prevented inside the editor (Linux)
- Fixed misalignment in loose task lists
- Fixed some regexes that were wrongly expecting to match at least one character in certain places
- Multi-cursors: using “Ctrl+MouseEvent” rather than “Alt+MouseEvent” as the latter switches the focus to the menu bar (Windows)

## Version 1.8.3

##### Improvements
- Cheatsheet: added a section about escaping
- Cheatsheet: mentioning double- and triple-backticks inline code
- Cheatsheet: mentioning emails wrapped in angle brackets
- Cheatsheet: mentioning links with custom title attributes
- Cheatsheet: opening `<details>` tags by default
- Export: opening `<details>` elements by default when exporting to PDF
- Export: using a slightly clearer folder export name
- Improved default styling of `<details>` and `<summary>` elements
- Importing from Evernote: preserving links to attachments, especially if they are web-clipped attachments
- Importing from Evernote: preserving a link to the source of the web-clipped page
- Importing from Boostnote: rewriting links to attachments
- KaTeX: rendering “math” codeblock with it too
- Menu: added “Alt+InitialCharacter” shortcuts for all main submenus
- Light theme: improved active item contrast in the sidebar
- Themes: updated scrollbar colors

##### Bug Fixes
- About window: ensuring it is rendered without extra/missing spacing across platforms
- Context menu: ensuring extra separators are removed correctly
- Context menu: ensuring menu items for pinning/unpinning a note are provided
- Editor: more reliably showing scrollbars if necessary
- Ensuring “Tags” gets uncollapsed too if necessary
- Ensuring a paste action is not triggered when dragging with the mouse’s middle button (Linux)
- Ensuring all ICANN TLDs are supported when auto-linking urls
- Ensuring all special-use ICANN TLDs are supported when auto-linking urls
- Ensuring each separate window remembers its own data directory after being reloaded
- Ensuring file watching is always performed efficiently, even in signed production builds (macOS)
- Ensuring links with a custom title attribute are parsed correctly
- Ensuring links with no protocol are handled conrrectly inside `<img>` and `<source>` elements
- Ensuring no other modal window can be opened while asking to select a data directory
- Ensuring relative paths that don’t start with a dot are resolved too
- Ensuring the app is reset properly when the current data directory becomes unavailable
- Ensuring the preview of the current note gets refreshed when necessary
- Exporting: more reliable detection of useful CSS
- Fixed a bug that could have prevented the UI from updating after a particular series of filesystem events
- Fixed an issue that caused multiple identical actions to occur instead of one
- Fixed an issue regarding resolving absolute UNC-style paths
- Fixed misalignment when dealing with multi-line code blocks nested in lists
- Importing: improved conversion of text-align-ed tags
- Importing: improved reliability when importing notes with non-string titles
- Importing: more reliably importing large collections of notes
- Importing from Evernote: more reliably importing web-clipped attachments
- Markdown: improved double-backticks inline code detection
- More reliable “rename” filesystem event detection
- More reliable “change” filesystem event detection where the file gets unlinked and recreated quickly
- More reliable `<markdown>` tag parsing
- Multi-cursors: using “Ctrl+MouseEvent” rather than “Alt+MouseEvent” as the latter conflicts with OS-level shortcuts (Linux)
- PHP: optimized syntax highlighting for snippets, making the starting `<?`/`<?php` token optional
- Syntax highlighting: fixed support for strikethrough text under the dark theme
- Syntax highlighting: improved double-backticks inline code detection
- Syntax highlighting: improved handling of code blocks nested in lists
- Syntax highlighting: improved support for triple-backticks (or more) inline code
- Updater: avoiding showing the same toast multiple times at once whenever possible
- Updater: ensuring a fresh online status is retrieved before attempting to check for updates

## Version 1.8.2

##### Improvements
- Cheatsheet: mentioning urls and emails wrapped in angle brackets
- Link sharing: asking for confirmation before generating the shareable link
- Link sharing: added support for querying `https://echo.notable.md/delete/[ID]` for immediately deleting a shared note
- Editor: always showing the scrollbar, for consistency (Windows) (Linux)
- Navigator: retrieving public IPv4 by querying `ip.notable.md` rather than `ipv4.icanhazip.com`
- Navigator: retrieving online status by querying `ip.notable.md` rather than `api.github.com`
- Syntax highlighting: added support for links and emails wrapped in angle brackets
- Zen mode: showing a draggable titlebar on hover (macOS)
- Showing a toast when copying a code block to the clipboard

##### Bug Fixes
- AsciiMath and KaTeX: improved expression detection when the expression starts with the `<` character
- AsciiMath and KaTeX: ensuring the outputted HTML doesn’t get messed up by the Markdown compiler
- KaTeX: improved multi-line block syntax highlighting
- Editor: ensuring it receives the focus when creating or duplicating a note
- Editor: improved state restoration logic
- Export: ensuring base64-encoded font files are exported properly
- Export: ensuring code blocks can wrap when exporting to PDF
- Multi-editor: ensuring Shift-selecting works even when CtrlOrCmd is pressed
- Multi-editor: ensuring the currently active note can be displayed as deselected
- Tutorial: ensuring the online link works
- Asking to select a data directory if the current one is unavailable
- Improved support for HTML attributes that are wrapped in single quotes or unwrapped
- Improved unfenced codeblocks detection
- Showing an alert when switching to a data directory that doesn't contain any notes
- Showing an error if the app can’t be moved into the `/Applications` folder (macOS)
- Ensuring context menus account for the current zoom factor
- Ensuring deeply nested mixed lists and tasks are properly aligned regardless of their order
- Ensuring double quotes don’t get transformed to single quotes in code blocks
- Ensuring filesystem events detected outside of the current data directory are ignored
- Ensuring regexes that should only match horizontal whitespace characters don’t also match vertical ones
- Ensuring relative paths are resolved relative to the actual file path of the current note
- Ensuring that if the current data directory is removed or renamed the app detects it and reacts to it
- Expading the necessary parent tags when selecting an hidden tag

## Version 1.8.1

##### Improvements
- Updated Electron to v7.1.1
- Syntax highlighting: added many language aliases supported by GitHub
- Syntax highlighting: improved JSON language support

##### Bug Fixes
- More reliably detecting the front matter
- Ensuring checkboxes ids are incremented properly
- Ensuring heading ids are incremented properly
- Ensuring heading ids are generated properly even when containing HTML elements
- Ensuring Windows-style absolute paths and UNC paths are supported
- Importing: more reliably importing `.enex` files
- Importing: throwing an error for huge files (> 1GB)
  - If you're hitting this error just import your notes in smaller chunks

## Version 1.8.0

##### New Features
- Upgraded Electron to v7
- Added a button for generating a share link (_Experimental_)
  - Notes will be stored in the server only for 24h at maximum
  - Features that require JavaScript to work won't work and only linked image attachments can be shared this way
- Rewritten build toolchain
  - Mac: disabled `pkg` bundle
  - Mac: enabled notarization
  - Windows: disabled `portable` bundle
  - Windows: added support for 32-bit systems
  - Linux: enabled `pacman` bundle
- Implemented some telemetry data
  - You can turn them off by setting `"telemetry": false` in `~/.notable.json`
  - You can check what data is being transmitted via the "Network" section of the devtools
  - IP addresses are anonymized by default (the last portion of your IPv4 gets zeroed)
- Non-overlay scrollbars are now themed
  - This improves the look of the dark theme under Windows significantly
- Syntax highlighting: added support for ABAP, MIPS, pascaligo, Sophia ML and Twig
- Mermaid: opening diagrams in the browser rather than in their own windows
- Added an “Help -> Sponsor” menu item
- Setted minimum allowed height to 250px
- Setting minimum allowed width dynamically depending on the active view mode
- Rewritten “Select Data Directory...” window as a modal window

##### Improvements
- Markdown: improved syntax highlighting for headers containing HTML entities
- Setting dark appearance also when using dark themes
- Updating window background color when changing themes
- Updated `dmg` bundle's background image
- Updated homepage url
- Updated contact urls
- Updated manual download URL
- Updated some dependencies
- Removed a few dependencies
- Ensuring all dependencies are bundled via WebPack
  - The size of the shipped minified codebase (minus Electron) is now about 5.5MB
- Lazy loading some rarely used dependencies

##### Bug Fixes
- Syntax highlighting: ensuring “c++” is a supported language name
- Ensuring single notes changes are detected properly
- Fixed a race condition that could have lead to data loss when using third-party synchronization services
- Fixed support for legacy CR line endings
- More reliably retrieving and writing to unused paths
- Retrying failed actions more reliably
- Writing files atomically, ensuring files can’t get corruped while getting written to disk

## Version 1.7.3

##### Improvements
- Markdown: improved syntax highlighting for lists starting with multiple list markers
- Improved HTML entities detection
- Using a more precise timestamp in pasted image attachments

##### Bug Fixes
- ASCIIMath: ensuring ampersands used inside KaTeX code aren’t considered as part of an ASCIIMath expression
- Highlighter: ensuring it doesn’t break the “copy code to clipboard” feature
- Editor: disabling default paste behavior more reliably
- Ensuring only relative links to supported Markdown extensions will be recognized as links to notes
- Retrieving “data-*” attributes more reliably, ensuring strings remain strings

## Version 1.7.2

##### Bug Fixes
- Ensuring HTML and Enex files can be imported

## Version 1.7.1

##### Bug Fixes
- Ensuring exporting to HTML and PDF works even if Monaco has not been initialized yet

## Version 1.7.0

##### New Features
- Added support for adding image attachments via copy and paste
- Added support for closing the window with `CtrlOrCmd+Shift+W`
- Added a dialog asking for confirmation before closing a window
- Added a shortcut for toggling pinning
- Added support for writing subscripts
- Added support for writing superscripts
- Added support for writing footnotes
- Added a menu entry for displaying a Markdown cheatsheet
- Added a menu entry for displaying all the provided shortcuts
  - Showing OS-specific shortcuts
- Added a menu entry for displaying all the provided emojis
- Added support for a custom `<markdown>` HTML tag, everything written inside it will be rendered as Markdown
- Added support for linking to other notes using the `@note` token without explicitly providing the file extension
- Added `.mkdn` to the list of supported Markdown extensions
- Added support for importing HTML notes
- Added support for importing Boostnote notes

##### Improvements
- Editor: improved formatting detection
- Changelog: opening it inside the app
- Comparison table: updated some cells
- Tutorial: linking to the online version relevant to the currently installed version
- Updater: detecting offline status
- Ensured syntax highlighting when previewing and editing is always exactly the same
- Ensured all pngs are losslessly compressed
- Improved supports for manually encoded urls
- Improved detection of code blocks
- Changed shortcut for reloading the app to `F5`

##### Bug Fixes
- AsciiMath: ensured regular anchors are detected
- AsciiMath: ensured autolinked anchors are detected
- Editor: ensured pressing “esc” while having multiple cursors doesn’t close the editor
- Export: ensured Monaco tokens styles are exported
- Export: ensured mermaid diagrams are exported properly
- KaTeX: ensured all borders/dividers/lines are clearly visible
- Markdown: more reliable stripping
- Preview: rendering tasks more reliably
- Ensured links pointing to a local file are supported too
- Improved detection of currently opened windows

## Version 1.6.2

##### New Features
- Added a shortcut for reloading the window

##### Improvements
- Improved CommonMark v0.29 compatibility

##### Bug Fixes
- Metadata: fixed support for Windows-style line breaks
- Tasks: ensuring the bullet point is not displayed

## Version 1.6.1

##### Bug Fixes
- Metadata: ensuring empty strings are parsed correctly too

## Version 1.6.0

##### New Features
- Added support for linking to search queries
- Added support for the "Diff" language
- Added a menu entry for toggling the menu bar (Windows) (Linux)
- Added a menu entry for making the app translucent (macOS) (Windows)
- Added a shortcut for opening the current data directory
- Added a shortcut for changing the current data directory
- Editor: added a shortcut for toggling line numbers
- Editor: added a shortcut for toggling scrolling beyond the last line
- Editor: added support for quickly wrapping selections with the following characters: (, ], {, ‘, “, `, _, *, ~
- Editor: added autocompletion support of the following characters sequences: ~~~, ```
- Maximizing/unmaximazing the window when double-clicking the toolbars (macOS)
- Released a custom folder icon (macOS)
- Using natural sorting
- Uploader: using custom notifications, ensuring they are always displayed even when “do not disturb” is enabled
- KaTeX: added support for multi-line block expressions

##### Improvements
- Major portions of the codebase have been refactored or rewritten
- Significantly improved performance
  - Showing the main window ~30% faster on startup
  - Targeting ES2019 rather than ES2015
  - Replaced previous state-management library with [Overstated v2](https://github.com/fabiospampinato/overstated)
  - Replaced previous shortcuts library with [shortcuts](https://github.com/fabiospampinato/shortcuts)
  - Reloading the window instead of reopening it when changing data directory
  - Minimized re-renderings when only part of the state changes
  - Avoiding loading the “Stats” object for each note when modified/created metadata are available
  - Filesystem watcher: exiting earlier on initial “add” events
  - Rewritten front-matter library
  - Markdown: rendering using [markdown-it](https://github.com/markdown-it/markdown-it) rather than [showdown](https://github.com/showdownjs/showdown)
    - Small (~3KB) notes are now rendered up to 30x faster
    - Large (~1MB) notes are now rendered up to 150x faster
  - Markdown plugins: lazy loading expensive syntax plugins
  - Lazy loading expensive modules and components
  - Context-menus are registered and opened much faster
  - Improved performance when adding attachments
- Significantly reduced bloat
  - Reduced dependencies from ~530 to ~150
  - Reduced size of the shipped uncompressed codebase from 59MB to 16MB
- Significantly improved TypeScript types strictness
  - Reduced "implicit any"s from ~450 to 28
- Significantly smaller app bundles
  - Reduced most bundles size by ~10%
  - Reduced `snap` bundle size by ~60%
- Editor: greatly improved syntax highlighting
- Editor: added margins to the top and left matching those found in preview
- Preview: ensuring it’s easily scrollable with either arrow keys or the spacebar
- Improved styling of inline code and code blocks
- Markdown: removed 25k characters limit
- MhChem: improved support for older expressions using the “\cf” macro
- Tutorial: added a note about KaTeX expressions containing a “$”
- Tutorial: updated link to MhChem docs
- Comparison table: ensuring the CSS is entirely self-contained
- Updater: checking for updates every 8h rather than every 24h

##### Bug Fixes
- Ensuring all emojis supported by GitHub are supported
- Ensuring all external links are opened outside of the app
- Ensuring only one window gets opened when opening a mermaid diagram in a separate window
- Ensuring the app doesn’t quit when initially selecting the data directory (Windows) (Linux)
- Implemented a partial workaround for an Electron bug that makes part of the window unresponsive (macOS)
- Editor: auto-selecting a note’s title only if it’s untitled
- Editor: ensuring the background color of the selection is consistent with the preview
- Editor: ensuring it’s focused when mounted
- Editor: saving its state more reliably
- Editor: ensuring ordered lists starting like “1) ” are syntax-highlighted too
- Split Editor: ensuring its focus is preserved while switching notes
- Preview: removed flickering when re-rendering
- Preview: ensuring scrolling position is preserved under the most common scenarios
- Quick Open: ensuring notes are always sorted ascending by title, and the pinned status is ignored
- Quick Open: ensuring notes not currently visible in the middlebar are still selectable
- KaTeX: ensuring fraction lines are clearly visible
- KaTeX/AsciiMath: improved support for lines containing more than 2 delimiters
- KaTeX/AsciiMath: much more reliable rendering
- Note: ensuring a note’s modified date is updated when necessary
- Note: saving more reliably
- Highlighter: fixed an issue regarding aliased languages
- Fixed middlebar scrolling behavior when updating a note so that its position changes
- Updater: avoiding checking for updates every time the data directory changes
- Updater: showing a notification if the current app format is not supported
- Tutorial: ensuring the “Welcome” note and the “Notebooks/Tutorial” tag are selected when importing the tutorial

## Version 1.5.1

##### Improvements
- Auto-hiding the menu in the “Select Data Directory” window
- MacOS: asking the user to move the app to `/Applications`

##### Bug Fixes
- Ensuring the Linux releases work
- Updater: fixed link to latest linux release
- Updater: fixed link to latest windows release

## Version 1.5.0

##### New Features
- Added a dark theme
- Editor: added cut/copy/paste support via the context menu
- Mermaid: added a button for opening diagrams in a separate window
- Prompting the user if he/she wants a new note to be created after clicking a link to a non-existent note
- Added context menu actions for copying attachments/tags/notes names

##### Improvements
- Upgraded to Electron v5
- Moved import/export menu entries under “File”
- Markdown: improved stripping of headers, emojis, images, links, wikilinks and todos
- Updater: prompting the user to update manually if necessary
- Export: greatly reduced exported HTML size
- Export: added a favicon to exported HTML notes
- Export: ensuring codeblocks in exported PDFs don't need to be scrolled

##### Bug Fixes
- Saving notes more reliably
- Monaco: fixed blurriness issue
- Ensuring the highlighter outputs valid HTML
- Decoding entities from inferred titles
- Worked around a subtle Cash/React incompatibility
- Avoiding using ids, as they may conflict with the rendered note
- Fixed trash context menu
- Context menus: improved reliability
- Markdown: disabled characters capping on export
- Quick Open: ensuring the context menu is provided for notes and attachments
- Quick Open: ensuring it’s always scrolled all the way to the top when opening it
- Quick Open: ensuring it always searches all notes

## Version 1.4.0

##### New Features
- Switched to the AGPL license
- Added a “Toggle Sidebar” menu entry
- Added a Zen mode
- Added a “Quick Open” panel
- Added a button for copying codeblocks to the clipboard
- Search: added a button for clearing the input
- KaTeX: added support for mhchem
- Replaced CodeMirror with Monaco
  - Added a shortcut for toggling the minimap
  - Check all the updated shortcuts [here](https://github.com/notable/notable/blob/master/resources%2Ftutorial%2Fnotes%2F07%20-%20Shortcuts.md#editor)

##### Improvements
- Wiki-style links: always treat them as inline links
- Syntax highlighting: improved support for some shell languages
- Prompting the user before overwriting unsaved changes
- Error boundary: creating a pre-filled bug report when reporting an error
- Search: ensuring the notes list is navigable with arrow keys
- Minor UI update — Major UI-related code refactoring
- Export: ensuring all test notes are exported perfectly under all supported formats
- Automatically selecting the title when editing empty notes

##### Bug Fixes
- AsciiMath/KaTeX: ensuring the special characters can be escaped with a backslash
- Ensuring 1-character KaTex and AsciiMath expressions are supported
- Ensuring HTML entities don’t cause unnecessary AsciiMath renders
- Ensuring the editor gets updated when the content changes
- Updating the app menu when there are no windows open
- Wiki-style links: more reliable extension detection
- Filesystem watcher: more reliable
- Editor: force focusing only on mount
- Markdown: improved emoji detection
- Attachments: ensuring some special system files are not considered
- Ensuring the about window is not fullscreenable
- Ensuring multiple attachments with the same name can be used
- Ensuring the app quits properly under Windows/Linux when closing the window
- Ensuring new notes aren’t created inside the trash
- Ensuring tags (except for the default one) without notes are not selected
- Markdown: ensuring links without a protocol are supported
- Renaming + overwriting notes instead of deleting + creating notes
- Writing/renaming notes less asynchronously
- Waiting for any pending API or IO operations before closing the app

## Version 1.3.0

##### New Features
- Updater: added a menu entry for checking for updates
- Added a menu entry for opening the subreddit
- Added Wiki-style links supports
- Added support for linking to attachments from `source` elements

##### Improvements
- Notes: avoiding unnecessary updates because of filesystem changes
- Much more reliable autosaving and more accurate modification date
- Dependencies: removed `remark` and `strip-markdown`
- Dependencies: removed `showdown-target-blank`
- Dependencies: removed `electron-localshortcut`
- Dependencies: replaced `decompress` with `extract-zip`
- Dependencies: replaced `globby` to `tiny-glob`
- Dependencies: replaced `shallowequal` with `is-shallow-equal`
- Dependencies: replaced `highlight.js` with `prism`
- Dependencies: replaced `showdown-katex-studdown` with `asciimath2tex`
- Dependencies: updated `enex-dump` (shaved ~10mb from bundle)
- Updater: checking for updates after the app is loaded and every 24h
- Markdown: avoiding storing previous renders
- Tutorial: mentioning the subreddit and the Patreon page
- Tutorial: mentioning Wiki-style links
- Tutorial: updated sections about KaTeX and AsciiMath

##### Bug Fixes
- Fixed support for URLs fragments
- Fixed support for relative links inside `a` and `img` tags
- Markdown: made extensions much more reliable
- Markdown: more advanced stripping logic
- Markdown: un-wrapping the output when stripping
- Markdown: improved support for emails
- Markdown: ensuring anonymous code blocks are rendered properly
- Autosave: properly handling app quits, window closes and reloads events
- Ensuring the app quits when asked to do so
- Ensuring the app doesn’t crash when changing data directory
- Search: ensuring existing tags are still selectable even when they have no results
- Avoiding refocusing windows twice
- KaTeX: requiring a stricter syntax
  - Wrap formulas in `$$..$$` and `$..$`
  - There mustn't be spaces at the beginning and end of a formula
  - The ending `$` character musn't be followed by a digit
- AsciiMath: ensuring it doesn’t conflict with KaTeX
  - Wrap formulas in `&&..&&` and `&..&`
  - There mustn't be spaces at the beginning and end of a formula
  - The ending `&` character musn't be followed by a digit
- Ensuring the columns are not themselves scrollable
- Improved toggleable checkboxes implementation
- Removed shortcut for `Toggle Developer Tools`
- Updater: ensuring secondary notifications are shown only when manually checking for updates
- Updater: ensuring the menu gets properly restored after checking

## Version 1.2.0

##### New Features
- Added a cross-platform “About” window
- Export: added support for HTML
- Export: added support for Markdown
- Export: added support for PDF
- Added “Undo” and “Redo” to the menu
- Added an `Help -> View Changelog` menu entry
- Added a menu entry for opening the devtools
- Added a “Float on top” menu entry
- Added a “New from Template” menu entry
- Added a shortcut for “Permanently Delete”
- Added some delete-key based shortcuts for trashing/restoring/deleting a note
- Added basic support for range selection when holding shift key
- Added support for toggling checkboxes in preview mode
- Added a Split-View mode
- Added autosaving capabilities
- Preserving metadata about creation and modification dates

##### Improvements
- Tutorial: improved KaTeX syntax examples
- Opening the parent of the current data directory when changing it
- Opening the current attachments directory when adding some new attachments
- Checking if the chosen data directory is the current one
- Improved support for selecting all text
- Markdown: added support for relative file paths as urls
- Editor: preserving/restoring cursors on blur/focus
- Readme: updated screenshots
- Added Trilium to the comparison table
- Added Joplin to the comparison table
- Icon: slightly larger
- Improved startup time: lazy loading heavy modules
- Improved startup time: showing the window with a skeleton UI much quicker
- Improved startup time: rendering the skeleton quicker
- Optimized Markdown rendering when no Markdown features are used
- Optimized Markdown stripping when no Markdown features are used
- Upgraded electron to v4

##### Bug Fixes
- Avoiding copying the file to attach if it’s already an attachment
- Linux: fixed icon generation
- Much more resilient metadata sanitization and parsing
- CodeMirror: avoiding restoring the cursors if the document height changed
- Codemirror: properly focusing/resetting the editor
- CodeMirror: resetting undo history when the note changes
- Ensuring debugging tools are not used in production builds
- Properly detecting “rename” events on Windows
- Ensuring KaTeX doesn’t mess with generated paths
- Markdown: properly encoding generated urls
- Ensuring the currently active note remains active after editing its tags

## Version 1.1.0

##### New Features
- Added support for `.txt` files
- Added KaTeX support
- Added support for Mermaid charts
- Added support for double-click to collapse/expand tags
- Search: searching notes contents (non fuzzly) too
- Rendering normal tags as root tags if there are no notebooks and templates
- Using the current query as the newly created note’s title if the query returned no matches

##### Improvements
- Improved perceived startup time
- Automatically tag/favorite/trash a new note in order to keep it in the currently active section
- Added some more shortcuts for navigating tags/notes
- Search: Improved performance — searching for each word individually
- Search: skipping filtering when simply reordering
- Readme: added a link to the raw version of the tutorial notes
- Readme: added TiddlyWiki to the comparison table
- Readme: added Typora to the comparison table
- Readme: added Google Keep to the comparison table
- Readme: replaced ASCII table with a fancy table
- Using more ergonomic shortcuts for toggling editing

##### Bug Fixes
- Avoiding using a form for the search box
- Search: ensuring the list gets refreshed when changing the sorting order
- Improved support for titles containing non-English characters
- Avoiding auto-hiding the menu bar, it caused too much confusion
- Tag collapsing/expanding: ensuring notebooks and templates don’t get duplicated
- Avoiding loading the tutorial notes if there’s already a `notes` directory in the data directory
- Tags: always displaying the notes counter, even if 0
- Improved support for CRLF
- Ensuring the layout proportions are preserved when toggling Focus mode
- Tag: improved current tag detection
- Tags/Attachments popovers: ensuring they get refreshed when the note changes
- Ensuring Svelto works on Windows
- Ensuring there’s always a separator before the `Notable -> Quit` menu entry
- Ensuring checkboxes are always displayed

## Version 1.0.1
- Simplified import tag
- Multi-Editor: improved confirmation messages for adding/removing tags
- Tagbox: ensuring their never share the same name
- Multi-Editor: ensuring tags are automatically added on blur
- Multi-Editor: ensuring placeholders are completely visible
- Note: avoiding replacing tags if they didn’t actually change
- Improved performance when using optimistic rendering
- Ensuring the active tag is updated when we refresh the tags
- Readme: fixed download link
- Tags Popover: ensuring the tagbox doesn’t mutate the note’s tags
- Tags: more resilient sort logic
- Note: avoiding replacing the note twice when saving if the title didn’t change
- Tags: updating the tree instead of completely rebuilding it, O(n) -> O(1)
- Ensuring the special “Tags” tag is collapsible too
- Search: ensuring the optimized version is actually used
- Note: avoiding auto-suspending commonly called safe methods
- Skipping unnecessary updates on multiple note additions
- Skipping unnecessary updates on multiple note deletions
- Skipping unnecessary updates on multiple note updates
- Multi-Editor: skipping some work when possible
- Ensuring the `Tags` special tag is never deleted

## Version 1.0.0
- Initial release.
