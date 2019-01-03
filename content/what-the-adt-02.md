---
path: "/what-the-adt-02"
title: "What the ADT 02 - A UI Worth Commanding"
date: "2018-05-12T18:26:34.736Z"
---

## Part 2 - Baby's First UI, plus Prettification

Ahoy-hoy! When we left off, we had a function, `logic` that, when given an environment and an integer, weighed the integer against a target in the environment. But...it's not very ergonomic, is it? A player would have to edit the code and refresh it in the terminal. That allows them to see the environment, and...well, that's not really a game, is it? More like reading comprehension.

We should create an interface for the player, something that would allow them to actually guess. We'll start with a command line interface. The player will be asked for a number, and we'll analyze their guess! Simple enough, but let's start with a quick rewrite of our code so far. All the code is [in this repo](https://github.com/shatteredaesthetic/cipher-guess), in the `what-adt-02` branch, if you'd like to follow along.

#### Perhaps a little refresher...

Let's get a recap of what we have:

```js
// index.js
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

result(21) // logs: 'Right: Close Enough'
```

It works, but we aren't really using the `Reader` to it's full potential. Right now we're unwrapping the `Reader` and passing the `env` to `runTests`, which distributes it further. We're making good use of the `Either` ... what if we could extend the functionality of the `Reader` into out `Either`s.

#### There must be a better way!

It turns out, we can! What we want, essentially, is a Reader that always holds an Either. `crocks` has our back, providing a handy `ReaderT` ADT. This is a `Reader Transformer`, which means that, once provided with a monad, spits out that monad, with an additional Reader interface. For us, that translates into an `Either` that has it's own configuration to play with. Let's rewrite our test functions to use this, to get a better handle one what's happening. But first, some infrastructure:

```js
const { ReaderT } = require('crocks')
const ifElse = require('crocks/logic/ifElse')
const K = require('crocks/combinators/constant')
const I = require('crocks/combinators/identity')

const M = ReaderT(Either)
const { ask, liftFn } = M

// fail : String -> () -> Either String ()
const fail = pipe(Left, K)

// pass : String -> () -> Either () String
const pass = pipe(Right, K)
```

We'll import some new functions from `crocks`, grabbing the `ReaderT`, as well as a cool helper function `ifElse` that wraps ternary expressions, and two combinators, `constant` and `identity` (renamed as `K` and `I`, respectively).

Next, we create our transformer `M`, giving the `Either` object to the `ReaderT` constructor. For convenience, we then pull the `liftFn` and `ask` functions off of `M`. The last two functions just allow us to have more readability in our tests. Speaking of, let's look at our first one:

```js
// firstTest : Int -> ReaderT Env (Either String Int)
const firstTest = liftFn(
  ifElse(
    n => !isNaN(n) && 1 <= n && n <= 100,
    Right,
    fail('You need to learn to follow instructions')
  )
)
```

Let's look at the first test. It looks very similar to the previous one. We changed the ternary expression in the first version to use `ifElse`. It takes a predicate function, followed by a function to call for a true and a false outcome of the predicate. The input to the predicate is passed to the result functions. The 'true' branch has a `Right`, to wrap a true to pass on. The 'false' branch calls fail with a message fed in. If you got here, you go no farther.

So far, so good: we've replicated the previous behavior. To get this to `chain` on our `M`, though, we'll need to to return a `ReaderT Env (Either String Int)`. To do this, we only need to wrap our current function in a liftFn. First test - check. Let's move on:

```js
// isTolerant : (Int, Int) -> Int -> Eq
const isTolerant = (low, high) => ifElse(
  n < low,
  K(Ord.LT),
  ifElse(n > high, K(Ord.GT), K(Ord.EQ)
)

// secondTest : Int -> ReaderT Env (Either String Int)
const secondTest = n =>
  ask()
    .map(({ tolerance, target }) =>
      branch(target)
        .bimap(x => x - tolerance, x => x + tolerance)
        .merge(isTolerant)
    )
    .ap(M.of(n))
    .chain(
      liftFn(o =>
        o.cata({
          LT: fail('Too Low'),
          EQ: K(Right(n)),
          GT: fail('Too High')
        })
      )
    )
```

