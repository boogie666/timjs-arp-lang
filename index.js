

// a basic 'scope' for our language...
// it will never have globals...
// so it will thorw by default.
function ctx(name){
    throw name + " is undefined";
}

/**
   Eval function.

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
    //the numbers.
    if(typeof expr === "number"){
        return expr;
    }
    //symbols (or variables), represented by strings
    if(typeof expr === "string"){
        return ctx(expr);
    }


    //at this point the valid things left in our language
    // are arrays. so we can just assume that's the case

    //first we need some conditionals in our language
    // we're only going to do the basic 'if' expression.
    // this would be somewhat analoguos to javascripts ternary operator ( the a ? b : c thing )

    //our if will look like this:
    // ["if", "condition_expr",
    //    "then_expr",
    //    "else_expr"]

    // 'if' will only ever evaluate either the 'then_expr' or 'else_expr' based on the 'condition_expr'
    // we're just gonna use basic js truthiness here.
    // so that evals to true in javascript will be true in our lang.
    if(expr[0] === "if"){
        const test = expr[1];
        const t = expr[2];
        const f = expr[3];
        // this looks like cheeting...
        // because we use the host 'if' to implement our 'if'
        // but, think about it....
        // if we were to compile to machine code.
        // we'd still use the 'host' if... a conditional jump in the case of machine code.
        // so it's not really cheeting. it's more 'being clever' :P
        if(eval_expr(test, ctx)){
            return eval_expr(t, ctx);
        }else {
            return eval_expr(f, ctx);
        }
    }

    //next we define what a function definition looks like in our lang.
    // a function will be defined in json syntax like so
    // ["function", "arg", [... body ...]]

    // so any array that has the 'keyword' "function" in the first position
    // and another string in the second position
    // and any valid expression in the thrid position
    // will define a function.
    if(expr[0] === "function" ){
        const function_argument = expr[1];
        const function_body = expr[2];
        // we represent a function in our language
        // as a function in the host language (i.e. a javascript function)
        return function(argument){
            //we create a new function to act as the local scope for our function.
            const local_scope = function(name_of_argument){
                // first we need to look in the function_argument.
                // if the function body uses it's own arguments
                // we need to look them up by name
                // and return the value associated with that argument.
                if (function_argument === name_of_argument){
                    return argument;
                }

                //if the value is not in local_scope
                //we defer to the scope above (that will be either the global scope or some encloseing function.)
                return ctx(name_of_argument);
            };

            //lastly we need to eval the function_body with it's local_scope.
            return eval_expr(function_body, local_scope);
        };
    }

    //lastly we need a way of actually calling function defined in our own language
    // here we'll do the lisp thing...
    // basically arrays === calling a function.
    // ["inc" 1] is equivalnet to javascript's inc(1);

    // so if we ever see an array, we just assume that it's a function call at this point.

    // !!note that function definition is also an array!!
    // but because we've already handled that case above.
    // we know that we our interperter ever get's here, we have a function call.
    if(expr instanceof Array){
        const the_function = expr[0]; // the function is the first thing in the array
        const evaluated_function = eval_expr(the_function, ctx); // we need to eval 'the_function', because it can be either a symbol or a annonymus function that we need to create into an actuall function.
        const the_argument = expr[1]; //the arguments are everything else
        const evaluated_argument = eval_expr(the_argument, ctx); // we need to eval the arguments before passing them to our function.
        // remember, our functions, are represented by regular js functions.
        // so we can just use the .apply method on them, passing in the evaluated arguments.
        return evaluated_function(evaluated_argument);
    }

    throw JSON.stringify(expr) + " is not a valid expression.";
}




//'tests'
function global_scope(name){
    if(name === "log"){
        return function(item){
            return console.log(item);
        };
    }

    if(name === "+"){
        return function(a){
            return function(b){
                return a + b;
            };
        };
    }

    if(name === "-"){
        return function(a){
            return function(b){
                return a - b;
            };
        };
    }

    if(name === "*"){
        return function(a){
            return function(b){
                return a * b;
            };
        };
    }

    throw name + " is not defined.";
}

const factorial =
[["function", "x", ["x", "x"]],
 ["function", "x",
  [["function", "f",
    ["function", "n",
     ["if", "n",
      [["*", "n"], ["f", [["-", "n"], 1]]],
      1]]],
   ["function", "arg",
    [["x", "x"], "arg"]]]]];


eval_expr(["log", [factorial, 5]], global_scope); // prints out 120


// break for thunderus applause :)

