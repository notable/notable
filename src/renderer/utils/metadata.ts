
/* IMPORT */

import * as _ from 'lodash';
import * as matter from 'gray-matter';
import * as yaml from 'js-yaml';

/* PARSER */

const Parser = {

  options: {
    flowLevel: 1,
    indent: 2,
    lineWidth: 1000000
  },

  parse ( str ) {

    try {

      return yaml.safeLoad ( str, Parser.options );

    } catch ( e ) {

      return {};

    }

  },

  stringify ( obj: object ): string {

    return yaml.safeDump ( obj, Parser.options );

  }

};

/* METADATA */

const Metadata = {

  parser: Parser,

  options: {
    engines: {
      yaml: Parser
    }
  },

  get ( content: string ): object {

    return matter ( content, Metadata.options ).data;

  },

  set ( content: string, metadata: object ): string {

    content = Metadata.remove ( content );

    if ( !_.isEmpty ( metadata ) ) {

      content = matter.stringify ( content, metadata, Metadata.options );

    }

    return content;

  },

  remove ( content: string ): string {

    return matter ( content, Metadata.options ).content;

  }

};

/* EXPORT */

export default Metadata;
