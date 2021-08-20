(**************************************************************************)
(*                                                                        *)
(*                                 OCaml                                  *)
(*                                                                        *)
(*             Xavier Leroy, projet Cristal, INRIA Rocquencourt           *)
(*                                                                        *)
(*   Copyright 1996 Institut National de Recherche en Informatique et     *)
(*     en Automatique.                                                    *)
(*                                                                        *)
(*   All rights reserved.  This file is distributed under the terms of    *)
(*   the GNU Lesser General Public License version 2.1, with the          *)
(*   special exception on linking described in the file LICENSE.          *)
(*                                                                        *)
(**************************************************************************)

(* Translation from typed abstract syntax to lambda terms,
   for the core language *)

open Misc
open Asttypes
open Primitive
open Types
open Typedtree
open Typeopt
open Lambda

type error =
    Free_super_var
  | Unknown_builtin_primitive of string
  | Unreachable_reached

exception Error of Location.t * error


(* Forward declaration -- to be filled in by Translmod.transl_module *)
let transl_module =
  ref((fun _cc _rootpath _modl -> assert false) :
      module_coercion -> Path.t option -> module_expr -> lambda)


(* Compile an exception/extension definition *)


let transl_extension_constructor env path ext =
  let name =
    match path, None (*!Clflags.for_package*) with
      None, _ -> Ident.name ext.ext_id
    | Some p, None -> Path.name p
    | Some p, Some pack -> Printf.sprintf "%s.%s" pack (Path.name p)
  in
  let loc = ext.ext_loc in
  match ext.ext_kind with
    Text_decl _ ->
      Lprim (Pcreate_extension name,
        [  ]
        ,
        loc)
  | Text_rebind(path, _lid) ->
      transl_extension_path ~loc env path

(* Translation of primitives *)

type specialized = {
  gencomp : Lambda.primitive;
  intcomp : Lambda.primitive;
  boolcomp : Lambda.primitive;
  floatcomp : Lambda.primitive;
  stringcomp : Lambda.primitive;
  bytescomp : Lambda.primitive;
  int64comp : Lambda.primitive;
  simplify_constant_constructor : bool
}

let arity2 name : Lambda.primitive = Lambda.Pccall (Primitive.simple ~name ~arity:2 ~alloc:true)



