
/* IMPORT */

import * as CRC32 from 'crc-32'; // Not a cryptographic hash function, but it's good enough (and fast!) for our purposes

/* HASH */

const Hash = {

  digest ( str ) {

    return CRC32.str ( str );

  }

};

/* EXPORT */

export default Hash;
