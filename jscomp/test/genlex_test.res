open Genlex

let lexer = make_lexer(list{"+", "-", "*", "/", "let", "=", "(", ")"})

let to_list = s => {
  let rec aux = acc =>
    switch Stream.next(s) {
    | exception Stream.Failure => List.rev(acc)
    | v => aux(list{v, ...acc})
    }
  aux(list{})
}

let suites = {
  open Mt
  list{
    (
      "lexer_stream_genlex",
      _ => Eq(
        list{Int(3), Kwd("("), Int(3), Kwd("+"), Int(2), Int(-1), Kwd(")")},
        to_list(lexer(Stream.of_string("3(3 + 2 -1)"))),
      ),
    ),
  }
}

Mt.from_pair_suites(__MODULE__, suites)
