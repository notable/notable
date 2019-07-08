---
tags: [Basics, Notebooks/Theming]
title: 13 - Highlighter
created: '2019-03-02T01:11:58.083Z'
modified: '2019-07-06T13:49:30.732Z'
---

# 13 - Highlighter

## Markdown

```markdown
# H1

With equals
===

_emphasis_
**strong**
~~Strikethrough~~

1. Ordered list
- Unordered list
* Unordered list

> Quote

Inline `code`

    unfenced codeblock

[link](https://www.google.com)

{target}

&nbsp;
```

## HTML

```html
<!-- comment -->

<b attr="foo">html</b>
```

## JSON

```json
{
  "foo": [1, true, "string"],
  "bar": {}
}
```

## Javascript

```javascript
/*
 * Multi-line comment
 */

function fnName () {
  if ( NaN ) {
    const str = [`Number: ${1}`, 'foo', /re/gi];
    str.blink (); // Seriously...
  }
  return 1 + 2 + 3;
}
```

## CSS

```css
#foo:before {
  content: 'foo' !important;
}
```

## Shell

```shell
echo 'foo' | true
```

## Diff

```diff
@@ file.diff @@
-javascript codeblock
+diff codeblock
!different
```

