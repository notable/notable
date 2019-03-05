
/* IMPORT */

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

/* LIGHT */

const Light: monaco.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  colors: {
    'editor.foreground': '#1F1F1F',
    'editor.background': '#FFFFFF',
    'editor.selectionBackground': '#EF6C0026',
    'editor.lineHighlightBackground': '#00000000',
    'editorCursor.foreground': '#1F1F1F',
    'editorWhitespace.foreground': '#FFFFFF'
  },
  rules: [
    { token: '',                       foreground: '#1F1F1F' },
    { token: 'annotation',             foreground: '#6A737D' },
    { token: 'attribute.name',         foreground: '#6F42C1' },
    { token: 'attribute.value',        foreground: '#1F1F1F' },
    { token: 'attribute.value.html',   foreground: '#1F1F1F' },
    { token: 'attribute.value.number', foreground: '#1F1F1F' },
    { token: 'attribute.value.unit',   foreground: '#1F1F1F' },
    { token: 'attribute.value.xml',    foreground: '#1F1F1F' },
    { token: 'comment',                foreground: '#6A737D' },
    { token: 'constant',               foreground: '#D73A49' },
    { token: 'delimiter',              foreground: '#1F1F1F' },
    { token: 'delimiter.html',         foreground: '#1F1F1F' },
    { token: 'delimiter.xml',          foreground: '#1F1F1F' },
    { token: 'emphasis',               fontStyle: 'italic' },
    { token: 'invalid',                foreground: '#D73A49' },
    { token: 'key',                    foreground: '#863B00' },
    { token: 'keyword',                foreground: '#D73A49' },
    { token: 'keyword.title',          foreground: '#D73A49' },
    { token: 'keyword.json',           foreground: '#D73A49' },
    { token: 'meta.scss',              foreground: '#218639' },
    { token: 'metatag',                foreground: '#E00000' },
    { token: 'metatag.content.html',   foreground: '#6F42C1' },
    { token: 'metatag.html',           foreground: '#808080' },
    { token: 'metatag.php',            fontStyle: 'bold' },
    { token: 'metatag.xml',            foreground: '#808080' },
    { token: 'number',                 foreground: '#005CC5' },
    { token: 'number.hex',             foreground: '#005CC5' },
    { token: 'operator.scss',          foreground: '#666666' },
    { token: 'operator.sql',           foreground: '#778899' },
    { token: 'operator.swift',         foreground: '#666666' },
    { token: 'predefined.sql',         foreground: '#6F42C1' },
    { token: 'regexp',                 foreground: '#218639' },
    { token: 'string',                 foreground: '#1F1F1F' },
    { token: 'string.link',            foreground: '#6F42C1' },
    { token: 'string.escape',          foreground: '#005CC5' },
    { token: 'string.html',            foreground: '#1F1F1F' },
    { token: 'string.key.json',        foreground: '#005CC5' },
    { token: 'string.sql',             foreground: '#6F42C1' },
    { token: 'string.value.json',      foreground: '#1F1F1F' },
    { token: 'string.yaml',            foreground: '#1F1F1F' },
    { token: 'strong',                 fontStyle: 'bold' },
    { token: 'tag',                    foreground: '#218639' },
    { token: 'title',                  foreground: '#1F1F1F' },
    { token: 'type',                   foreground: '#005CC5' },
    { token: 'variable',               foreground: '#005CC5' },
    { token: 'variable.predefined',    foreground: '#005CC5' }
  ]
};

/* EXPORT */

export default Light;
