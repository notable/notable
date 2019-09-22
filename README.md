# [Notable](https://notable.md)

<p align="center">
  <a href="https://img.notable.md/screenshot-main.png">
    <img src="https://img.notable.md/screenshot-main.png" width="900" alt="Notable">
  </a>
</p>

<p align="center">
  <a href="https://download.notable.md">
    <img src="https://img.notable.md/badge-download.png" height="42" alt="Download button" />
  </a>
</p>

---

I couldn't find a note-taking app that ticked all the boxes I'm interested in: notes are written and rendered in GitHub Flavored Markdown, no WYSIWYG, no proprietary formats, I can run a search & replace across all notes, notes support attachments, the app isn't bloated, the app has a pretty interface, tags are indefinitely nestable and can import Evernote notes (because that's what I was using before).

So I built my own.

## [Comparison](https://notable.md/static/images/comparison.png)

[![Click to Enlarge](https://notable.md/static/images/comparison.png)](https://notable.md/static/images/comparison.png?raw=true)

Part of this comparison is personal opinion: you may disagree on the UI front, things I consider bloat may be considered features by somebody else etc. but hopefully this comparison did a good job at illustrating the main differences.

## Features

### Markdown-based

Notes are written in GitHub Flavored Markdown, and you can also write [KaTeX](https://katex.org) expressions, [Mermaid](https://github.com/knsv/mermaid) diagrams and so much more, check out our full [Markdown cheatsheet](https://cheatsheet.notable.md).

Notable also gives you a very powerful Markdown editor, it's the same one VS Code uses in fact, so features like multi-cursors, a minimap and best-in-class syntax highlighting are built-in.

<p align="center">
  <a href="https://img.notable.md/screenshot-filesystem.png">
    <img src="https://img.notable.md/screenshot-filesystem.png" width="800" alt="Filesystem" />
  </a>
</p>

### No Vendor Lock-In

Notes and attachments are simply stored on your disk, this is extremely portable and powerful: you could edit your notes with your favorite editor, have them synchronized via Dropbox, run Git on them, run a regex-based search and replace on them etc.

<p align="center">
  <a href="https://img.notable.md/screenshot-editor.png">
    <img src="https://img.notable.md/screenshot-editor.png" width="800" alt="Editor" />
  </a>
</p>

### Dark Theme

A dark theme is also available. In the future support for [custom themes](https://github.com/notable/notable/issues/104) will be added as well.

If you'd like to change a color or hide a button you are also free to do that via the Devtools.

<p align="center">
  <a href="https://img.notable.md/screenshot-dark.png">
    <img src="https://img.notable.md/screenshot-dark.png" width="800" alt="Dark Theme" />
  </a>
</p>

### Zen Mode

Zen mode provides a minimalistic editing and reading experience, hiding everything that's not necessary.

Notable is also keyboard friendly, has a [quick open](https://img.notable.md/screenshot-dark.png) window, and we'll soon add a [command palette](https://github.com/notable/notable/issues/338) too, so you won't have to click any buttons if you don't want to.

<p align="center">
  <a href="https://img.notable.md/screenshot-zen.png">
    <img src="https://img.notable.md/screenshot-zen.png" width="800" alt="Zen Mode" />
  </a>
</p>

### Multi-Note Editor

A multi-note editor is available for quickly running an action, like favoriting, pinning, deleting, tagging etc., on multiple notes at once.

If you need to run a more complex action on your notes remember that they are just file stored on your disk so you can do whatever you want with them.

<p align="center">
  <a href="https://img.notable.md/screenshot-multieditor.png">
    <img src="https://img.notable.md/screenshot-multieditor.png" width="800" alt="Multi-Note Editor" />
  </a>
</p>

### Split Editor

A split-editor is available for quickly checking out how your note will be rendered while you're editing it.

<p align="center">
  <a href="https://img.notable.md/screenshot-spliteditor.png">
    <img src="https://img.notable.md/screenshot-spliteditor.png" width="800" alt="Split Editor" />
  </a>
</p>

## More Features

A lot more features are implemented, some of the most important ones are listed [here](https://notable.md/#more-features).

Is a feature you care about currently missing? Make sure to browse the [issue tracker](https://github.com/notable/notable/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc) and add your ":+1:" reaction to the issues you care most about, as we also use those reactions to prioritize issues.

## Contributing

There are multiple ways to contribute to this project, read about them [here](https://github.com/notable/notable/blob/master/.github/CONTRIBUTING.md).

## Related

- **[dumper](https://github.com/notable/dumper)**: Library for extracting attachments, notes and metadata out of formats used by popular note-taking apps.

## License

- **<= v1.3.0**: MIT © Fabio Spampinato.
- **<= v1.5.1**: AGPLv3 © Fabio Spampinato.
- **>= v1.6.0**: Not open-source. Notable has effectively become my full-time job, so I've decided to figure out how to make it sustainable first before figuring out how to license it, in order to make this less risky for me. Read more about this [here](https://github.com/notable/notable/issues/432) and [here](https://www.reddit.com/r/Notable/comments/bu86e8/update_on_v160/).
