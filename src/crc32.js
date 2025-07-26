/**
 * Adapted from JSZip (https://github.com/Stuk/jszip/blob/643714aa770afd8fe1df6cfc7e2bde945bb0ef64/lib/crc32.js).
 * While JSZip adapted from Pako (https://github.com/nodeca/pako/blob/master/lib/zlib/crc32.js).
 * While at the same time StackOverflow user Alex had very similar implementation at an earlier
 * date (https://stackoverflow.com/questions/18638900/javascript-crc32/18639999#18639999).
 *
 * Do I know who ultimately created this implementation?
 * No, it may be one of the above, it may be none of the above. I have slightly
 * different needs and priorities for this CRC-32 implementation than them so
 * I may also adapt accordingly.
 *
 * You are free to draw your own conclusions.
 */

function makeTable() {
    let c, table = [];

    for(let n =0; n < 256; n++){
        c = n;
        for(let k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[n] = c;
    }

    return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = makeTable();

export function crc32(crc, buf, len, pos) {
    const t = crcTable, end = pos + len;

    crc = crc ^ (-1);

    for (let i = pos; i < end; i++ ) {
        crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
    }

    return (crc ^ (-1)); // >>> 0;
}