let comparisons_table = 
  create_hashtable 11 [
  "%equal",
      {
        gencomp = Pccall(Primitive.simple ~name:"caml_equal" ~arity:2 ~alloc:true);
        intcomp = Pintcomp Ceq;
        boolcomp = Pccall (Primitive.simple ~name:"caml_bool_equal" ~arity:2
                      ~alloc:false); 
        floatcomp = Pfloatcomp Ceq;
        stringcomp = Pccall(Primitive.simple ~name:"caml_string_equal" ~arity:2
                ~alloc:false);
        bytescomp = Pccall(Primitive.simple ~name:"caml_bytes_equal" ~arity:2
                ~alloc:false);
        int64comp = Pbintcomp(Pint64, Ceq);
        simplify_constant_constructor = true};
  "%notequal",
      { gencomp = Pccall(Primitive.simple ~name:"caml_notequal" ~arity:2 ~alloc:true);
        intcomp = Pintcomp Cneq;
        boolcomp = Pccall (Primitive.simple ~name:"caml_bool_notequal" ~arity:2
                  ~alloc:false) ;         
        floatcomp = Pfloatcomp Cneq;
        stringcomp = Pccall(Primitive.simple ~name:"caml_string_notequal" ~arity:2
                ~alloc:false);
        bytescomp = Pccall(Primitive.simple ~name:"caml_bytes_notequal" ~arity:2
                ~alloc:false);
        int64comp = Pbintcomp(Pint64, Cneq);
        simplify_constant_constructor = true};
  "%lessthan",
      { gencomp = Pccall(Primitive.simple ~name:"caml_lessthan" ~arity:2 ~alloc:true);
        intcomp = Pintcomp Clt;
        boolcomp = Pccall (Primitive.simple ~name:"caml_bool_lessthan" ~arity:2
                     ~alloc:false);
        floatcomp = Pfloatcomp Clt;
        stringcomp = Pccall(Primitive.simple ~name:"caml_string_lessthan" ~arity:2
                ~alloc:false);
        bytescomp = Pccall(Primitive.simple ~name:"caml_bytes_lessthan" ~arity:2
                ~alloc:false);
        int64comp = Pbintcomp(Pint64, Clt);
        simplify_constant_constructor = false};
  "%greaterthan",
      { gencomp = Pccall(Primitive.simple ~name:"caml_greaterthan" ~arity:2 ~alloc:true);
        intcomp = Pintcomp Cgt;
        boolcomp = Pccall (Primitive.simple ~name:"caml_bool_greaterthan" ~arity:2
            ~alloc:false);
        floatcomp = Pfloatcomp Cgt;
        stringcomp = Pccall(Primitive.simple ~name:"caml_string_greaterthan" ~arity:2
                ~alloc: false);
        bytescomp = Pccall(Primitive.simple ~name:"caml_bytes_greaterthan" ~arity:2
                ~alloc: false);
        int64comp = Pbintcomp(Pint64, Cgt);
        simplify_constant_constructor = false};
  "%lessequal",
      { gencomp = Pccall(Primitive.simple ~name:"caml_lessequal" ~arity:2 ~alloc:true);
        intcomp = Pintcomp Cle;
        boolcomp = Pccall( Primitive.simple ~name:"caml_bool_lessequal" ~arity:2
                    ~alloc:false);
        floatcomp = Pfloatcomp Cle;
        stringcomp = Pccall(Primitive.simple ~name:"caml_string_lessequal" ~arity:2
                ~alloc:false);
        bytescomp = Pccall(Primitive.simple ~name:"caml_bytes_lessequal" ~arity:2
                ~alloc:false);
        int64comp = Pbintcomp(Pint64, Cle);
        simplify_constant_constructor = false};
  "%greaterequal",
      { gencomp = Pccall(Primitive.simple ~name:"caml_greaterequal" ~arity:2 ~alloc:true);
        intcomp = Pintcomp Cge;
        boolcomp = Pccall (Primitive.simple ~name:"caml_bool_greaterequal" ~arity:2
                    ~alloc:false);
        floatcomp = Pfloatcomp Cge;
        stringcomp = Pccall(Primitive.simple ~name:"caml_string_greaterequal" ~arity:2
                ~alloc:false);
        bytescomp = Pccall(Primitive.simple ~name:"caml_bytes_greaterequal" ~arity:2
                ~alloc:false);
        int64comp = Pbintcomp(Pint64, Cge);
        simplify_constant_constructor = false};
  "%compare",
      { gencomp = Pccall(Primitive.simple ~name:"caml_compare" ~arity:2 ~alloc:true);
       (* Not unboxed since the comparison is done directly on tagged int *)
        intcomp = Pccall(Primitive.simple ~name:"caml_int_compare" ~arity:2 ~alloc:false);
        boolcomp = Pccall (Primitive.simple ~name: "caml_bool_compare"
             ~arity:2
             ~alloc:false);
        floatcomp = Pccall(Primitive.simple ~name:"caml_float_compare" ~arity:2
        ~alloc:false);
        stringcomp = Pccall(Primitive.simple ~name:"caml_string_compare" ~arity:2
                ~alloc:false);
        bytescomp = Pccall(Primitive.simple ~name:"caml_bytes_compare" ~arity:2
                ~alloc:false);
        int64comp = Pccall(Primitive.simple ~name:"caml_int64_compare" ~arity:2
        ~alloc:false);
        simplify_constant_constructor = false};
          "%bs_max",
      { gencomp = arity2 "caml_max" ;
        bytescomp = arity2 "caml_max"; (* FIXME bytescomp*)
      intcomp = arity2 "caml_int_max";
      boolcomp = arity2 "caml_bool_max" ; 
      floatcomp = arity2 "caml_float_max" ;
      stringcomp = arity2 "caml_string_max" ;
      int64comp = arity2 "caml_int64_max" ;
      simplify_constant_constructor = false} ;
      ("%bs_min",
      { gencomp = arity2 "caml_min";
        bytescomp = arity2 "caml_min";
        intcomp = arity2 "caml_int_min" ;
      boolcomp = arity2 "caml_bool_min" ;
      floatcomp = arity2 "caml_float_min" ;
      stringcomp = arity2 "caml_string_min"; 
      int64comp = arity2 "caml_int64_min"; 
      simplify_constant_constructor = false}) ;
      (
        "%bs_equal_null",
        { gencomp = arity2 "caml_equal_null";  
          bytescomp = arity2 "caml_equal_null";  (* FIXME*)               
          intcomp = arity2 "caml_int_equal_null";                 
          boolcomp = arity2 "caml_bool_equal_null";                                    
          floatcomp = arity2 "caml_float_equal_null";                        
          stringcomp = arity2 "caml_string_equal_null";                
          int64comp = arity2 "caml_int64_equal_null"; 
          simplify_constant_constructor = true}
      ) ;
      (
        "%bs_equal_undefined",
        { gencomp = arity2 "caml_equal_undefined";                 
          bytescomp = arity2 "caml_equal_undefined"; (* FIXME*)
          intcomp = arity2 "caml_int_equal_undefined";                 
          boolcomp = arity2 "caml_bool_equal_undefined";                             
          floatcomp = arity2 "caml_float_equal_undefined";                        
          stringcomp = arity2 "caml_string_equal_undefined";                
          int64comp = arity2 "caml_int64_equal_undefined"; 
          simplify_constant_constructor = true}
      ) ;
      (
        "%bs_equal_nullable",
        { gencomp = arity2 "caml_equal_nullable";                 
          bytescomp = arity2 "caml_equal_nullable"; (* FIXME *)
          intcomp = arity2 "caml_int_equal_nullable";                 
          boolcomp = arity2 "caml_bool_equal_nullable";                                    
          floatcomp = arity2 "caml_float_equal_nullable";                        
          stringcomp = arity2 "caml_string_equal_nullable"; 
          int64comp = arity2 "caml_int64_equal_nullable"; 
          simplify_constant_constructor = true}
      )
  ]

