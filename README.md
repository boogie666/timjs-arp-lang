# arp-lang


## A pritty bad, really slow, poorly coded, but turing complete lisp dialect :)


### The name - ARP

As you might know, LISP stands for LISt Processor. Since we're going to use javascript as our host language and given that javascript has arrays, as opposed to lists...

Array PRocessor

### Features

ARP does not offer many features as a language. It's a toy lisp after all.

- It only has three types (numbers, symbols and functions)
- Functions can only have a single argument
- Function bodies can only a be single expression
- There are no side effects. (except for print)
- There is no way to define global variables
- There is no way to define local variables (except for the function argument)
- Does not have any 'core' functions. (except for the example code in index.js, that exist only to support the examples)

But it does have the nicest features of any high level language.

- Higher Order Functions - i.e. functions as values.
- Lexical Scoping - i.e. function scope.


Higher order functions make up for quite a few failing of the language.

For example:

Multi arg functions can be represented as multiple single arg functions.

so the javascript function

```
function(a,b) { return a + b; }
```

would become (still in js) 

```
 function(a){ 
    return function(b) { 
       return a + b;
    }; 
 }
 
```

in ARP that would translate to 

```
["function", "x",
   ["function", "y",
      ["+", "x", "y"]]]
```

this is (surprisingly) what Haskell does. (although in a much better way)

And you can't get much more high level then Haskell :) 


Another feature that Higher Order Functions have is that explicit recursion is not needed, and can be implemented using just functions, using something known as the [Y Combinator](http://kestas.kuliukas.com/YCombinatorExplained/).


This is shown in the examples below.


### Examples 

Here are some examples of functions in ARP to show its syntax.

The identity function:

```
["identity", "x", "x"]
```

The factorial function:

```
[["function", "x", ["x", "x"]],
 ["function", "x",
   [["function", "f",
     ["function", "n", 
      ["if", "n",
       [["*", "n"], ["f", [["-", "n"], 1]]],
       1]]],
    ["function", "arg",
     [["x", "x"], "arg"]]]]]
```

The fibonacci function:

```
[["function", "x", ["x", "x"]],
 ["function", "x",
  [["function", "f",
    ["function", "n",
      ["if", [["<", "n"], 2],
      "n",
      [["+", ["f", [["-", "n"], 1]]], ["f", [["-", "n"], 2]]]]]],
    ["function", "arg",
    [["x", "x"], "arg"]]]]]
```




### Resouces

This whole think is shamelessly stolen from other places.

Credits go to:

[William Byrd on "The Most Beautiful Program Ever Written"](https://www.youtube.com/watch?v=OyfBQmvr2Hc) - He does basically exactly this. but in Scheme

[Functional programming - Bodil Stokke](https://www.youtube.com/watch?v=DHubfS8E--o) - She does this as well but in Clojure.


[Structure and Interpretation of Computer Programs](https://www.youtube.com/playlist?list=PL7BcsI5ueSNFPCEisbaoQ0kXIDX9rR5FF) - MIT Course
