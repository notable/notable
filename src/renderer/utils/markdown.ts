
/* IMPORT */

import 'highlight.js/styles/github';
import 'katex/dist/katex.min.css';
import * as _ from 'lodash';
import * as CRC32 from 'crc-32'; // Not a cryptographic hash function, but it's good enough (and fast!) for our purposes
import * as mermaid from 'mermaid';
import * as path from 'path';
import * as pify from 'pify';
import * as remark from 'remark';
import * as strip from 'strip-markdown';
import * as showdown from 'showdown';
import * as showdownHighlight from 'showdown-highlight';
import * as showdownKatex from 'showdown-katex-studdown';
import * as showdownTargetBlack from 'showdown-target-blank';
import Config from '@common/config';

/* MARKDOWN */

const Markdown = {

  converter: undefined,

  extensions: {

    encodeSpecialLinks () { // Or they won't be parsed as images/links whatever

      return [{
        type: 'language',
        regex: `\\[([^\\]]*)\\]\\(((?:${Config.attachments.token}|${Config.notes.token}|${Config.tags.token})/[^\\)]*)\\)`,
        replace ( match, $1, $2 ) {
          return `[${$1}](${encodeURI ( $2 )})`;
        }
      }];

    },

    attachment () {

      const {path: attachmentsPath, token} = Config.attachments;

      if ( !attachmentsPath ) return [];

      return [
        { // Image
          type: 'output',
          regex: `<img(.*?)src="${token}/([^"]+)"(.*?)>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            const filePath = path.join ( attachmentsPath, $2 );
            return `<img${$1}src="file://${filePath}" class="attachment" data-filename="${$2}"${$3}>`;
          }
        },
        { // Link Button
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)></a>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            const basename = path.basename ( $2 );
            const filePath = path.join ( attachmentsPath, $2 );
            return `<a${$1}href="file://${filePath}" class="attachment button gray" data-filename="${$2}"${$3}><i class="icon small">paperclip</i><span>${basename}</span></a>`;
          }
        },
        { // Link
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            const filePath = path.join ( attachmentsPath, $2 );
            return `<a${$1}href="file://${filePath}" class="attachment" data-filename="${$2}"${$3}><i class="icon xsmall">paperclip</i>`;
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
            return `<a${$1}href="file://${filePath}" class="note button gray" data-filepath="${filePath}"${$3}><i class="icon small">note</i><span>${basename}</span></a>`;
          }
        },
        { // Link
          type: 'output',
          regex: `<a(.*?)href="${token}/([^"]+)"(.*?)>`,
          replace ( match, $1, $2, $3 ) {
            $2 = decodeURI ( $2 );
            const filePath = path.join ( notesPath, $2 );
            return `<a${$1}href="file://${filePath}" class="note" data-filepath="${filePath}"${$3}><i class="icon xsmall">note</i>`;
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

    katex () {

      return showdownKatex ( Config.katex );

    },

    mermaid () {

      mermaid.initialize ( Config.mermaid );

      return [{
        type: 'language',
        regex: '```mermaid([^`]*)```',
        replace ( match, $1 ) {
          const svg = mermaid.render ( `mermaid-${CRC32.str ( $1 )}`, $1 );
          return `<div class="mermaid">${svg}</div>`;
        }
      }];

    }

  },

  getConverter () {

    if ( Markdown.converter ) return Markdown.converter;

    const {encodeSpecialLinks, attachment, note, tag, katex, mermaid} = Markdown.extensions;

    const converter = new showdown.Converter ({
      metadata: true,
      extensions: [showdownHighlight, showdownTargetBlack, encodeSpecialLinks (),attachment (), note (), tag (), katex (), mermaid ()]
    });

    converter.setFlavor ( 'github' );

    Markdown.converter = converter;

    return converter;

  },

  render: _.memoize ( ( str: string ): string => {

    return Markdown.getConverter ().makeHtml ( str );

  }),

  strip: async ( str: string ): Promise<string> => {

    return ( await pify ( remark ().use ( strip ).process )( str ) ).toString ();

  }

};

/* EXPORT */

export default Markdown;
