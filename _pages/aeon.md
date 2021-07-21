---
layout: page
title: The Æon Programming Language
permalink: /software/aeon/
categories: [Program Synthesis, Refinement Types, Genetic Programming]
---

**Æon** is a programming language with polymorphism and non-liquid refined types. This language is used as the basis for Refinement Typed Genetic Programming due to its support of static verification of polymorphism.
It is important to make notice that while the **Æon** language does not make any distiction, there are two classes of refinements: **liquid refinements** and **non-liquid refinements**.

**Liquid refinements** are those whose satisfiability is statically verified using a SMT Solver.

**Non-Liquid refinements** are those that SMT solvers are not able to reason about, thus being checked at runtime.
 
## Libraries

To more easily allow the interaction of the user with the language, **Æon** provides different kinds of implemented [**libraries**](https://github.com/alcides/aeon/aeon/libraries). The specification of each function for each library can be found in the [**proper markdown**](https://github.com/alcides/aeon/aeon/libraries/Documentation.md).


## Examples

**Æon** acts like syntactic sugar from its core, providing a user friendly syntax, making it easy and intuitive for a new user to engage into program synthesis. The following examples present the basics of the language, many more can be found in the [**examples**](https://github.com/alcides/aeon/examples/aeon3/) folder.

We start by defining a new **Nat** type by refining the **Integer** type with the condition *x >= 0*. The program computes the fibonacci from a given value with type **Nat**.  The output of the functions is restrictively refined to ensure that we never compute a value smaller or equal than the input. The body of the function is implemented using the inline **if then else** expression.

```haskell
type Nat as {x:Integer | x >= 0};

fibonacci(x:Nat) -> {y:Nat | y >= x} {
    if (x <= 1) then x else (n - 1) + fibonacci(n - 2);
}
```

Similarly to the previous example, we create a type alias **RestrictedValue** by refining the **Integer** type. **Æon** allows low-level details to be implemented in another language by using the **native** construct. The *buildKey* and *getKey* functions are natively implemented in the language.
The **decipher** function takes an integer and deciphers the value with the key. The output function ensures that our implementation is bug free! In this case a type exception would raise since the *i* variable can take any value even smaller than ```k.key```. One could easily fix this by refining key value to ensure that it is smaller than *i*, ```{k:Key | k.key < i}```. 
In the **cipher** function by providing the hole operator, ```??```, we are able to delegate the implementation of the function to the compiler. We present our intention of the function behaviour with the **where** specification, in a way to help the synthesis of the program.

```haskell
type RestrictedValue as {x:Integer | x >= 0 && x <= 1024};

type Key {
    {key : RestrictedValue};
}

buildKey(i:RestrictedValue) -> {k:Key | k.key == i} = native;
getKey(key:Key) -> key:RestrictedValue = native;

decipher(i:Integer, k:Key) -> {j:Integer | j > 0} {
    i - getKey(k); 
}

cipher(i:Integer, k:Key) -> j:Integer where {j >= 0 and i == decipher(j, getKey(k))} {
    ??;
}
```
