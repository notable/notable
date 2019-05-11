
/* IMPORT */

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

/* DARK */

const Dark: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  colors: {
    'editor.foreground': '#F6F6F6',
    'editor.background': '#1F1F1F',
    'editor.selectionBackground': '#EF6C0030',
    'editor.lineHighlightBackground': '#00000000',
    'editorCursor.foreground': '#F6F6F6',
    'editorWhitespace.foreground': '#1F1F1F'
  },
  rules: [
    { token: '',                       foreground: '#F6F6F6' },
    { token: 'annotation',             foreground: '#AFAFAF' },
    { token: 'attribute.name',         foreground: '#B267E6' },
    { token: 'attribute.value',        foreground: '#F6F6F6' },
    { token: 'attribute.value.html',   foreground: '#F6F6F6' },
    { token: 'attribute.value.number', foreground: '#F6F6F6' },
    { token: 'attribute.value.unit',   foreground: '#F6F6F6' },
    { token: 'attribute.value.xml',    foreground: '#F6F6F6' },
    { token: 'comment',                foreground: '#AFAFAF' },
    { token: 'constant',               foreground: '#F44747' },
    { token: 'delimiter',              foreground: '#F6F6F6' },
    { token: 'delimiter.html',         foreground: '#F6F6F6' },
    { token: 'delimiter.xml',          foreground: '#F6F6F6' },
    { token: 'emphasis',               fontStyle: 'italic' },
    { token: 'invalid',                foreground: '#F44747' },
    { token: 'key',                    foreground: '#F92672' },
    { token: 'keyword',                foreground: '#F44747' },
    { token: 'keyword.title',          foreground: '#F44747' },
    { token: 'keyword.json',           foreground: '#F44747' },
    { token: 'meta.scss',              foreground: '#98D127' },
    { token: 'metatag',                foreground: '#F92672' },
    { token: 'metatag.content.html',   foreground: '#B267E6' },
    { token: 'metatag.html',           foreground: '#808080' },
    { token: 'metatag.php',            fontStyle: 'bold' },
    { token: 'metatag.xml',            foreground: '#808080' },
    { token: 'number',                 foreground: '#6796E6' },
    { token: 'number.hex',             foreground: '#6796E6' },
    { token: 'operator.scss',          foreground: '#666666' },
    { token: 'operator.sql',           foreground: '#778899' },
    { token: 'operator.swift',         foreground: '#666666' },
    { token: 'predefined.sql',         foreground: '#B267E6' },
    { token: 'regexp',                 foreground: '#E0D463' },
    { token: 'string',                 foreground: '#F6F6F6' },
    { token: 'string.link',            foreground: '#B267E6' },
    { token: 'string.escape',          foreground: '#6796E6' },
    { token: 'string.html',            foreground: '#F6F6F6' },
    { token: 'string.key.json',        foreground: '#6796E6' },
    { token: 'string.sql',             foreground: '#B267E6' },
    { token: 'string.value.json',      foreground: '#F6F6F6' },
    { token: 'string.yaml',            foreground: '#F6F6F6' },
    { token: 'strong',                 fontStyle: 'bold' },
    { token: 'tag',                    foreground: '#98D127' },
    { token: 'title',                  foreground: '#F6F6F6' },
    { token: 'type',                   foreground: '#6796E6' },
    { token: 'variable',               foreground: '#6796E6' },
    { token: 'variable.predefined',    foreground: '#6796E6' }
  ]
};

/* EXPORT */

export default Dark;
