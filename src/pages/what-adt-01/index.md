---
title: What the ADT 01 - Getting to the Heart of Things
date: "2018-05-06T21:18:15.284Z"
---

## Part 1: Let's Get Logical...Logical

Welcome back! Last time we ... well, we didn't do much of anything. We stated our purpose: a number-guessing game. All the code is [in this repo](https://github.com/shatteredaesthetic/cipher-guess), in the `what-adt-01` branch, if you'd like to follow along. With that, let's begin!

#### To Begin at the Beginning...

To begin, we should probably talk about what we want to achieve. How do we want to model the logic branching? We're going to take user input, so the first thing we should do is make sure what we're given was what we asked for. Sometimes users can be ... _special_ ... and we need to handle that appropriately.

How does `Either` play into this? `Either` is the canonical sum type, meaning it has two constructors, and the value of the type is _either_ one constructor or the other. `Either`'s constructors are `Right` and `Left`. We'll use `Left` for all wrong answers and `Right` to pass the value along.

> **Theory Aside**
>
> `Either`'s data type looks like
>
> ```haskell
> data Either b a = Left b | Right a
> ```
>
> Since we'll be `chain`ing on the `Either`s, errors will go into `Left`s. Trying to `chain` on a `Left` just returns the `Left`. Excellent!

So, step one is to validate the input. Now we need to check if the guess is within the tolerance, and if equals the target exactly. That will be our step two and three, respectively.

#### Enough planning, Let's write some code

So, like all modern epics, we start by importing some essentials.

```js
const { Either } = require('crocks')
const { Right, Left } = Either
```

Since we're modeling logic with `Either`, let's import it from `crocks`. We extract `Right` and `Left` from `Either` just as a convenience, and to reduce typing.

With this in place, let's start on our validating first step:

```js
// firstTest : Int -> Either String Int
const firstTest = n =>
  1 <= n && n <= 100 && !isNaN(n)
    ? Right(n)
    : Left('You need to learn to follow instructions')
```

So, in our first test, we'll want to validate the user input `n`. We will be asking for an integer between 1 and 100, so we'll want to be sure that the input is both an integer and within the range we asked for. We'll put a validated input into a `Right`, allowing it to proceed to the next test. Anything invalid is put into a `Left` with our pithy response, bypassing the rest of the tests. No need to check if 'a' is between 1 and 100, right? What is this, ASCII?

```js
const { taggedSum } = require('daggy')

const Ord = taggedSum('Ord', {
  LT: [],
  EQ: [],
  GT: [],
})
```

This next section includes a twist! We're going to introduce a new sum type, and for that we'll need to import `daggy`. Our new type will be the union of possibilities of comparing two integers: less than (`Ord.LT`), greater than (`Ord.GT`), or equal to (`Ord.EQ`). As you've probably divined, we are going to call this type `Ord`, after the same type from haskell.

> **Theory Aside**
>
> `Either` is the canonical sum type because it has the least number of different constructors, 2. But we can make our own sum type with any number of constructors. For `Ord`, we have 3.

Why do we need this? It helps us to model our signal flow nicely. Let's look at the next test:

```js
const branch = require('crocks/Pair/branch')

// isTolerant : (Int, Int) -> Int -> Eq
const isTolerant = (low, high) => n =>
  n < low ? Ord.LT : n > high ? Ord.GT : Ord.EQ

// secondTest : Env -> Int -> Either String Int
const secondTest = ({ target, tolerance }) => n =>
  branch(target)
    .bimap(x => x - tolerance, x => x + tolerance)
    .merge(isTolerant)
    .call(null, n)
    .cata({
      LT: () => Left('Too Low'),
      EQ: () => Right(n),
      GT: () => Left('Too High'),
    })
```

In this test, we are checking to see if the guess is within the accepted tolerance, or whether it is too high or too low. This is accomplished with the `isTolerant` function. Now...what is going on with `secondTest`?

