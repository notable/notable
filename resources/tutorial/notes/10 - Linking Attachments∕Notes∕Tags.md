---
title: 10 - Linking Attachments/Notes/Tags
tags: [Intermediate, Notebooks/Tutorial]
attachments: [icon_small.png]
---

# 10 - Linking Attachments/Notes/Tags

Sometimes, like when writing a tutorial for a note-taking app :wink:, you may need to link to other notes or embed a few attachments. Notable makes this easy for you.

These special links can also be right-clicked so that you can perform some actions on them.

## Attachments

Attachments can be rendered inline, linked to, and linked to via a button. The `@attachment` token is used for this.

##### Syntax

```markdown
![Icon](@attachment/icon_small.png)
[Icon](@attachment/icon_small.png)
[](@attachment/icon_small.png)
```

##### Result

![Icon](@attachment/icon_small.png)

[Icon](@attachment/icon_small.png)

[](@attachment/icon_small.png)

## Notes

Notes can be linked to, and linked to via a button. The `@note` token is used for this. Wiki-style links are supported too.

##### Syntax

```markdown
[Shortcuts](@note/07 - Shortcuts.md)
[](@note/07 - Shortcuts.md)
[[Importing|08 - Importing.md]]
[[08 - Importing]]
```

##### Result

[Shortcuts](@note/07 - Shortcuts.md)

[](@note/07 - Shortcuts.md)

[[Importing|08 - Importing.md]]

[[08 - Importing]]

## Tags

Tags can be linked to, and linked to via a button. The `@tag` token is used for this.

##### Syntax

```markdown
[Basics](@tag/Basics)
[](@tag/Basics)
```

##### Result

[Basics](@tag/Basics)

[](@tag/Basics)