let primitives_table = 
  create_hashtable 57 [
  "%identity", Pidentity;
  "%bytes_to_string", Pbytes_to_string;
  "%bytes_of_string", Pbytes_of_string;
  "%ignore", Pignore;
  "%revapply", Prevapply;
  "%apply", Pdirapply;
  "%loc_LOC", Ploc Loc_LOC;
  "%loc_FILE", Ploc Loc_FILE;
  "%loc_LINE", Ploc Loc_LINE;
  "%loc_POS", Ploc Loc_POS;
  "%loc_MODULE", Ploc Loc_MODULE;
  (* BEGIN Triples for  ref data type *)
  "%bs_ref_setfield0", Psetfield(0,  Lambda.ref_field_set_info);
  "%bs_ref_field0", Pfield(0, Lambda.ref_field_info);
  "%makemutable", Pmakeblock(Lambda.ref_tag_info);
  "%incr", Poffsetref(1);
  "%decr", Poffsetref(-1);
  (* Finish Triples for  ref data type *)

  "%field0", Pfield (0, Fld_tuple);  
  "%field1", Pfield (1, Fld_tuple);
  "%obj_field", Parrayrefu ;
  "%obj_set_field", Parraysetu ;
  "%obj_is_int", Pisint;
  "%raise", Praise Raise_regular;
  "%reraise", Praise Raise_reraise;
  "%raise_notrace", Praise Raise_notrace;
  "%sequand", Psequand;
  "%sequor", Psequor;
  "%boolnot", Pnot;
  "%big_endian", Pctconst Big_endian;
  "%backend_type", Pctconst Backend_type;
  "%word_size", Pctconst Word_size;
  "%int_size", Pctconst Int_size;
  "%max_wosize", Pctconst Max_wosize;
  "%ostype_unix", Pctconst Ostype_unix;
  "%ostype_win32", Pctconst Ostype_win32;
  "%ostype_cygwin", Pctconst Ostype_cygwin;
  "%negint", Pnegint;
  "%succint", Poffsetint 1;
  "%predint", Poffsetint(-1);
  "%addint", Paddint;
  "%subint", Psubint;
  "%mulint", Pmulint;
  "%divint", Pdivint Safe;
  "%modint", Pmodint Safe;
  "%andint", Pandint;
  "%orint", Porint;
  "%xorint", Pxorint;
  "%lslint", Plslint;
  "%lsrint", Plsrint;
  "%asrint", Pasrint;
  "%eq", Pintcomp Ceq;
  "%noteq", Pintcomp Cneq;
  "%ltint", Pintcomp Clt;
  "%leint", Pintcomp Cle;
  "%gtint", Pintcomp Cgt;
  "%geint", Pintcomp Cge;
  "%intoffloat", Pintoffloat;
  "%floatofint", Pfloatofint;
  "%negfloat", Pnegfloat;
  "%absfloat", Pabsfloat;
  "%addfloat", Paddfloat;
  "%subfloat", Psubfloat;
  "%mulfloat", Pmulfloat;
  "%divfloat", Pdivfloat;
  "%eqfloat", Pfloatcomp Ceq;
  "%noteqfloat", Pfloatcomp Cneq;
  "%ltfloat", Pfloatcomp Clt;
  "%lefloat", Pfloatcomp Cle;
  "%gtfloat", Pfloatcomp Cgt;
  "%gefloat", Pfloatcomp Cge;
  "%string_length", Pstringlength;
  "%string_safe_get", Pstringrefs;
  "%string_unsafe_get", Pstringrefu;
  "%bytes_length", Pbyteslength;
  "%bytes_safe_get", Pbytesrefs;
  "%bytes_safe_set", Pbytessets;
  "%bytes_unsafe_get", Pbytesrefu;
  "%bytes_unsafe_set", Pbytessetu;
  "%array_length", Parraylength ;
  "%array_safe_get", Parrayrefs ;
  "%array_safe_set", Parraysets ;
  "%array_unsafe_get", Parrayrefu ;
  "%array_unsafe_set", Parraysetu ;
  "%floatarray_length", Parraylength ;
  "%floatarray_safe_get", Parrayrefs ;
  "%floatarray_safe_set", Parraysets ;
  "%floatarray_unsafe_get", Parrayrefu ;
  "%floatarray_unsafe_set", Parraysetu ;
  "%lazy_force", Plazyforce;
  "%int64_of_int", Pbintofint Pint64;
  "%int64_to_int", Pintofbint Pint64;
  "%int64_neg", Pnegbint Pint64;
  "%int64_add", Paddbint Pint64;
  "%int64_sub", Psubbint Pint64;
  "%int64_mul", Pmulbint Pint64;
  "%int64_div", Pdivbint { size = Pint64; is_safe = Safe };
  "%int64_mod", Pmodbint { size = Pint64; is_safe = Safe };
  "%int64_and", Pandbint Pint64;
  "%int64_or",  Porbint Pint64;
  "%int64_xor", Pxorbint Pint64;
  "%int64_lsl", Plslbint Pint64;
  "%int64_lsr", Plsrbint Pint64;
  "%int64_asr", Pasrbint Pint64;
  "%nativeint_of_int32", Pcvtbint(Pint32, Pnativeint);
  "%nativeint_to_int32", Pcvtbint(Pnativeint, Pint32);
  "%int64_of_int32", Pcvtbint(Pint32, Pint64);
  "%int64_to_int32", Pcvtbint(Pint64, Pint32);
  "%int64_of_nativeint", Pcvtbint(Pnativeint, Pint64);
  "%int64_to_nativeint", Pcvtbint(Pint64, Pnativeint);
  "%opaque", Popaque;
  "%uncurried_apply", Puncurried_apply;
]


let find_primitive prim_name =
  Hashtbl.find primitives_table prim_name


let specialize_comparison table env ty =
  let {gencomp; intcomp; floatcomp; stringcomp; bytescomp;
             int64comp; _} = table in
  match () with
  | () when is_base_type env ty Predef.path_int
         || is_base_type env ty Predef.path_char
         || (maybe_pointer_type env ty = Immediate)   -> intcomp
  | () when is_base_type env ty Predef.path_float     -> floatcomp
  | () when is_base_type env ty Predef.path_string    -> stringcomp
  | () when is_base_type env ty Predef.path_bytes     -> bytescomp
  | () when is_base_type env ty Predef.path_int64     -> int64comp
  | () when is_base_type env ty Predef.path_bool      -> table.boolcomp  
  | () -> gencomp

(* Specialize a primitive from available type information,
   raise Not_found if primitive is unknown  *)

let specialize_primitive p env ty (* ~has_constant_constructor *) =
  try
    let table = Hashtbl.find comparisons_table p.prim_name in
#if false
    let {gencomp; intcomp; simplify_constant_constructor} =
      table in
    if has_constant_constructor && simplify_constant_constructor then
      intcomp
    else
#end    
      match is_function_type env ty with
      | Some (lhs,_rhs) -> specialize_comparison table env lhs
      | None -> table.gencomp
  with Not_found ->
    find_primitive p.prim_name 

(* Eta-expand a primitive *)

let used_primitives = Hashtbl.create 7
let add_used_primitive loc env path =
  match path with
    Some (Path.Pdot _ as path) ->
      let path = Env.normalize_path (Some loc) env path in
      let unit = Path.head path in
      if Ident.global unit && not (Hashtbl.mem used_primitives path)
      then Hashtbl.add used_primitives path loc
  | _ -> ()