`isTolerant` consisted of one ternary expression nested in another ternary expression - pretty easy to rewrite with our handy `ifElse`/`K` combination.

The second test, however, changes much more dramatically. We start by asking for the environment up front, then mapping over it, using our cool `Pair` logic to get our tolerance range, and feeding it to `isTolerant`, which leaves us with a `ReaderT Env (Either String (Int -> Either String Int)`. For the folks at home staring at that in shock and horror (as I have, and do), that's our `ReaderT Either` holding a function. We have that int as our parameter, of ... let's apply the int by `ap`ing the int wrapped in an `M.of`. This will gove us a `ReaderT Env Ord`. We `chain` over that, calling the `cata` function on the `Ord` to get our `ReaderT Env (Either String Int)`. Whew!

That was wordy, but I hope it made sense. We retain all the pieces from the last implementation, we just move them around a bit to fit our new structure. Great! One more test:

```js
// thirdTest : Int -> ReaderT Env (Either String String)
const thirdTest = n =>
  ask()
    .map(({ target }) =>
      ifElse(n => target === n, pass('Win'), pass('Close Enough'))
    )
    .ap(M.of(n))
    .chain(liftFn(I))
```

The third test is like a combination of the last two. We replace the ternary with the `ifElse` helper, Wrapping our `Right`s in `K` again to discard the input. We call that on the result of `ask`ing for the environment, then `map`ping over it. We again `ap` over the wrapped function to apply the int. To unwrap a layer, we need to `chain` the `identity` combinator (here as `I`), again wrapping it in `liftFn`.

Cool, let's put these together!

```js
// logic :: Int -> ReaderT Env (Either String String)
const logic = pipeK(M.of, firstTest, secondTest, thirdTest)
```

`M.of` just puts a value into our monad stack, allowing us to `chain` it. Remember, from the last two tests? We use `pipeK` to put these together, like before. Let's test it out:

```js
// output :: Either a b -> ()
const output = either(str => log(`[Left] ${str}`), str => log(`[Right] ${str}`))

// _result :: Env -> Int -> ()
const _result = pipe(logic, runWith(env), output)

// type Env
const env = {
  target: 23,
  tolerance: 3,
}

// result :: Int -> ()
const result = _result(env)

result(2) // 'Too Low'
result(22) // 'Close Enough'
result('a') // 'You need to learn to follow instructions'
```

It works! But working with it is still pretty clunky ... let's fix that!

---

#### Looking Good, How 'bout some IO, though?

The logic is looking good, now let's get us some interactivity! And, since we're being monadic, and talking about input and output, you know what time it is: IO-O-O-O-O! the `IO` monad takes a function that side-effects, returning the function wrapped in an IO. The function is only run by calling `run` on the IO, starting the chain of events.

Our first interface will be a command-line one, so I'll need to import some helper libraries:

```js
const log = require('./lib/log')
const { IO } = require('crocks')
const rls = require('readline-sync')
```

We're still within **evil-playground**, so we import `log` from `./lib/log`. We grab the IO monad from `crocks`, and we import `readline-sync`, which gives us synchronous readline capabilities.

```js
// printLine : String -> IO ()
const printLine = str => IO.of(log(str))

// readLine = () -> IO String
const readLine = () => IO.of(rls.prompt())
```