We're using a `Pair` and some interesting helpers from `crocks` here. First, we branch the target. This gives us a `Pair` with the target in both positions. Then, we bimap, using each function to map its respective target. Then, we merge them, supplying `isTolerant` with it's `low` and `high` parameters, returning a function. We `call` that function with our number, `n`, returning our `Ord`.

This may help:

```js
branch(target) // Pair Int Int
  .bimap(x => x - tolerance, x => x + tolerance) // Pair Int Int
  .merge(isTolerant) // Function: Int -> Ord
  .call(null, n) // Ord
  .cata({
    LT: () => Left('Too Low'), // ...
    EQ: () => Right(n), // ...
    GT: () => Left('Too High'),
  }) // Either String Int
```

This last function, `cata`, is a method returned from every sum type you make from `daggy`. It allows you to pattern match on your sum type's constructors. We use this to set the result of our test, passing a number within the tolerance to the `Right`, and a number outside of it to the `Left`, giving it the appropriate result string.

So far, so good...one more test to go:

```js
// thirdTest : Env -> Int -> Either String String
const thirdTest = ({ target }) => n =>
  target === n ? Right('Win') : Right('Close Enough')
```

The last test is a check to see if our player exactly guessed the number. We check that the guess is equal to the target, returning a `Right` if it is, and a...`Right` if it isn't? You read that right: either way it's a winning guess; but maybe (hint, hint)(or is it branch(hint)?) we'll want to score them differently...but for now we'll just give both their own result string.

#### Cool, Three tests...now what?

Those three tests seem to be all we need, but how do we put them together? Let's look at those type signatures again:

```js
// firstTest : Int -> Either String Int
// secondTest : Env -> Int -> Either String Int
// thirdTest : Env -> Int -> Either String String
```

Ignoring the `Env` for the second two tests for a second, those type signatures are pretty similar. it seems we take a `b` and return an `Either a b`, then we take that `b` and return another `Either a b`. Finally, we take that `b` and return a final `Either a b`. There's a function for that, turns out: `chain`.

```js
// runTests : Env -> Int -> Either String Int
const runTests = env => n =>
  Either.of(n)
    .chain(firstTest)
    .chain(secondTest(env))
    .chain(thirdTest(env))
```

This is one way to go, but we can do better. `crocks` has a handy kleisli composition function, `composeK`, that would allow us to be a bit more pointfree. However, we're going to use `pipeK` instead, since it reads nicer here, and it's only `composeK` backwards.

```js
const { pipeK } = require('crocks')

// runTests : Env -> Int -> Either String Int
const runTests = env =>
  pipeK(Either.of, firstTest, secondTest(env), thirdTest(env))
```

Now, we just feed `runTests` with an `env` and an int, and we'll get back an `Either String String` holding our result.

So, what's with all this 'env' stuff? There are some variables that are global, that we'd like to have in the tests, but we're trying to be all functional and such, so we can't have something as simple as global variables. No, we keeps our functions pure.

#### We need us some Config Magic

So, what're we to do? Enter: the `Reader`. `Reader` wraps a function from an environment to any type. In typespeak, that's

```haskell
newtype Reader e a = Reader { runWith : e -> a }
```

which, in javascript, I guess would be something like

```js
// Reader : (e -> a) -> { runWith : e -> a }
```

> `Reader` is a newtype wrapper around a unary function. It takes a function from an environment to a type, and returns a `Reader` with a method called `runWith` that, you guessed it, runs the `Reader` with an environment. In Javascript that means, you guessed it, an object!

We get a cool function with `Reader`, called `ask`. `ask` returns the environment, allowing you to map over it, which is exactly what we'll do.

```js
const { pipe } = require('crocks')
const runWith = require('crocks/pointfree/runWith')

// gameLogic : Either String Int -> Reader (Either String String)
const gameLogic = either => Reader.ask().map(env => either.chain(runTests(env)))

// logic : Env -> Int -> Either String String)
const logic = env => pipe(Either.of, gameLogic, runWith(env))
```

