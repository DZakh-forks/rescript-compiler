

import * as Bytes from "./bytes.js";
import * as Caml_array from "./caml_array.js";
import * as Caml_bytes from "./caml_bytes.js";
import * as Caml_lexer from "./caml_lexer.js";

function engine(tbl, state, buf) {
  let result = Caml_lexer.lex_engine(tbl, state, buf);
  if (result >= 0) {
    buf.lex_start_p = buf.lex_curr_p;
    let init = buf.lex_curr_p;
    buf.lex_curr_p = {
      pos_fname: init.pos_fname,
      pos_lnum: init.pos_lnum,
      pos_bol: init.pos_bol,
      pos_cnum: buf.lex_abs_pos + buf.lex_curr_pos | 0
    };
  }
  return result;
}

function new_engine(tbl, state, buf) {
  let result = Caml_lexer.new_lex_engine(tbl, state, buf);
  if (result >= 0) {
    buf.lex_start_p = buf.lex_curr_p;
    let init = buf.lex_curr_p;
    buf.lex_curr_p = {
      pos_fname: init.pos_fname,
      pos_lnum: init.pos_lnum,
      pos_bol: init.pos_bol,
      pos_cnum: buf.lex_abs_pos + buf.lex_curr_pos | 0
    };
  }
  return result;
}

let zero_pos = {
  pos_fname: "",
  pos_lnum: 1,
  pos_bol: 0,
  pos_cnum: 0
};

function from_function(f) {
  return {
    refill_buff: x => {
      let aux_buffer = Caml_bytes.create(512);
      let read = f(aux_buffer, aux_buffer.length);
      let n = read > 0 ? read : (x.lex_eof_reached = true, 0);
      if ((x.lex_buffer_len + n | 0) > x.lex_buffer.length) {
        if (((x.lex_buffer_len - x.lex_start_pos | 0) + n | 0) <= x.lex_buffer.length) {
          Bytes.blit(x.lex_buffer, x.lex_start_pos, x.lex_buffer, 0, x.lex_buffer_len - x.lex_start_pos | 0);
        } else {
          let newlen = (x.lex_buffer.length << 1);
          if (((x.lex_buffer_len - x.lex_start_pos | 0) + n | 0) > newlen) {
            throw new Error("Failure", {
              cause: {
                RE_EXN_ID: "Failure",
                _1: "Lexing.lex_refill: cannot grow buffer"
              }
            });
          }
          let newbuf = Caml_bytes.create(newlen);
          Bytes.blit(x.lex_buffer, x.lex_start_pos, newbuf, 0, x.lex_buffer_len - x.lex_start_pos | 0);
          x.lex_buffer = newbuf;
        }
        let s = x.lex_start_pos;
        x.lex_abs_pos = x.lex_abs_pos + s | 0;
        x.lex_curr_pos = x.lex_curr_pos - s | 0;
        x.lex_start_pos = 0;
        x.lex_last_pos = x.lex_last_pos - s | 0;
        x.lex_buffer_len = x.lex_buffer_len - s | 0;
        let t = x.lex_mem;
        for (let i = 0, i_finish = t.length; i < i_finish; ++i) {
          let v = Caml_array.get(t, i);
          if (v >= 0) {
            Caml_array.set(t, i, v - s | 0);
          }
          
        }
      }
      Bytes.blit(aux_buffer, 0, x.lex_buffer, x.lex_buffer_len, n);
      x.lex_buffer_len = x.lex_buffer_len + n | 0;
    },
    lex_buffer: Caml_bytes.create(1024),
    lex_buffer_len: 0,
    lex_abs_pos: 0,
    lex_start_pos: 0,
    lex_curr_pos: 0,
    lex_last_pos: 0,
    lex_last_action: 0,
    lex_eof_reached: false,
    lex_mem: [],
    lex_start_p: zero_pos,
    lex_curr_p: zero_pos
  };
}

function from_string(s) {
  return {
    refill_buff: lexbuf => {
      lexbuf.lex_eof_reached = true;
    },
    lex_buffer: Bytes.of_string(s),
    lex_buffer_len: s.length,
    lex_abs_pos: 0,
    lex_start_pos: 0,
    lex_curr_pos: 0,
    lex_last_pos: 0,
    lex_last_action: 0,
    lex_eof_reached: true,
    lex_mem: [],
    lex_start_p: zero_pos,
    lex_curr_p: zero_pos
  };
}

function lexeme(lexbuf) {
  let len = lexbuf.lex_curr_pos - lexbuf.lex_start_pos | 0;
  return Bytes.sub_string(lexbuf.lex_buffer, lexbuf.lex_start_pos, len);
}

function sub_lexeme(lexbuf, i1, i2) {
  let len = i2 - i1 | 0;
  return Bytes.sub_string(lexbuf.lex_buffer, i1, len);
}

function sub_lexeme_opt(lexbuf, i1, i2) {
  if (i1 < 0) {
    return;
  }
  let len = i2 - i1 | 0;
  return Bytes.sub_string(lexbuf.lex_buffer, i1, len);
}

function sub_lexeme_char(lexbuf, i) {
  return Caml_bytes.get(lexbuf.lex_buffer, i);
}

function sub_lexeme_char_opt(lexbuf, i) {
  if (i >= 0) {
    return Caml_bytes.get(lexbuf.lex_buffer, i);
  }
  
}

function lexeme_char(lexbuf, i) {
  return Caml_bytes.get(lexbuf.lex_buffer, lexbuf.lex_start_pos + i | 0);
}

function lexeme_start(lexbuf) {
  return lexbuf.lex_start_p.pos_cnum;
}

function lexeme_end(lexbuf) {
  return lexbuf.lex_curr_p.pos_cnum;
}

function lexeme_start_p(lexbuf) {
  return lexbuf.lex_start_p;
}

function lexeme_end_p(lexbuf) {
  return lexbuf.lex_curr_p;
}

function new_line(lexbuf) {
  let lcp = lexbuf.lex_curr_p;
  lexbuf.lex_curr_p = {
    pos_fname: lcp.pos_fname,
    pos_lnum: lcp.pos_lnum + 1 | 0,
    pos_bol: lcp.pos_cnum,
    pos_cnum: lcp.pos_cnum
  };
}

function flush_input(lb) {
  lb.lex_curr_pos = 0;
  lb.lex_abs_pos = 0;
  let init = lb.lex_curr_p;
  lb.lex_curr_p = {
    pos_fname: init.pos_fname,
    pos_lnum: init.pos_lnum,
    pos_bol: init.pos_bol,
    pos_cnum: 0
  };
  lb.lex_buffer_len = 0;
}

let dummy_pos = {
  pos_fname: "",
  pos_lnum: 0,
  pos_bol: 0,
  pos_cnum: -1
};

export {
  dummy_pos,
  from_string,
  from_function,
  lexeme,
  lexeme_char,
  lexeme_start,
  lexeme_end,
  lexeme_start_p,
  lexeme_end_p,
  new_line,
  flush_input,
  sub_lexeme,
  sub_lexeme_opt,
  sub_lexeme_char,
  sub_lexeme_char_opt,
  engine,
  new_engine,
}
/* No side effect */