Here I define my _input_ function, `readLine`, and my _output_ function, `printLine`. `printLine` takes a string and returns an IO that wraps the action of printing that string to the console. `readLine` uses `prompt` from `readline-sync`, which prints out a prompt (I'm using the default `'> '`) and waits for user input. Once the user hits enter, the input is returned as a String.

Now, let's use these to prompt the user for a guess:

```js
// getGuess : String -> IO Int
const getGuess = str =>
  printLine(str)
    .chain(readLine)
    .map(s => parseInt(s, 10))
```

This function, when called, returns an IO that prints a message to the console, then waits for user input. It takes that input, which is a String, and converts it to an Integer (-ish. Javascript, right?) inside an IO. All this happens sequentially once `.run()` is called on the `IO` result.

#### Uh, we're getting a little crowded...

And now, some housekeeping. Let's clean up our files a bit:

**src/utils.js**

```js
const { Either, pipe } = require('crocks')
const K = require('crocks/combinators/constant')
const { tagged } = require('daggy')
const { Left, Right } = Either

// type Env
const Env = tagged('Env', ['target', 'tolerance'])

// fail :: String -> () -> Either String ()
const fail = pipe(Left, K)

// pass :: String -> () -> Either () String
const pass = pipe(Right, K)

module.exports = {
  Env,
  fail,
  pass,
}
```

**src/logic.js**

```js
const { Either, ReaderT, pipe, pipeK } = require('crocks')
const branch = require('crocks/Pair/branch')
const K = require('crocks/combinators/constant')
const I = require('crocks/combinators/identity')
const ifElse = require('crocks/logic/ifElse')
const { taggedSum } = require('daggy')
const { fail, pass } = require('./utils')

const M = ReaderT(Either)
const { ask, liftFn } = M
const { Right, Left } = Either

// type Ord = LT | EQ | GT
const Ord = taggedSum('Ord', {
  LT: [],
  EQ: [],
  GT: [],
})

// isTolerant : (Int, Int) -> Int -> Eq
const isTolerant = (low, high) =>
  ifElse(n => n < low, K(Ord.LT), ifElse(n => n > high, K(Ord.GT), K(Ord.EQ)))

// firstTest : Int -> ReaderT Env (Either String Int)
const firstTest = liftFn(
  ifElse(
    n => !isNaN(n) && 1 <= n && n <= 100,
    Right,
    fail('You need to learn to follow instructions')
  )
)

// secondTest : Int -> ReaderT Env (Either String Int)
const secondTest = n =>
  ask()
    .map(({ tolerance, target }) =>
      branch(target)
        .bimap(x => x - tolerance, x => x + tolerance)
        .merge(isTolerant)
    )
    .ap(M.of(n))
    .chain(
      liftFn(o =>
        o.cata({
          LT: fail('Too Low'),
          EQ: K(Right(n)),
          GT: fail('Too High'),
        })
      )
    )

// thirdTest : Int -> ReaderT Env (Either String String)
const thirdTest = n =>
  ask()
    .map(({ target }) =>
      ifElse(n => target === n, pass('Win'), pass('Close Enough'))
    )
    .ap(M.of(n))
    .chain(liftFn(I))

// runTests :: Int -> ReaderT Env (Either String String)
const runTests = pipeK(M.of, firstTest, secondTest, thirdTest)

module.exports = {
  runTests,
}
```

**src/cli.js**

```js
const log = require('../lib/log')
const { IO } = require('crocks')
const rls = require('readline-sync')

// printLine : String -> IO ()
const printLine = str => IO.of(log(str))

// readLine = () -> IO String
const readLine = () => IO.of(rls.prompt())

// getGuess : String -> IO Int
const getGuess = str =>
  printLine(str)
    .chain(readLine)
    .map(s => parseInt(s, 10))

module.exports = {
  getGuess,
  printLine,
}
```

**index.js**

```js
const pipe = require('crocks/helpers/pipe')
const either = require('crocks/pointfree/either')
const runWith = require('crocks/pointfree/runWith')
const { runTests } = require('./src/logic')
const { printLine, getGuess } = require('./src/cli')
const { Env } = require('./src/utils')

// output : Either String String -> IO ()
const output = either(printLine, printLine)

// logic : Env -> Int -> Either String String
const logic = env => pipe(runTests, runWith(env))

// main : Env -> IO ()
const main = env =>
  getGuess(`Guess a number between 1 and 100`)
    .map(logic(env))
    .chain(output)

main(Env(23, 3)).run()
```

We rewrite `output` to just print the message either way. `main` is our whole game! We print out instructions, wait for user input, then run that input through the logic, providing it an environment, then send it through the `output` so we can see the result of our guess. _et viola!_

#### That's about as much as I can take

Now we have a guessing game where the user can guess once. Pretty neat, but that isn't much. Also, it just runs without ever terminating, but we can't keep guessing if we get it wrong. We'll fix that next time. Stay tuned...
