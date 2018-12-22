---
title: 09 - Multi-Note Editing
tags: [Intermediate, Notebooks/Tutorial]
---

# 09 - Multi-Note Editing

## Built-in

Some multi-note editing features are built-in.

There are multiple ways to select notes:

- **Click**: you can toggle a note's selection just by clicking it in the middlebar with <kbd>Cmd+Click</kbd> on macOS, or with <kbd>Ctrl+Click</kbd> elsewhere.

- **Shortcuts**: some shortcuts are provided under the `Edit` menu entry for selecting all notes, inverting the selection and unselecting all of them.

When 2 or more notes are selected a multi-note editor will be displayed in the mainbar, you'll be asked for confirmation for all changes that will mutate the notes.

These are the actions you can take on selected note:

- Favorite/unfavorite them.
- Pin/unpin them.
- Move to trash/restore/permanently delete them.
- Open them in the default app.
- Add one or multiple tags to them. Useful when importing exported Evernote notebooks since the notebook tag is not preserved.
- Remove one or multiple tags from them. Useful when editing imported notes, which get automatically tagged with a special `Imported-XXXX` tag, so that you can easily select them all for multi-editing.

## Advanced

If you need more advanced multi-note editing, like global search & replace, remember that your notes are just plain Markdown files.

You could open your data directory into your favorite editor of choice and perform the search & replace there, this way you can also use advanced features like regexes.

All the edits performed with a third-party application will be reflected into Notable immediately.
