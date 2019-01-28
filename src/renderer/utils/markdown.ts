
/* IMPORT */

import 'prism-github/prism-github.css';
import 'katex/dist/katex.min.css';

import * as _ from 'lodash';
import * as CRC32 from 'crc-32'; // Not a cryptographic hash function, but it's good enough (and fast!) for our purposes
import * as path from 'path';
import * as showdown from 'showdown';
import Config from '@common/config';
import AsciiMath from './asciimath';
import Highlighter from './highlighter';
import Utils from './utils';

const {encodeFilePath} = Utils;

/* IMPORT LAZY */

const laxy = require ( 'laxy' ),
      mermaid = laxy ( () => require ( 'mermaid' ) )(),
      katex = laxy ( () => require ( 'katex' ) )();

/* MARKDOWN */

const Markdown = {

  re: /_|\*|~|`|<|:|^>|^#|\]|---|===|\d\.|[*+-]\s|\n\n/m,
  wrapperRe: /^<p>(.*?)<\/p>$/,

  extensions: {

    strip () {

      return [{
        type: 'language',
        regex: /[\][=~`#|()*_-]/g,
        replace: ''
      }];

    },

    highlight () {

      return [{
        type: 'output',
        regex: /<pre><code(?:\s([^>]*))?>([^]*?)<\/code><\/pre>/g,
        replace ( match, $1, $2 ) {
          const language = Highlighter.inferLanguage ( $1 );
          const highlighted = Highlighter.highlight ( $2, language );
          return `<pre><code ${$1 || ''}>${highlighted}</code></pre>`;
        }
      }];

    },

    asciimath2tex () {

      return [{
        type: 'output',
        regex: /(?:<pre><code\s[^>]*language-asciimath[^>]*>([^]+?)<\/code><\/pre>)|(?:\$\$(.+?)\$\$)|(?:\$(.+?)\$)/g,
        replace ( match, $1, $2, $3 ) {
          const asciimath = $1 || $2 || $3;
          try {
            const tex = AsciiMath.toTeX ( asciimath );
            return !!$3 ? `$${tex}$` : `$$${tex}$$`;
          } catch ( e ) {
            console.error ( `[AsciiMath] ${e.message}` );
            return match;
          }
        }
      }];

    },

    katex () {

      return [{
        type: 'output',
        regex: /(?:<pre><code\s[^>]*language-(?:tex|latex|katex)[^>]*>([^]+?)<\/code><\/pre>)|(?:\$\$(.+?)\$\$)|(?:\$(.+?)\$)/g,
        replace ( match, $1, $2, $3 ) {
          const tex = $1 || $2 || $3;
          try {
            Config.katex.displayMode = !$3;
            return katex.renderToString ( tex, Config.katex );
          } catch ( e ) {
            console.error ( `[KaTeX] ${e.message}` );
            return match;
          }
        }
      }];

    },

    mermaid () {

      mermaid.initialize ( Config.mermaid );

      return [{
        type: 'language',
        regex: '```mermaid([^`]*)```',
        replace ( match, $1 ) {
          const id = `mermaid-${CRC32.str ( $1 )}`;
          try {
            const svg = mermaid.render ( id, $1 );
            return `<div class="mermaid">${svg}</div>`;
          } catch ( e ) {
            console.error ( `[mermaid] ${e.message}` );
            $(`#${id}`).remove ();
            return `<p class="text-red">[mermaid error: ${e.message}]</p>`;
          }
        }
      }];

    },

    checkbox () {

      // We are wrapping the metadata (the match index, which is a number) in numbers so that the syntax highlighter won't probably mess with it and it's unlikely that somebody will ever write the same thing

      return [
        { // Adding metadata
          type: 'language',
          regex: /([*+-][ \t]+\[(?:x|X| )?\])(?!\[|\()/gm,
          replace ( match, $1, index ) {
            return `${$1}7381125${index - 2}7381125`; //TODO: The matched string it appears to be wrapped into `\n\n` and `\n\n`, so the index is offsetted by 2, why? Is this because of showdown?
          }
        },
        { // Transforming metadata into attributes
          type: 'output',
          regex: /<input type="checkbox"(?: disabled)?([^>]*)>7381125(\d+?)7381125/gm,
          replace ( match, $1, $2 ) {
            return `<input type="checkbox"${$1} data-index="${$2}">`
          }
        },
        { // Cleaning up leftover metadata
          type: 'output',
          regex: /7381125(\d+?)7381125/gm,
          replace: () => ''
        }
      ];

    },

    targetBlankLinks () {

      return [{
        type: 'output',
        regex: '<a(.*?)href="(.)(.*?)>',
        replace ( match, $1, $2, $3 ) {
          if ( $2 === '#' ) { // URL fragment
            return match;
          } else {
            return `<a${$1}target="_blank" href="${$2}${$3}>`;
          }
        }
      }];

    },

    resolveRelativeLinks () {

      const {path: attachmentsPath, token: attachmentsToken} = Config.attachments,
            {path: notesPath, token: notesToken} = Config.notes;

      if ( !attachmentsPath || !notesPath ) return [];

      return [
        { // Markdown
          type: 'language',
          regex: `\\[([^\\]]*)\\]\\((\\.[^\\)]*)\\)`,
          replace ( match, $1, $2 ) {
            const filePath = path.resolve ( notesPath, $2 );
            if ( filePath.startsWith ( attachmentsPath ) ) {
              return `[${$1}](${attachmentsToken}/${filePath.slice ( attachmentsPath.length )})`;
            } else if ( filePath.startsWith ( notesPath ) ) {
              return `[${$1}](${notesToken}/${filePath.slice ( notesPath.length )})`;
            } else {
              return `[${$1}](file://${encodeFilePath ( filePath )})`;
            }
          }
        },
        { // <a>, <img>, <source>
          type: 'output',
          regex: /<(a|img|source)\s(.*?)(src|href)="(\.[^"]*)"(.*?)>/gm,
          replace ( match, $1, $2, $3, $4, $5 ) {
            const filePath = path.resolve ( notesPath, $4 );
            if ( filePath.startsWith ( attachmentsPath ) ) {
              return `<${$1} ${$2} ${$3}="${attachmentsToken}/${filePath.slice ( attachmentsPath.length )}" ${$5}>`;
            } else if ( filePath.startsWith ( notesPath ) ) {
              return `<${$1} ${$2} ${$3}="${notesToken}/${filePath.slice ( notesPath.length )}"${$5}>`;
            } else {
              return `<${$1} ${$2} ${$3}="file://${encodeFilePath ( filePath )}"${$5}>`;
            }
          }
        }
      ];

    },

    encodeSpecialLinks () { // Or they won't be parsed as images/links whatever

      return [{
        type: 'language',
        regex: `\\[([^\\]]*)\\]\\(((?:${Config.attachments.token}|${Config.notes.token}|${Config.tags.token})/[^\\)]*)\\)`,
        replace ( match, $1, $2 ) {
          return `[${$1}](${encodeFilePath ( $2 )})`;
        }
      }];

    },

    attachment () {

      const {path: attachmentsPath, token} = Config.attachments;

      if ( !attachmentsPath ) return [];

      return [
        { // <img>, <source>
          type: 'output',
          regex: `<(img|source)(.*?)src="${token}/([^"]+)"(.*?)>`,
          replace ( match, $1, $2, $3, $4 ) {
            $3 = decodeURI ( $3 );
            const filePath = path.join ( attachmentsPath, $3 );
            return `<${$1}${$2}src="file://${encodeFilePath ( filePath )}" class="attachment" data-filename="${$3}"${$4}>`;
          }
        },
        { // Link Button
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)></a>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            const basename = path.basename ( $2 );
            const filePath = path.join ( attachmentsPath, $2 );
            return `<a${$1}href="file://${encodeFilePath ( filePath )}" class="attachment button gray" data-filename="${$2}"${$3}><i class="icon small">paperclip</i><span>${basename}</span></a>`;
          }
        },
        { // Link
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            const filePath = path.join ( attachmentsPath, $2 );
            return `<a${$1}href="file://${encodeFilePath ( filePath )}" class="attachment" data-filename="${$2}"${$3}><i class="icon xsmall">paperclip</i>`;
          }
        }
      ];

    },

    note () {

      const {path: notesPath, token} = Config.notes;

      if ( !notesPath ) return [];

      return [
        { // Link Button
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)></a>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            const basename = path.basename ( $2 );
            const filePath = path.join ( notesPath, $2 );
            return `<a${$1}href="file://${encodeFilePath ( filePath )}" class="note button gray" data-filepath="${filePath}"${$3}><i class="icon small">note</i><span>${basename}</span></a>`;
          }
        },
        { // Link
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            const filePath = path.join ( notesPath, $2 );
            return `<a${$1}href="file://${encodeFilePath ( filePath )}" class="note" data-filepath="${filePath}"${$3}><i class="icon xsmall">note</i>`;
          }
        }
      ];

    },

    tag () {

      const {token} = Config.tags;

      return [
        { // Link Button
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)></a>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            return `<a${$1}href="#" class="tag button gray" data-tag="${$2}"${$3}><i class="icon small">tag</i><span>${$2}</span></a>`;
          }
        },
        { // Link
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            return `<a${$1}href="#" class="tag" data-tag="${$2}"${$3}><i class="icon xsmall">tag</i>`;
          }
        }
      ];

    },

    wikilink () {

      const {path: notesPath, re} = Config.notes;

      if ( !notesPath ) return [];

      var matches = [];
      var codeblocks = [];
      return [
        { // Extract Codeblocks
          type: 'lang',
          regex: /((?:^|\n {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\2)/g,
          replace (match, $1) {
            codeblocks.push($1);
            var n = codeblocks.length - 1;
            return '%CODEBLOCK' + n + '%';
          }
        },
        { // Extract Wikilinks
          type: 'lang',
          regex: /(?<!`)\[\[(.*?)\]\]/g,
          replace (match, $1, $2) {
            matches.push($1);
            var n = matches.length - 1;
            return '%PLACEHOLDER' + n + '%';
          }
        },
        { // Reinsert Codeblocks
            type: 'lang',
            regex: /%CODEBLOCK.*?%/gi,
            replace (match) {
                var codeblock = codeblocks.shift();
                return codeblock;
            }
        },
        { // Transform Wikilinks
          type: 'output',
          filter (text) {
                for (var i=0; i< matches.length; ++i) {
                    var content = matches[i]

                    var splits = content.split("|");

                    if (splits.length === 1) {
                      var wikiLink = splits[0].trim();
                      var linkText = splits[0].trim();
                    }
                    else {
                      var wikiLink = splits[1].trim();
                      var linkText = splits[0].trim();
                    };

                    wikiLink = decodeURI ( wikiLink );

                    if (wikiLink.match(re)) {
                      var basename = wikiLink;
                    } else {
                      var basename = [wikiLink, 'md'].join('.'); // the extension should be configurable (= default extension)
                    }

                    var filePath = path.join ( notesPath, basename );
                    var link = `<a href="@note/${basename}">${linkText}</a>`

                    // find placeholder and replace with link
                    var pat = '%PLACEHOLDER' + i + '%';
                    var text = text.replace(new RegExp(pat, 'gi'), link);
                }
                //reset array
                matches = [];
                return text;
            }
        }
      ];

    }

  },

  converters: {

    preview: _.memoize ( () => {

      const {asciimath2tex, katex, mermaid, highlight, checkbox, targetBlankLinks, resolveRelativeLinks, encodeSpecialLinks, attachment, note, tag, wikilink} = Markdown.extensions;

      const converter = new showdown.Converter ({
        metadata: true,
        extensions: [asciimath2tex (), katex (), mermaid (), highlight (), checkbox (), targetBlankLinks (), resolveRelativeLinks (), encodeSpecialLinks (), attachment (), note (), tag (), wikilink ()]
      });

      converter.setFlavor ( 'github' );

      return converter;

    }),

    strip: _.memoize ( () => {

      const {strip} = Markdown.extensions;

      const converter = new showdown.Converter ({
        metadata: true,
        extensions: [strip]
      });

      return converter;

    })

  },

  is: ( str: string ): boolean => { // Checks if `str` _could_ be using some Markdown features, it doesn't tell reliably when it actually is, only when it isn't. Useful for skipping unnecessary renderings

    return Markdown.re.test ( str );

  },

  render: _.memoize ( ( str: string ): string => {

    if ( !str || !Markdown.is ( str ) ) return `<p>${str}</p>`;

    return Markdown.converters.preview ().makeHtml ( str );

  }),

  strip: ( str: string ): string => {

    if ( !str || !Markdown.is ( str ) ) return str;

    return Markdown.converters.strip ().makeHtml ( str ).trim ().replace ( Markdown.wrapperRe, '$1' );

  }

};

/* EXPORT */

export default Markdown;
