### Version 1.2.0

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

### Version 1.1.0

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

### Version 1.0.1
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

### Version 1.0.0
- Initial release.
