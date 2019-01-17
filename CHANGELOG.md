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