let transl_primitive loc p env ty path =
  let prim =
    try specialize_primitive p env ty (* ~has_constant_constructor:false *)
    with Not_found ->
      add_used_primitive loc env path;
      Pccall p
  in
  match prim with
  | Plazyforce ->
      let parm = Ident.create "prim" in
      Lfunction{ params = [parm];
                body = Matching.inline_lazy_force (Lvar parm) Location.none;
                loc = loc;
                attr = default_stub_attribute }
  | Ploc kind ->
    let lam = lam_of_loc kind loc in
    begin match p.prim_arity with
      | 0 -> lam
      | 1 -> (* TODO: we should issue a warning ? *)
        let param = Ident.create "prim" in
        Lfunction{ params = [param];
                  attr = default_stub_attribute;
                  loc = loc;
                  body = Lprim(Pmakeblock(Blk_tuple),
                               [lam; Lvar param], loc)}
      | _ -> assert false
    end
  | _ ->
      let rec make_params n total =
        if n <= 0 then [] else Ident.create ("prim" ^ string_of_int (total - n)) :: make_params (n-1) total in
      let prim_arity = p.prim_arity in 
      if prim_arity = 0 then Lprim (prim, [], loc) else       
        let params = 
          if prim_arity = 1 then [Ident.create "prim"]  
          else  make_params prim_arity prim_arity in
        Lfunction{ params;
                   attr = default_stub_attribute;
                   loc = loc;
                   body = Lprim(prim, List.map (fun id -> Lvar id) params, loc) }

let transl_primitive_application loc prim env ty path args =
  let prim_name = prim.prim_name in
  try
    (
      match args with 
    | [arg1; _] when 
      is_base_type env arg1.exp_type Predef.path_bool
      && Hashtbl.mem comparisons_table prim_name
      -> 
      (Hashtbl.find comparisons_table prim_name).boolcomp
    | _ ->   
    let has_constant_constructor = match args with
        [_; {exp_desc = Texp_construct(_, {cstr_tag = Cstr_constant _}, _)}]
      | [{exp_desc = Texp_construct(_, {cstr_tag = Cstr_constant _}, _)}; _]
      | [_; {exp_desc = Texp_variant(_, None)}]
      | [{exp_desc = Texp_variant(_, None)}; _] -> true
      | _ -> false
    in
    if has_constant_constructor then
      match Hashtbl.find_opt comparisons_table prim_name with 
      | Some table when table.simplify_constant_constructor -> table.intcomp
      | Some _
      | None -> 
        specialize_primitive prim env ty (* ~has_constant_constructor*)
    else         
        specialize_primitive prim env ty
  )
  with Not_found ->
    if String.length prim_name > 0 && prim_name.[0] = '%' then
      raise(Error(loc, Unknown_builtin_primitive prim_name));
    add_used_primitive loc env path;
    Pccall prim

(* To propagate structured constants *)

exception Not_constant

let extract_constant = function
    Lconst sc -> sc
  | _ -> raise_notrace Not_constant


(* Push the default values under the functional abstractions *)
(* Also push bindings of module patterns, since this sound *)

type binding =
  | Bind_value of value_binding list
  | Bind_module of Ident.t * string loc * module_expr

let rec push_defaults loc bindings cases partial =
  match cases with
    [{c_lhs=pat; c_guard=None;
      c_rhs={exp_desc = Texp_function { arg_label; param; cases; partial; } }
        as exp}] ->
      let cases = push_defaults exp.exp_loc bindings cases partial in
      [{c_lhs=pat; c_guard=None;
        c_rhs={exp with exp_desc = Texp_function { arg_label; param; cases;
          partial; }}}]
  | [{c_lhs=pat; c_guard=None;
      c_rhs={exp_attributes=[{txt="#default"},_];
             exp_desc = Texp_let
               (Nonrecursive, binds, ({exp_desc = Texp_function _} as e2))}}] ->
      push_defaults loc (Bind_value binds :: bindings)
                   [{c_lhs=pat;c_guard=None;c_rhs=e2}]
                   partial
  | [{c_lhs=pat; c_guard=None;
      c_rhs={exp_attributes=[{txt="#modulepat"},_];
             exp_desc = Texp_letmodule
               (id, name, mexpr, ({exp_desc = Texp_function _} as e2))}}] ->
      push_defaults loc (Bind_module (id, name, mexpr) :: bindings)
                   [{c_lhs=pat;c_guard=None;c_rhs=e2}]
                   partial
  | [case] ->
      let exp =
        List.fold_left
          (fun exp binds ->
            {exp with exp_desc =
             match binds with
             | Bind_value binds -> Texp_let(Nonrecursive, binds, exp)
             | Bind_module (id, name, mexpr) ->
                 Texp_letmodule (id, name, mexpr, exp)})
          case.c_rhs bindings
      in
      [{case with c_rhs=exp}]
  | {c_lhs=pat; c_rhs=exp; c_guard=_} :: _ when bindings <> [] ->
      let param = Typecore.name_pattern "param" cases in
      let name = Ident.name param in
      let exp =
        { exp with exp_loc = loc; exp_desc =
          Texp_match
            ({exp with exp_type = pat.pat_type; exp_desc =
              Texp_ident (Path.Pident param, mknoloc (Longident.Lident name),
                          {val_type = pat.pat_type; val_kind = Val_reg;
                           val_attributes = [];
                           Types.val_loc = Location.none;
                          })},
             cases, [], partial) }
      in
      push_defaults loc bindings
        [{c_lhs={pat with pat_desc = Tpat_var (param, mknoloc name)};
          c_guard=None; c_rhs=exp}]
        Total
  | _ ->
      cases

(* Insertion of debugging events *)

let [@inline] event_before _exp lam = lam



let primitive_is_ccall = function
  (* Determine if a primitive is a Pccall or will be turned later into
     a C function call that may raise an exception *)
  | Pccall _ | Pstringrefs  | Pbytesrefs | Pbytessets | Parrayrefs  |
    Parraysets   | Pduprecord  | Pdirapply |
    Prevapply -> true
  | _ -> false

(* Assertions *)

let assert_failed exp =
  let (fname, line, char) =
    Location.get_pos_info exp.exp_loc.Location.loc_start in
