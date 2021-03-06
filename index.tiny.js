
/**
   Eval function. Tiny 12 lines version :)

   Our language will only have 4 types of things.

   values (numbers or booleans),
   symbols (represented by strings),
   special forms (what would normaly be 'keywords' in other languages)
   and functions.

   the eval_expr function returns the result of the evaluated expression.

   params:
    expr - the expresion to evaluate.
    ctx - the current scope from which it will get refs.
 */
function eval_expr(expr, ctx){
    if(typeof expr === "number")
        return expr;
    if(typeof expr === "string")
        return ctx(expr);
    if(expr[0] === "if")
        return eval_expr(expr[1], ctx) ? eval_expr(expr[2], ctx) : eval_expr(expr[3], ctx);
    if(expr[0] === "function")
        return argument => eval_expr(expr[2], name_of_argument => expr[1] === name_of_argument ? argument : ctx(name_of_argument));
    if(expr instanceof Array)
        return eval_expr(expr[0], ctx).call(null, eval_expr(expr[1], ctx));
    throw JSON.stringify(expr) + " is not a valid expression.";
}


function global_scope(name){
    if(name === "log")
        return item => console.log(item);
    if(name === "+")
        return a => b => a + b;
    if(name === "<")
        return a => b => a < b ? 1 : 0;
    if(name === "-")
        return a => b => a - b;
    if(name === "*")
        return a => b => a * b;
    throw name + " is not defined.";
}

const factorial_source_code =
  ["log", [
      [["function", "x", ["x", "x"]],
       ["function", "x",
        [["function", "f",
            ["function", "n", //if you sqint, this kinda looks like factorial
              ["if", "n",
                [["*", "n"], ["f", [["-", "n"], 1]]],
                1]]],
        ["function", "arg",
            [["x", "x"], "arg"]]]]], 5]];

const fib_source_code =
  ["log", [
      [["function", "x", ["x", "x"]],
       ["function", "x",
        [["function", "f",
          ["function", "n",
           ["if", [["<", "n"], 2],
            "n",
            [["+", ["f", [["-", "n"], 1]]], ["f", [["-", "n"], 2]]]]]],
         ["function", "arg",
          [["x", "x"], "arg"]]]]], 10]];


// factorial(5) -> 120 :)
eval_expr(factorial_source_code, global_scope); // prints out 120
// fibonaci(10) -> 55 :)
eval_expr(fib_source_code, global_scope); // prints out 55
