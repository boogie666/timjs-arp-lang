

function ctx(name){
    throw name + " is undefined";
}

function eval_expr(expr, ctx){
    if(typeof expr === "number"){
        return expr;
    }
    if(typeof expr === "string"){
        return ctx(expr);
    }

    if(expr[0] === "if"){
        const test = expr[1];
        const t = expr[2];
        const f = expr[3];
        if(eval_expr(test, ctx)){
            return eval_expr(t, ctx);
        }else {
            return eval_expr(f, ctx);
        }
    }

    if(expr[0] === "function" && expr[1] instanceof Array){
        const function_arguments = expr[1];
        const function_body = expr[2];
        return function(/*args*/){
            const arg_values = Array.from(arguments);
            const local_scope = function(name_of_argument){
                for(var i = 0; i < function_arguments.length; i++){
                    if (function_arguments[i] === name_of_argument){
                        return arg_values[i];
                    }
                }

                return ctx(name_of_argument);
            };

            return eval_expr(function_body, local_scope);
        };
    }

    if(expr instanceof Array){
        const the_function = expr[0]; 
        const evaluated_function = eval_expr(the_function, ctx); 
        const the_arguments = expr.slice(1); 
        const evaluated_arguments = the_arguments.map(x => eval_expr(x, ctx)); 
        return evaluated_function.apply(null, evaluated_arguments);
    }
    throw JSON.stringify(expr) + " is not a valid expression.";
}




//'tests'

console.log("evaluate a number:", eval_expr(42, ctx)); // will print out the number 42.

try{
    console.log("eval a symbol that is undefined:", eval_expr("hello", ctx)); // will throw, since hello is not defined
}catch(e){
    console.error(e);
}


console.log("conditonal", eval_expr(["if", 1, 1, 42]));// will print out 1 
console.log("conditonal", eval_expr(["if", 0, "x", 42]));// will print out 42, and the 'symbol' x will not be eval, so it will not throw 'x is undefined'.

console.log("function definition 1:", eval_expr(["function", ["x"], "x"])); // this will print out what effectively is the 'identity function'.

const identity_function = eval_expr(["function", ["x"], "x"], ctx);
//because a function in our lang is represented by a function in js we can just call it.
// this will print out 42, because the identity function just returns it's argument;
console.log("function definition, call from js:", identity_function(42));


//at this point we can even do have function returning other functions

const constant_function = eval_expr(["function", ["x"],
                                        ["function", [],
                                            "x"]]);

const constant_42 = constant_function(42); //will always return 42
const constant_1 = constant_function(1); // will always return 1

console.log("constant function 42:" ,constant_42("anything goes here")); // 42
console.log("constant function 1:", constant_1("anything goes here, as well")); // 1

console.log("function application:", eval_expr([["function", ["x"], "x"], 1], ctx)); //will print out one


console.log('host function interop.');
//let actually do something.
//we're going to create a scope, to act as our global scope.
//where we'll define log, +, - and *
function global_scope(name){
    if(name === "log"){
        return function(){
            return console.log.apply(console, arguments);
        };
    }

    if(name === "+"){
        return function(a, b){
            return a + b;
        };
    }

    if(name === "-"){
        return function(a, b){
            return a - b;
        };
    }

    if(name === "*"){
        return function(a, b){
            return a * b;
        };
    }

    throw name + " is not defined.";
}

//since we've defined a 'core' function called 'log' we don't actually need console.log anymore.
let source_code = ["log", [["function", ["x"], ["+", "x", 1]], 41]];

// the function above create an annonymus function that increments its argument by one,
// it calls that function with 41 and then calls log on the result.
// evaluating this expression will print out the number 42.
eval_expr(source_code, global_scope);



//never to this at home kids...
//this is the y combinator... a very complicated way to do recursion without function names.
const factorial =
[["function", ["x"], ["x", "x"]],
 ["function", ["x"],
  [["function", ["f"],
    ["function", ["n"],
     ["if", "n", ["*", "n", ["f", ["-", "n", 1]]], 1]]], ["function", ["arg"],
                                                          [["x", "x"], "arg"]]]]];


console.log("our language is now 'turing complete :)");
eval_expr(["log", [factorial, 5]], global_scope); // prints out 120


// break for applause :)