We import a pointfree version of `runWith` to get out of our Reader. `gameLogic` takes an `Either` and returns a `Reader` that contains an `Either` that holds the result.(`Reader (Either String String`) It calls `ask` to get the environment, and maps over it, chaining `runTests` to the `either` parameter with the environment applied. `logic` simply takes an Int, wraps it in an `Either`, calls `gameLogic` on it, then unwraps the `Reader`, supplying it with the `env` parameter.

#### That all seems logical, but...

So, we give `logic` an Int, and it gives us ... an `Either String String`? What are we supposed to do with this? We'll address this in a later post, but for now, here's a helper function to log out the result, informing us of which side of the `Either` we got.

```js
const either = require('crocks/pointfree/either')

// output : Either String String -> ()
const output = either(
  str => console.log(`Left: ${str}`),
  str => console.log(`Right: ${str}`)
)
```

Eww, too impure, but we'll fix that next time. For now, let's try out our `logic` function with some targets and tolerances.

```js
// env : Env
const env = {
  target: 23,
  tolerance: 3,
}

const result = pipe(logic(env), output)
```

I know you're thinking, _"I thought you said 'no global variables.' What gives?"_. Well ... ignore that, okay? Purity has its limits. You're missing the cool part: gotta love composition for those easy helper functions, am I right? Testing our logic is as simple as

```js
result('a')
result(101)
result(3)
result(23)
result(25)
result(77)
```

Results in the terminal are

```
'Left: You need to learn to follow instructions'
'Left: You need to learn to follow instructions'
'Left: Too Low'
'Right: Win'
'Right: Close Enough'
'Left: Too High'
```

And here's the complete code, for reference

```js
const { Either, Reader, pipe, pipeK } = require('crocks')
const branch = require('crocks/Pair/branch')
const either = require('crocks/pointfree/either')
const runWith = require('crocks/pointfree/runWith')
const { taggedSum } = require('daggy')
const { Right, Left } = Either

const Ord = taggedSum('Ord', {
  LT: [],
  EQ: [],
  GT: [],
})

// isTolerant : (Int, Int) -> Int -> Eq
const isTolerant = (low, high) => n =>
  n < low ? Ord.LT : n > high ? Ord.GT : Ord.EQ

// firstTest : Int -> Either String Int
const firstTest = n =>
  1 <= n && n <= 100 && !isNaN(n)
    ? Right(n)
    : Left('You need to learn to follow instructions')

// secondTest : Env -> Int -> Either String Int
const secondTest = ({ target, tolerance }) => n =>
  branch(target)
    .bimap(x => x - tolerance, x => x + tolerance)
    .merge(isTolerant)
    .call(null, n)
    .cata({
      LT: () => Left('Too Low'),
      EQ: () => Right(n),
      GT: () => Left('Too High'),
    })

// thirdTest : Env -> Int -> Either String String
const thirdTest = ({ target }) => n =>
  target === n ? Right('Win') : Right('Close Enough')

// runTests : Env -> Int -> Either String Int
const runTests = env => pipeK(firstTest, secondTest(env), thirdTest(env))

// gameLogic : Either String Int -> Reader (Either String String)
const gameLogic = either => Reader.ask().map(env => either.chain(runTests(env)))

// logic : Env -> Int -> Either String String)
const logic = env => pipe(Either.of, gameLogic, runWith(env))

// output : Either String String -> ()
const output = either(
  str => console.log(`Left: ${str}`),
  str => console.log(`Right: ${str}`)
)

// env : Env
const env = {
  target: 23,
  tolerance: 3,
}

const result = pipe(logic(env), output)
```

#### That's a lot, Let's wrap up

Damn, that's some fine logic, But no way to easily interact with it. That's quite a bit; seems like a good place to stop. The code is working, but it could be cleaner, and we definitely could be using the ADTs to their fuller potentials.

Next time we'll do a little refactor of the logic and get a command line interface, so we can actually play the damn thing. Stay tuned!

_Errors? Issues? Questions? Contact me via [Twitter](https://www.twitter.com/digitalsthtcs) or via [email](mailto:jason.polhemus@shatteredaesthetic.com)_
