
/* IMPORT */

import * as _ from 'lodash';
import * as CRC32 from 'crc-32'; // Not a cryptographic hash function, but it's good enough (and fast!) for our purposes
import {AllHtmlEntities as entities} from 'html-entities';
import * as isAbsoluteUrl from 'is-absolute-url';
import * as path from 'path';
import * as showdown from 'showdown';
import Config from '@common/config';
import AsciiMath from './asciimath';
import Highlighter from './highlighter';
import Utils from './utils';

const {encodeFilePath} = Utils;

delete showdown.helper.emojis['octocat']; // Special emoji, removing it
delete showdown.helper.emojis['showdown']; // Special emoji, removing it

/* MARKDOWN */

const Markdown = {

  re: /_.*?_|\*.*?\*|~.*?~|`.*?`|<.*?>|:\w+?:|^\s*>|^\s*#|\[.*?\]|--|==|```|~~~|^\s*\d+\.|^\s*[*+-]\s|\n\s*\n/m,
  wrapperRe: /^<p>(.*?)<\/p>$/,

  extensions: {

    utilities: {

      anchorOutputRe: /<a[^>]*>(.*?)<\/a>/g,
      checkboxLanguageRe: /^(\s*[*+-][ \t]+\[(?:x|X| )?\])(?!\[|\()/gm,
      checkboxCheckmarkRe: /\[([^\]]*?)\]/g,
      checkboxCheckedRe: /\[(x|X)\]/g,
      codeLanguageRe: /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
      codeOutputRe: /<code[^>]*?>([^]*?)<\/code>/g,

      isInside ( re: RegExp, str: string, index: number ) { // Checks if the index is inside the ranges matched by the regex in the string

        re.lastIndex = 0;

        let match;

        while ( match = re.exec ( str ) ) {

          if ( index < match.index ) return false;

          if ( index >= match.index && index < ( match.index + match[0].length ) ) return true;

        }

        return false;

      },

      isInsideAnchor ( str: string, index: number ) {

        return Markdown.extensions.utilities.isInside ( Markdown.extensions.utilities.anchorOutputRe, str, index );

      },

      isInsideCode ( str: string, index: number, language: boolean = false ) {

        const re = language ? Markdown.extensions.utilities.codeLanguageRe : Markdown.extensions.utilities.codeOutputRe;

        return Markdown.extensions.utilities.isInside ( re, str, index );

      },

      toggleCheckbox ( str: string, nth: number, force?: boolean ) {

        const {checkboxLanguageRe, checkboxCheckmarkRe, checkboxCheckedRe} = Markdown.extensions.utilities;

        checkboxLanguageRe.lastIndex = 0;

        let checkbox, nthCurrent = -1;

        while ( checkbox = checkboxLanguageRe.exec ( str ) ) {

          if ( Markdown.extensions.utilities.isInsideCode ( str, checkbox.index, true ) ) continue;

          nthCurrent++;

          if ( nthCurrent !== nth ) continue;

          force = _.isBoolean ( force ) ? force : !checkboxCheckedRe.test ( checkbox[0] );

          const checkboxNext = checkbox[0].replace ( checkboxCheckmarkRe, force ? '[x]' : '[ ]' );

          return `${str.slice ( 0, checkbox.index )}${checkboxNext}${str.slice ( checkbox.index + checkbox[0].length, Infinity )}`;

        }

        return str;

      }

    },

    strip () {

      return [
        { // Standalone syntax => Removing all of it
          type: 'language',
          regex: /--+|==+|```+|~~~+|:\w+?:/gm,
          replace: () => ''
        },
        { // Wrap syntax => Removing only the wrapping syntax
          type: 'language',
          regex: /_.*?_|\*.*?\*|~.*?~|`.*?`|\[.*?\]/gm,
          replace: match => match.slice ( 1, -1 )
        },
        { // Start syntax => Removing the special syntax
          type: 'language',
          regex: /^(\s*)(?:>(?:\s*?>)*|#+|\d+\.|[*+-](?=\s))/gm, //TODO: If multiple of these get chained together this regex will fail
          replace: ( match, $1 ) => $1
        },
        { // HTML => Removing all of it
          type: 'output',
          regex: /<[^>]*?>/g,
          replace: () => ''
        }
      ];

    },

    highlight () {

      return [{
        type: 'output',
        regex: /<pre><code(\s[^>]*language-[^>]*)>([^]+?)<\/code><\/pre>/g,
        replace ( match, $1, $2 ) {
          try {
            const language = Highlighter.inferLanguage ( $1 );
            const highlighted = Highlighter.highlight ( $2, language );
            return `<pre><code ${$1 || ''}>${highlighted}</code></pre>`;
          } catch ( e ) {
            console.error ( `[highlight] ${e.message}` );
            return match;
          }
        }
      }];

    },

    copy () {

      return [{
        type: 'output',
        regex: /<pre><code([^>]*)>([^]+?)<\/code><\/pre>/g,
        replace ( match ) {
          return `<div class="copy-wrapper"><div class="copy" title="Copy code to clipboard"><i class="icon small">content_copy</i></div>${match}</div>`;
        }
      }];

    },

    asciimath2tex () {

      return [
        { // AsciiMath 2 TeX
          type: 'output',
          regex: /(?:<pre><code\s[^>]*language-asciimath[^>]*>([^]+?)<\/code><\/pre>)|(?:(?:\\)?&&(?!<)(\S(?:.*?\S)?)(?:\\)?&&(?!\d))|(?:(?:\\)?&amp;(?!<)&amp;(?!<)(\S(?:.*?\S)?)(?:\\)?&amp;(?!<)&amp;(?!\d))|(?:(?:\\)?&(?!<|\w+;)(\S(?:.*?\S)?)(?:\\)?&(?!\d))|(?:(?:\\)?&amp;(?!<)(\S(?:.*?\S)?)(?:\\)?&amp;(?!\d))/g,
          replace ( match, $1, $2, $3, $4, $5, index, content ) {
            if ( match.startsWith ( '\\' ) ) return match;
            if ( Markdown.extensions.utilities.isInsideCode ( content, index, false ) ) return match;
            if ( Markdown.extensions.utilities.isInsideAnchor ( content, index ) ) return match; // In order to better support encoded emails
            const asciimath = $1 || $2 || $3 || $4 || $5;
            try {
              let tex = AsciiMath.toTeX ( entities.decode ( asciimath ) );
              return !!$4 || !!$5 ? `$${tex}$` : `$$${tex}$$`;
            } catch ( e ) {
              console.error ( `[asciimath] ${e.message}` );
              return match;
            }
          }
        },
        { // Escaping cleanup
          type: 'output',
          regex: /\\&(?:amp;)?/g,
          replace ( match, index, content ) {
            if ( Markdown.extensions.utilities.isInsideCode ( content, index, false ) ) return match;
            if ( Markdown.extensions.utilities.isInsideAnchor ( content, index ) ) return match; // In order to better support encoded emails
            return match.slice ( 1 );
          }

        }
      ];

    },

    katex () {

      let katex;

      const init = _.once ( () => { // Lazy init for performance
        katex = require ( 'katex' );
        require ( 'katex/dist/contrib/mhchem.min.js' );
      });

      return [
        { // KaTeX rendering
          type: 'output',
          regex: /(?:<pre><code\s[^>]*language-(?:tex|latex|katex)[^>]*>([^]+?)<\/code><\/pre>)|(?:(?:\\)?\$\$(?!<)(\S(?:.*?\S)?)(?:\\)?\$\$(?!\d))|(?:(?:\\)?\$(?!<)(\S(?:.*?\S)?)(?:\\)?\$(?!\d))/g,
          replace ( match, $1, $2, $3, index, content ) {
            if ( match.startsWith ( '\\' ) ) return match;
            if ( Markdown.extensions.utilities.isInsideCode ( content, index, false ) ) return match;
            init ();
            const tex = $1 || $2 || $3;
            try {
              Config.katex.displayMode = !$3;
              return katex.renderToString ( entities.decode ( tex ), Config.katex );
            } catch ( e ) {
              console.error ( `[katex] ${e.message}` );
              return match;
            }
          }
        },
        { // Escaping cleanup
          type: 'output',
          regex: /\\\$/g,
          replace ( match, index, content ) {
            if ( Markdown.extensions.utilities.isInsideCode ( content, index, false ) ) return match;
            if ( Markdown.extensions.utilities.isInsideAnchor ( content, index ) ) return match; // In order to better support encoded emails
            return match.slice ( 1 );
          }
        }
      ];

    },

    mermaid () {

      let mermaid;

      const init = _.once ( () => { // Lazy init for performance
        mermaid = require ( 'mermaid' );
        mermaid.initialize ( Config.mermaid );
      });

      return [{
        type: 'output',
        regex: /<pre><code\s[^>]*language-mermaid[^>]*>([^]+?)<\/code><\/pre>/g,
        replace ( match, $1 ) {
          init ();
          const id = `mermaid-${CRC32.str ( $1 )}`;
          try {
            const svg = mermaid.render ( id, entities.decode ( $1 ) );
            return `<div class="mermaid">${svg}</div>`;
          } catch ( e ) {
            console.error ( `[mermaid] ${e.message}` );
            $(`#${id}`).remove ();
            return `<p class="text-warning">[mermaid error: ${e.message}]</p>`;
          }
        }
      }];

    },

    checkbox () {

      let nth = 0;

      return [
        { // Resetting the counter
          type: 'language',
          regex: /^/g,
          replace () {
            nth = 0;
            return '';
          }
        },
        { // Adding metadata
          type: 'output',
          regex: /<input type="checkbox"(?: disabled)?([^>]*)>/gm,
          replace ( match, $1 ) {
            return `<input type="checkbox"${$1} data-nth="${nth++}">`
          }
        }
      ];

    },

    targetBlankLinks () {

      return [{
        type: 'output',
        regex: /<a(.*?)href="(.*?)>/g,
        replace ( match, $1, $2 ) {
          if ( $2.startsWith ( '#' ) ) { // URL fragment
            return match;
          } else {
            return `<a${$1}target="_blank" href="${$2}>`;
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
          regex: /\[([^\]]*)\]\((\.[^\)]*)\)/g,
          replace ( match, $1, $2, index, content ) {
            if ( Markdown.extensions.utilities.isInsideCode ( content, index, true ) ) return match;
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
        replace ( match, $1, $2, index, content ) {
          if ( Markdown.extensions.utilities.isInsideCode ( content, index, true ) ) return match;
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
            return `<a${$1}href="file://${encodeFilePath ( filePath )}" class="attachment button highlight" data-filename="${$2}"${$3}><i class="icon small">paperclip</i><span>${basename}</span></a>`;
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
            return `<a${$1}href="file://${encodeFilePath ( filePath )}" class="note button highlight" data-filepath="${filePath}"${$3}><i class="icon small">note</i><span>${basename}</span></a>`;
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
            return `<a${$1}href="#" class="tag button highlight" data-tag="${$2}"${$3}><i class="icon small">tag</i><span>${$2}</span></a>`;
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

    noProtocolLinks () {

      return [{
        type: 'output',
        regex: /<a(.*?)href="(.*?)>/g,
        replace ( match, $1, $2 ) {
          if ( $2.startsWith ( '#' ) || isAbsoluteUrl ( $2 ) ) { // URL fragment or absolute URL
            return match;
          } else {
            return `<a${$1}href="https://${$2}>`;
          }
        }
      }];

    },

    wikilink () {

      const {ext, re, token} = Config.notes;

      return [{
        type: 'language',
        regex: /\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]/g,
        replace ( match, $1, $2, index, content ) {
          if ( Markdown.extensions.utilities.isInsideCode ( content, index, true ) ) return match;
          const title = $1;
          const note = $2 || $1;
          const isNotePath = re.test ( note );
          return `<a href="${token}/${note}${isNotePath ? '' : ext}">${title}</a>`;
        }
      }];

    }

  },

  converters: {

    preview: _.memoize ( () => {

      const {asciimath2tex, katex, mermaid, highlight, copy, checkbox, targetBlankLinks, resolveRelativeLinks, encodeSpecialLinks, attachment, note, tag, noProtocolLinks, wikilink} = Markdown.extensions;

      const converter = new showdown.Converter ({
        metadata: true,
        extensions: [asciimath2tex (), katex (), mermaid (), highlight (), copy (), checkbox (), targetBlankLinks (), resolveRelativeLinks (), encodeSpecialLinks (), attachment (), wikilink (), note (), tag (), noProtocolLinks ()]
      });

      converter.setFlavor ( 'github' );

      converter.setOption ( 'disableForced4SpacesIndentedSublists', true );
      converter.setOption ( 'ghMentions', false );
      converter.setOption ( 'smartIndentationFix', true );
      converter.setOption ( 'smoothLivePreview', true );

      return converter;

    }),

    strip: _.memoize ( () => {

      const {strip} = Markdown.extensions;

      const converter = new showdown.Converter ({
        metadata: true,
        extensions: [strip]
      });

      converter.setFlavor ( 'github' );

      return converter;

    })

  },

  is: ( str: string ): boolean => { // Checks if `str` _could_ be using some Markdown features, it doesn't tell reliably when it actually is, only when it isn't. Useful for skipping unnecessary renderings

    return Markdown.re.test ( str );

  },

  render: ( str: string ): string => {

    if ( !str || !Markdown.is ( str ) ) return `<p>${str}</p>`;

    return Markdown.converters.preview ().makeHtml ( Markdown.limiter ( str ).trim () ); //FIXME: Strings starting with multiple empty lines aren't rendered properly

  },

  strip: ( str: string ): string => {

    if ( !str || !Markdown.is ( str ) ) return str;

    return Markdown.converters.strip ().makeHtml ( Markdown.limiter ( str ) ).trim ().replace ( Markdown.wrapperRe, '$1' );

  },

  limiter: ( str: string, limit: number = 25000 ): string => { //FIXME: Limiting the maximum size of rendable Markdown in order to avoid crashing the app //URL: https://github.com/notable/notable/issues/531

    if ( str.length <= limit ) return str;

    return `${str.slice ( 0, limit )}\n\n<p class="text-warning">[markdown error: output capped to ${limit} characters for performance]</p>`;
  }

};

/* EXPORT */

export default Markdown;
