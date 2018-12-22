---
title: 06 - Tags
pinned: false
tags: [Basics, Notebooks/Tutorial]
---

# 06 - Tags

Notes can have multiple tags, which are useful for better categorization.

## Syntax

- **Root**: Root tags don't contain any forward slash (`/`), and they will be rendered right below the special `Tags` section in the sidebar.

- **Nested**: Tags can also be nested, _indefinitely_, just write them like a path, separating the levels with a forward slash: `foo/bar/baz`.

## Special Tags

- **Notebooks**: You've probably noticed that Notable supports notebooks too. To create one just add a tag starting with `Notebooks/` to a note. 

- **Templates**: Notable also supports Templates, to create one just add the `Templates` tag to a note. Of course nesting is supported here too, i.e. `Templates/Work`.

Feel free to use these features, if you don't need them their icons won't be displayed sidebar.

## Collapse/Expand

Tags with children can be collapsed/expanded, just right-click on them and select the option.

## Editing

There are multiple ways to add/remove tags:

- **Single-note editing**: There's a button in the toolbar for editing a note's tags.
- **Multi-note editing**: Tags can be added/removed from multiple notes at once via the [multi-note editing](@note/09 - Multi-Note Editing.md) features provided.
- **Advanced search & replace**: Alternatively you could just open your data directory with your editor and perform a search & replace there, this way you can also use advanced features like regexes.
