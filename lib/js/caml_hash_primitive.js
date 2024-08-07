'use strict';


function rotl32(x, n) {
  return (x << n) | (x >>> (32 - n | 0)) | 0;
}

function hash_mix_int(h, d) {
  let d$1 = d;
  d$1 = Math.imul(d$1, -862048943);
  d$1 = rotl32(d$1, 15);
  d$1 = Math.imul(d$1, 461845907);
  let h$1 = h ^ d$1;
  h$1 = rotl32(h$1, 13);
  return (h$1 + (h$1 << 2) | 0) - 430675100 | 0;
}

function hash_final_mix(h) {
  let h$1 = h ^ (h >>> 16);
  h$1 = Math.imul(h$1, -2048144789);
  h$1 = h$1 ^ (h$1 >>> 13);
  h$1 = Math.imul(h$1, -1028477387);
  return h$1 ^ (h$1 >>> 16);
}

function hash_mix_string(h, s) {
  let len = s.length;
  let block = (len / 4 | 0) - 1 | 0;
  let hash = h;
  for (let i = 0; i <= block; ++i) {
    let j = (i << 2);
    let w = s.charCodeAt(j) | (s.charCodeAt(j + 1 | 0) << 8) | (s.charCodeAt(j + 2 | 0) << 16) | (s.charCodeAt(j + 3 | 0) << 24);
    hash = hash_mix_int(hash, w);
  }
  let modulo = len & 3;
  if (modulo !== 0) {
    let w$1 = modulo === 3 ? (s.charCodeAt(len - 1 | 0) << 16) | (s.charCodeAt(len - 2 | 0) << 8) | s.charCodeAt(len - 3 | 0) : (
        modulo === 2 ? (s.charCodeAt(len - 1 | 0) << 8) | s.charCodeAt(len - 2 | 0) : s.charCodeAt(len - 1 | 0)
      );
    hash = hash_mix_int(hash, w$1);
  }
  hash = hash ^ len;
  return hash;
}

exports.hash_mix_int = hash_mix_int;
exports.hash_mix_string = hash_mix_string;
exports.hash_final_mix = hash_final_mix;
/* No side effect */