#if 1
  let fname = Filename.basename fname in   
#end     
  Lprim(Praise Raise_regular, [
    (Lprim(Pmakeblock(Blk_extension),
          [transl_normal_path Predef.path_assert_failure;
           Lconst(Const_block(Blk_tuple,
              [Const_base(Const_string (fname, None));
               Const_base(Const_int line);
               Const_base(Const_int char)]))], exp.exp_loc))], exp.exp_loc)
;;

let rec cut n l =
  if n = 0 then ([],l) else
  match l with [] -> failwith "Translcore.cut"
  | a::l -> let (l1,l2) = cut (n-1) l in (a::l1,l2)

(* Translation of expressions *)

let try_ids = Hashtbl.create 8

let rec transl_exp e =
  List.iter (Translattribute.check_attribute e) e.exp_attributes;
  transl_exp0 e
and transl_exp0 e =
  match e.exp_desc with
    Texp_ident(path, _, {val_kind = Val_prim p}) ->
      transl_primitive e.exp_loc p e.exp_env e.exp_type (Some path)
  | Texp_ident(path, _, {val_kind = Val_reg }) ->
      transl_value_path ~loc:e.exp_loc e.exp_env path
  | Texp_constant cst ->
      Lconst(Const_base cst)
  | Texp_let(rec_flag, pat_expr_list, body) ->
      transl_let rec_flag pat_expr_list (event_before body (transl_exp body))
  | Texp_function { arg_label = _; param; cases; partial; } ->
      let ( params, body) =        
            let pl = push_defaults e.exp_loc [] cases partial in
            transl_function e.exp_loc  partial
              param pl
      in
      let attr = {
        default_function_attribute with
        inline = Translattribute.get_inline_attribute e.exp_attributes;
        specialise = Translattribute.get_specialise_attribute e.exp_attributes;
      }
      in
      let loc = e.exp_loc in
      Lfunction{ params; body; attr; loc}
  | Texp_apply({ exp_desc = Texp_ident(path, _, {val_kind = Val_prim p});
                exp_type = prim_type } as funct, oargs)
    when List.length oargs >= p.prim_arity
    && List.for_all (fun (_, arg) -> arg <> None) oargs ->
      let args, args' = cut p.prim_arity oargs in
      let wrap f =
        if args' = []
        then f
        else
          let inlined, funct =
            Translattribute.get_and_remove_inlined_attribute funct
          in
          let specialised, _ =
            Translattribute.get_and_remove_specialised_attribute funct
          in
            (transl_apply  ~inlined ~specialised
               f args' e.exp_loc)
      in
      let wrap0 = wrap in
      let args =
         List.map (function _, Some x -> x | _ -> assert false) args in
      let argl = transl_list args in
      begin
        let prim = transl_primitive_application
            e.exp_loc p e.exp_env prim_type (Some path) args in
        match (prim, args) with
          (Praise k, [_]) ->
            let targ = List.hd argl in
            let k =
              match k, targ with
              | Raise_regular, Lvar id
                when Hashtbl.mem try_ids id ->
                  Raise_reraise
              | _ ->
                  k
            in
            wrap0 (Lprim(Praise k, [targ], e.exp_loc))
        | (Ploc kind, []) ->
          lam_of_loc kind e.exp_loc
        | (Ploc kind, [arg1]) ->
          let lam = lam_of_loc kind arg1.exp_loc in
          Lprim(Pmakeblock(Blk_tuple), lam :: argl, e.exp_loc)
        | (Ploc _, _) -> assert false
        | (_, _) ->
            begin match (prim, argl) with
            | (Plazyforce, [a]) ->
                wrap (Matching.inline_lazy_force a e.exp_loc)
            | (Plazyforce, _) -> assert false
            |_ -> let p = Lprim(prim, argl, e.exp_loc) in
               if primitive_is_ccall prim then wrap p else wrap0 p
            end
      end
  | Texp_apply(funct, oargs) ->
      let inlined, funct =
        Translattribute.get_and_remove_inlined_attribute funct
      in
      let specialised, funct =
        Translattribute.get_and_remove_specialised_attribute funct
      in
        (transl_apply  ~inlined ~specialised
           (transl_exp funct) oargs e.exp_loc)
  | Texp_match(arg, pat_expr_list, exn_pat_expr_list, partial) ->
    transl_match e arg pat_expr_list exn_pat_expr_list partial
  | Texp_try(body, pat_expr_list) ->
      let id = Typecore.name_pattern "exn" pat_expr_list in
      Ltrywith(transl_exp body, id,
               Matching.for_trywith (Lvar id) (transl_cases_try pat_expr_list))
  | Texp_tuple el ->
      let ll = transl_list el in
      begin try
        Lconst(Const_block(Blk_tuple, List.map extract_constant ll))
      with Not_constant ->
        Lprim(Pmakeblock(Blk_tuple), ll, e.exp_loc)
      end
  | Texp_construct ({txt = Lident "false"},  _, [])
    -> Lconst Const_false    
  | Texp_construct ({txt = Lident "true"},  _, [])
    -> Lconst Const_true
  | Texp_construct(lid, cstr, args) ->
      let ll  = transl_list args in
      if cstr.cstr_inlined <> None then begin match ll with
        | [x] -> x
        | _ -> assert false
      end else begin match cstr.cstr_tag with
        Cstr_constant n ->
          Lconst(Const_pointer (n,
          match lid.txt with
          | Longident.Ldot (Longident.Lident "*predef*", "None")
          | Longident.Lident "None"
             when Datarepr.constructor_has_optional_shape cstr
            -> Pt_shape_none
          | _ -> 
            if Datarepr.constructor_has_optional_shape cstr then Pt_shape_none 
            else Pt_constructor {name = cstr.cstr_name; const = cstr.cstr_consts; non_const = cstr.cstr_nonconsts}
          ))
      | Cstr_unboxed ->
          (match ll with [v] -> v | _ -> assert false)
      | Cstr_block n ->
          let tag_info : Lambda.tag_info =
            if Datarepr.constructor_has_optional_shape cstr then
              begin 
                match args with
                | [arg] when  Typeopt.cannot_inhabit_none_like_value arg.exp_type arg.exp_env
                  ->
                    (* Format.fprintf Format.err_formatter "@[special boxingl@]@."; *)
                    Blk_some_not_nested
                | _ ->
                    Blk_some
              end
            else Blk_constructor {name = cstr.cstr_name; num_nonconst = cstr.cstr_nonconsts; tag = n} in      
          begin try
            Lconst(Const_block(tag_info, List.map extract_constant ll))
          with Not_constant ->
            Lprim(Pmakeblock(tag_info), ll, e.exp_loc)
          end
      | Cstr_extension(path, _) ->
            Lprim(Pmakeblock(Blk_extension),
                  transl_extension_path e.exp_env path :: ll, e.exp_loc)
      end
  | Texp_extension_constructor (_, path) ->
      transl_extension_path e.exp_env path
  | Texp_variant(l, arg) ->
      let tag = Btype.hash_variant l in
      begin match arg with
        None -> Lconst(Const_pointer (tag, Pt_variant {name = l}))
      | Some arg ->
          let lam = transl_exp arg in
          let tag_info = Blk_poly_var l in 
          try
            Lconst(Const_block(tag_info, [Const_base(Const_int tag);
                                   extract_constant lam]))
          with Not_constant ->
            Lprim(Pmakeblock(tag_info),
                  [Lconst(Const_base(Const_int tag)); lam], e.exp_loc)
      end
  | Texp_record {fields; representation; extended_expression} ->
      transl_record e.exp_loc e.exp_env fields representation
        extended_expression
  | Texp_field(arg, _, lbl) ->
      let targ = transl_exp arg in
      begin match lbl.lbl_repres with
          Record_regular | Record_object  -> 
          Lprim (Pfield (lbl.lbl_pos, !Lambda.fld_record lbl), [targ], e.exp_loc) 
        | Record_inlined _ ->
          Lprim (Pfield (lbl.lbl_pos, Fld_record_inline {name = lbl.lbl_name}), [targ], e.exp_loc)
        | Record_unboxed _ -> targ
        | Record_extension ->
          Lprim (Pfield (lbl.lbl_pos + 1, Fld_record_extension {name = lbl.lbl_name}), [targ], e.exp_loc) 
      end
  | Texp_setfield(arg, _, lbl, newval) ->
      let access =
        match lbl.lbl_repres with
          Record_regular | Record_object -> 
          Psetfield(lbl.lbl_pos,  !Lambda.fld_record_set lbl)
        | Record_inlined _ -> 
          Psetfield(lbl.lbl_pos,  Fld_record_inline_set lbl.lbl_name)
        | Record_unboxed _ -> assert false
        | Record_extension -> 
          Psetfield (lbl.lbl_pos + 1,  Fld_record_extension_set lbl.lbl_name)
      in
      Lprim(access, [transl_exp arg; transl_exp newval], e.exp_loc)
  | Texp_array expr_list ->
      let ll = transl_list expr_list in
      Lprim(Pmakearray Mutable, ll, e.exp_loc)

  | Texp_ifthenelse(cond, ifso, Some ifnot) ->
      Lifthenelse(transl_exp cond,
                  event_before ifso (transl_exp ifso),
                  event_before ifnot (transl_exp ifnot))
  | Texp_ifthenelse(cond, ifso, None) ->
      Lifthenelse(transl_exp cond,
                  event_before ifso (transl_exp ifso),
                  lambda_unit)
  | Texp_sequence(expr1, expr2) ->
      Lsequence(transl_exp expr1, event_before expr2 (transl_exp expr2))
  | Texp_while(cond, body) ->
      Lwhile(transl_exp cond, event_before body (transl_exp body))
  | Texp_for(param, _, low, high, dir, body) ->
      Lfor(param, transl_exp low, transl_exp high, dir,
           event_before body (transl_exp body))
  | Texp_send(expr,Tmeth_name nm ,_) -> 
    let obj = transl_exp expr in   
    Lsend( nm,obj,e.exp_loc)
  | Texp_new _ 
  | Texp_instvar _
  | Texp_setinstvar _
  | Texp_override _ ->
      assert false
  | Texp_letmodule(id, _loc, modl, body) ->
      let defining_expr =
         !transl_module Tcoerce_none None modl
      in
      Llet(Strict, Pgenval, id, defining_expr, transl_exp body)
  | Texp_letexception(cd, body) ->
      Llet(Strict, Pgenval,
           cd.ext_id, transl_extension_constructor e.exp_env None cd,
           transl_exp body)
  | Texp_pack modl ->
      !transl_module Tcoerce_none None modl
  | Texp_assert {exp_desc=Texp_construct(_, {cstr_name="false"}, _)} ->
      if !Clflags.no_assert_false then
        Lambda.lambda_assert_false
      else 
        assert_failed e  
  | Texp_assert (cond) ->
      if !Clflags.noassert
      then lambda_unit
      else Lifthenelse (transl_exp cond, lambda_unit, assert_failed e)
  | Texp_lazy e ->
      (* when e needs no computation (constants, identifiers, ...), we
         optimize the translation just as Lazy.lazy_from_val would
         do *)
      Lprim(Pmakeblock(Blk_lazy_general), [transl_exp e], e.exp_loc)
     
  | Texp_object () ->
      assert false
  | Texp_unreachable ->
      raise (Error (e.exp_loc, Unreachable_reached))

and transl_list expr_list =
  List.map transl_exp expr_list


and transl_guard guard rhs =
  let expr = event_before rhs (transl_exp rhs) in
  match guard with
  | None -> expr
  | Some cond ->
      event_before cond (Lifthenelse(transl_exp cond, expr, staticfail))

and transl_case {c_lhs; c_guard; c_rhs} =
  c_lhs, transl_guard c_guard c_rhs

and transl_cases cases =
  let cases =
    Ext_list.filter cases (fun c -> c.c_rhs.exp_desc <> Texp_unreachable) in
  List.map transl_case cases

and transl_case_try {c_lhs; c_guard; c_rhs} =
  match c_lhs.pat_desc with
  | Tpat_var (id, _)
  | Tpat_alias (_, id, _) ->
      Hashtbl.replace try_ids id ();
      Misc.try_finally
        (fun () -> c_lhs, transl_guard c_guard c_rhs)
        (fun () -> Hashtbl.remove try_ids id)
  | _ ->
      c_lhs, transl_guard c_guard c_rhs

and transl_cases_try cases =
  let cases =
    Ext_list.filter cases (fun c -> c.c_rhs.exp_desc <> Texp_unreachable) in
  List.map transl_case_try cases


and transl_apply  ?(inlined = Default_inline)
      ?(specialised = Default_specialise) lam sargs loc =
  let lapply funct args =
    match funct with
    (** Attention: This may not be what we need to change the application arity*)
    | Lapply ap ->
        Lapply {ap with ap_args = ap.ap_args @ args; ap_loc = loc}
    | lexp ->
        Lapply {
                ap_loc=loc;
                ap_func=lexp;
                ap_args=args;
                ap_inlined=inlined;
                ap_specialised=specialised;}
  in
  let rec build_apply lam args = function
      (None, optional) :: l ->
        let defs = ref [] in
        let protect name lam =
          match lam with
            Lvar _ | Lconst _ -> lam
          | _ ->
              let id = Ident.create name in
              defs := (id, lam) :: !defs;
              Lvar id
        in
        let args, args' =
          if List.for_all (fun (_,opt) -> opt) args then [], args
          else args, [] in
        let lam =
          if args = [] then lam else lapply lam (List.rev_map fst args) in
        let handle = protect "func" lam
        and l = List.map (fun (arg, opt) -> may_map (protect "arg") arg, opt) l
        and id_arg = Ident.create "param" in
        let body =
          match build_apply handle ((Lvar id_arg, optional)::args') l with
            Lfunction{params = ids; body = lam; attr; loc} ->
              Lfunction{params = id_arg::ids; body = lam; attr;
                        loc}
          | lam ->
              Lfunction{params = [id_arg]; body = lam;
                        attr = default_stub_attribute; loc = loc}
        in
        List.fold_left
          (fun body (id, lam) -> Llet(Strict, Pgenval, id, lam, body))
          body !defs
    | (Some arg, optional) :: l ->
        build_apply lam ((arg, optional) :: args) l
    | [] ->
        lapply lam (List.rev_map fst args)
  in
  (build_apply lam [] (List.map (fun (l, x) ->
                                   may_map transl_exp x, Btype.is_optional l)
                                sargs)
     : Lambda.lambda)

and transl_function loc   partial param cases =
  match cases with
    [{c_lhs=pat; c_guard=None;
      c_rhs={exp_desc = Texp_function { arg_label = _; param = param'; cases;
        partial = partial'; }} as exp}]
    when Parmatch.inactive ~partial pat ->
      let (params, body) =
        transl_function exp.exp_loc   partial' param' cases in
      ((param :: params),
       Matching.for_function loc None (Lvar param) [pat, body] partial)
  | _ ->
      ([param],
       Matching.for_function loc None (Lvar param)
         (transl_cases cases) partial)

and transl_let rec_flag pat_expr_list body =
  match rec_flag with
    Nonrecursive ->
      let rec transl = function
        [] ->
          body
      | {vb_pat=pat; vb_expr=expr; vb_attributes=attr; vb_loc} :: rem ->
          let lam = transl_exp expr in
          let lam =
            Translattribute.add_inline_attribute lam vb_loc attr
          in
          let lam =
            Translattribute.add_specialise_attribute lam vb_loc attr
          in
          Matching.for_let pat.pat_loc lam pat (transl rem)
      in transl pat_expr_list
  | Recursive ->
      let idlist =
        List.map
          (fun {vb_pat=pat} -> match pat.pat_desc with
              Tpat_var (id,_) -> id
            | Tpat_alias ({pat_desc=Tpat_any}, id,_) -> id
            | _ -> assert false)
        pat_expr_list in
      let transl_case {vb_expr=expr; vb_attributes; vb_loc} id =
        let lam = transl_exp expr in
        let lam =
          Translattribute.add_inline_attribute lam vb_loc
            vb_attributes
        in
        let lam =
          Translattribute.add_specialise_attribute lam vb_loc
            vb_attributes
        in
        (id, lam) in
      Lletrec(List.map2 transl_case pat_expr_list idlist, body)


and transl_record loc env fields repres opt_init_expr =
   match opt_init_expr, repres, fields with 
  | None, Record_unboxed _, [|{lbl_name; lbl_loc}, Overridden (_,expr)|]
    ->     
      (** ReScript uncurried encoding *)
      let loc = lbl_loc in 
      let lambda = transl_exp expr in 
      if lbl_name.[0] = 'I' then
        let arity_s = String.sub lbl_name 1 (String.length lbl_name - 1) in 
        let prim = 
          Primitive.make ~name:"#fn_mk" 
                  ~alloc:true 
                  ~native_name:arity_s 
                  ~native_repr_args:[Same_as_ocaml_repr] 
                  ~native_repr_res: Same_as_ocaml_repr in 
        Lprim (
          Pccall prim (* could be replaced with Opaque in the future except arity 0*)
            , [lambda],loc)
      else lambda  
  | _ ->           
  let size = Array.length fields in
  (* Determine if there are "enough" fields (only relevant if this is a
     functional-style record update *)
  let no_init = match opt_init_expr with None -> true | _ -> false in
  if no_init || size < 20 (*if !Config.bs_only then 20 else Config.max_young_wosize*) 
  (* TODO: More strategies
     3 + 2 * List.length lbl_expr_list >= size (density)
  *)
  then begin
    (* Allocate new record with given fields (and remaining fields
       taken from init_expr if any *)
    let init_id = Ident.create "init" in
    let lv =
      Array.mapi
        (fun i (lbl, definition) ->
           match definition with
           | Kept _ ->
               let access =
                 match repres with
                   Record_regular | Record_object ->   Pfield (i, !Lambda.fld_record lbl) 
                 | Record_inlined _ -> Pfield (i, Fld_record_inline {name = lbl.lbl_name}) 
                 | Record_unboxed _ -> assert false
                 | Record_extension -> Pfield (i + 1, Fld_record_extension {name = lbl.lbl_name})in 
               Lprim(access, [Lvar init_id], loc)
           | Overridden (_lid, expr) ->
               transl_exp expr)
        fields
    in
    let ll = Array.to_list lv in
    let mut =
      if Array.exists (fun (lbl, _) -> lbl.lbl_mut = Mutable) fields
      then Mutable
      else Immutable in
    let lam =
      try
        if mut = Mutable then raise Not_constant;
        let cl = List.map extract_constant ll in
        match repres with
        | Record_object -> Lconst(Const_block(!Lambda.blk_record fields mut Record_object, cl)) 
        | Record_regular -> Lconst(Const_block(!Lambda.blk_record fields mut Record_regular, cl)) 
        | Record_inlined {tag;name;num_nonconsts} -> Lconst(Const_block(!Lambda.blk_record_inlined fields name num_nonconsts ~tag mut, cl))
        | Record_unboxed _ -> Lconst(match cl with [v] -> v | _ -> assert false)
        | Record_extension ->
            raise Not_constant
      with Not_constant ->
        match repres with
        | Record_regular -> 
          Lprim(Pmakeblock(!Lambda.blk_record fields mut Record_regular), ll, loc) 
        | Record_object ->
          Lprim(Pmakeblock(!Lambda.blk_record fields mut Record_object), ll, loc) 
        | Record_inlined {tag;name; num_nonconsts} ->
          Lprim(Pmakeblock(!Lambda.blk_record_inlined fields name num_nonconsts ~tag mut), ll, loc)
        | Record_unboxed _ -> (match ll with [v] -> v | _ -> assert false)
        | Record_extension ->
            let path =
              let (label, _) = fields.(0) in
              match label.lbl_res.desc with
              | Tconstr(p, _, _) -> p
              | _ -> assert false
            in
            let slot = transl_extension_path env path in
            Lprim(Pmakeblock(!Lambda.blk_record_ext fields mut), slot :: ll, loc) 
    in
    begin match opt_init_expr with
      None -> lam
    | Some init_expr -> Llet(Strict, Pgenval, init_id,
                             transl_exp init_expr, lam)
    end
  end else begin
    (* Take a shallow copy of the init record, then mutate the fields
       of the copy *)
    let copy_id = Ident.create "newrecord" in
    let update_field cont (lbl, definition) =
      match definition with
      | Kept _type -> cont
      | Overridden (_lid, expr) ->
          let upd =
            match repres with
            | Record_object
            | Record_regular -> 
              Psetfield(lbl.lbl_pos,  !Lambda.fld_record_set lbl)
            | Record_inlined _ -> 
                Psetfield(lbl.lbl_pos,  Fld_record_inline_set lbl.lbl_name)
            | Record_unboxed _ -> assert false
            | Record_extension -> 
                Psetfield(lbl.lbl_pos + 1,  Fld_record_extension_set lbl.lbl_name)
          in
          Lsequence(Lprim(upd, [Lvar copy_id; transl_exp expr], loc), cont)
    in
    begin match opt_init_expr with
      None -> assert false
    | Some init_expr ->
        Llet(Strict, Pgenval, copy_id,
             Lprim(Pduprecord , [transl_exp init_expr], loc),
             Array.fold_left update_field (Lvar copy_id) fields)
    end
  end

and transl_match e arg pat_expr_list exn_pat_expr_list partial =
  let id = Typecore.name_pattern "exn" exn_pat_expr_list
  and cases = transl_cases pat_expr_list
  and exn_cases = transl_cases_try exn_pat_expr_list in
  let static_catch body val_ids handler =
    let static_exception_id = next_negative_raise_count () in
    Lstaticcatch
      (Ltrywith (Lstaticraise (static_exception_id, body), id,
                 Matching.for_trywith (Lvar id) exn_cases),
       (static_exception_id, val_ids),
       handler)
  in
  match arg, exn_cases with
  | {exp_desc = Texp_tuple argl}, [] ->
    Matching.for_multiple_match e.exp_loc (transl_list argl) cases partial
  | {exp_desc = Texp_tuple argl}, _ :: _ ->
    let val_ids = List.map (fun _ -> Typecore.name_pattern "val" []) argl in
    let lvars = List.map (fun id -> Lvar id) val_ids in
    static_catch (transl_list argl) val_ids
      (Matching.for_multiple_match e.exp_loc lvars cases partial)
  | arg, [] ->
    Matching.for_function e.exp_loc None (transl_exp arg) cases partial
  | arg, _ :: _ ->
    let val_id = Typecore.name_pattern "val" pat_expr_list in
    static_catch [transl_exp arg] [val_id]
      (Matching.for_function e.exp_loc None (Lvar val_id) cases partial)


(* Wrapper for class compilation *)

(*
let transl_exp = transl_exp_wrap

let transl_let rec_flag pat_expr_list body =
  match pat_expr_list with
    [] -> body
  | (_, expr) :: _ ->
      Translobj.oo_wrap expr.exp_env false
        (transl_let rec_flag pat_expr_list) body
*)

(* Error report *)

open Format

let report_error ppf = function
  | Free_super_var ->
      fprintf ppf
        "Ancestor names can only be used to select inherited methods"
  | Unknown_builtin_primitive prim_name ->
      fprintf ppf "Unknown builtin primitive \"%s\"" prim_name
  | Unreachable_reached ->
      fprintf ppf "Unreachable expression was reached"

let () =
  Location.register_error_of_exn
    (function
      | Error (loc, err) ->
          Some (Location.error_of_printer loc report_error err)
      | _ ->
        None
    )
