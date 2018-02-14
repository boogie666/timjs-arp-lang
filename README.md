# arp-lang


## A pritty bad, really slow, poorly coded, but turring complete lisp dialect :)


### The name - ARP

As you might know, LISP stands for LISt Processor. Since we're going to use javascript as our host language and given that javascript has arrays, as opposed to lists...

Array PRocessor


### Examples 

The identity function:

`["identity", "x", "x"]`

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
