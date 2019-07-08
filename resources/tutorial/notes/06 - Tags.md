---
tags: [Basics, Notebooks/Tutorial]
title: 06 - Tags
created: '2019-01-28T19:46:36.681Z'
modified: '2019-06-06T12:20:10.986Z'
---

# 06 - Tags

Notes can have multiple tags, which are useful for better categorization.

## Syntax

- **Root**: Root tags don't contain any forward slash (`/`). If there are any notebooks or templates defined they will be rendered inside the special `Tags` section in the sidebar, otherwise the `Tags` parent section will be omitted.

- **Nested**: Tags can also be nested, _indefinitely_, just write them like a path, separating the levels with a forward slash: `foo/bar/baz`.

## Special Tags

- **Notebooks**: You've probably noticed that Notable supports notebooks too. To create one just add a tag starting with `Notebooks/` to a note. 

- **Templates**: Notable also supports Templates, to create one just add the `Templates` tag to a note. Of course nesting is supported here too, i.e. `Templates/Work`.

Feel free to use these features, if you don't need them their icons won't be displayed in the sidebar.

## Collapse/Expand

Tags with children can be collapsed/expanded, just right-click them and select the option or double-click them.

## Editing

There are multiple ways to add/remove tags:

- **Single-note editing**: There's a button in the toolbar for editing a note's tags.
- **Multi-note editing**: Tags can be added/removed from multiple notes at once via the [multi-note editing](@note/09 - Multi-Note Editing.md) features provided.
- **Advanced search & replace**: Alternatively you could just open your data directory with your editor and perform a search & replace there, this way you can also use advanced features like regexes.
