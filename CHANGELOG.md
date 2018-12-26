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
