---
path: "/what-the-adt-03"
title: What the ADT 03 - More Than Just a Single-Use
date: "2018-06-01T13:36:34.736Z"
---

## Part 3 - Gotta Love a Second Chance

We're back, and we have a number-guessing game that lets you guess once. That's...not much fun. So, what we'll do today is extend the game to allow more than one guess; however, if the guess is correct - or within the tolerance - the player wins and the game exits.

Now that our game is getting more involved, it's time to look at the results of our logic. So far, we've just returned strings. That isn't very extendable, so let's use something else. What do we get? It's either a failure or succeeds being within tolerance.

Given this, let's make two new union types to cover our `Failure` and `Success` cases:

new **utils.js**

```js
// type Failure = InValid | TooHigh | TooLow
const Failure = taggedSum('Failure', {
  InValid: ['x'],
  TooHigh: ['x'],
  TooLow: ['x'],
})

// type Success = InTolerance | Equal
const Success = taggedSum('Success', {
  InTolerance: ['x'],
  Equal: ['x'],
})

// renderFailure : Failure -> String
const renderFailure = fail =>
  fail.cata({
    InValid: x => `${x} is not an integer between 1 and 100. Try again.`,
    TooHigh: x => `${x} was too high. Try again.`,
    TooLow: x => `${x} was too low. Try again.`,
  })

// renderSuccess : Success -> String
const renderSuccess = success =>
  success.cata({
    InTolerance: x => `${x} is close enough. Good Job!`,
    Equal: x => `${x} is it, exactly! Winner!`,
  })
```

As you can see, I also added a couple of helper function for getting our final result string. Each result also now takes the number guessed, so we can use it in our string. Cool, now we just have to adjust the functions in our logic to use these new types:

new **logic.js** changes

```js
// isTolerant : (Int, Int) -> Int -> Eq
const isTolerant = (low, high) =>
  ifElse(n => n < low, K(Ord.LT), ifElse(n => n > high, K(Ord.GT), K(Ord.EQ)))

// firstTest : Int -> ReaderT Env (Either Failure Int)
const firstTest = liftFn(
  ifElse(
    n => !isNaN(n) && 1 <= n && n <= 100,
    Right,
    pipe(Failure.InValid, Left)
  )
)

// secondTest : Int -> ReaderT Env (Either Failure Int)
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
          LT: K(Left(Failure.TooLow(n))),
          EQ: K(Right(n)),
          GT: K(Left(Failure.TooHigh(n))),
        })
      )
    )

// thirdTest : Int -> ReaderT Env (Either Failure Success)
const thirdTest = n =>
  ask()
    .map(({ target }) =>
      ifElse(
        n => target === n,
        pipe(Success.Equal, Right),
        pipe(Success.InTolerance, Right)
      )
    )
    .ap(M.of(n))
    .chain(liftFn(I))
```

The first change is, appropriately, in `firstTest`. Previously, the 'else' branch was `fail('You need to learn to follow instructions')`, `fail` being `pipe(Left, K)`: The string get put into the `Left`, and is passed to the `K`. Now, we're not going to ignore the element, but put it into our new type's constructor, `Failure.InValid`, then put it in a `Left`. Easy!

`secondTest` is an easy change, too. We replace both calls to `fail` with the guess placed in the appropriate constructor of `Failure`, passed into a `Left`, then passed into `K`. Boom!

I bet you can guess what we're changing in `thirdTest`. That's right: we're replacing the calls to `pass`. Each one will take the guess, pass it into the appropriate constructor of `Success`, then put it in a `Right`. It's just that easy!

Of course, now we get a `Success` or a `Failure` at the end, and we need to convert that...and we have those functions! Let's change up our `index.js`:

new **index.js**

```js
// output : Either String String -> IO ()
const output = either(
  fail => printLine(renderFailure(fail)),
  success => printLine(renderSuccess(success))
)
```

The only change we need is in `output`. We pass our result into it's specific render function, then pass that to `printLine`. Now we're back to where we were.

### Great, but I'd like more guesses

And you shall have it. This one is super complex, and here it is:

new **index.js** (with repeats)

```js
// main : Env -> IO ()
const main = env =>
  getGuess(`Guess a number between 1 and 100`)
    .map(logic(env))
    .chain(
      either(
        fail => printLine(renderFailure(fail)).chain(() => main(env)),
        success => printLine(renderSuccess(success)).chain(exit)
      )
    )
```

Wait, that's it? Indeed it is. We inlined our `output` function, so we can get the `env` argument needed to recurse. If the guess is bad, the message is printed, and we start anew. If the guess is good, we print the message and exit. By the way, here's the code for `exit` in `cli.js`.

new **cli.js**

```js
// exit : () -> IO ()
const exit = () =>
  IO(() => {
    process.exit()
  })
```

### Well, that was a let-down

Yeah, but isn't it cool how we were able to endlessly multiply our game with such little code? Recursion for the win! Take it for a spin!

Of course, the number is always 23, so...replay value is kind-of nil. So next time we'll add a little randomness. See you next time!
