---
path: "/what-the-adt-04"
title: "What the ADT 04 - Things are Starting to Get Random"
date: "2018-07-29T22:13:03.284Z"
---

## Part 4: We're Getting Tired of Guessing the same Number

Welcome back, it's been a while, I know. Lots of big changes for me personally, which reminds me: I'm now based out of Chicago, so if you know of anyone who's hiring, send me word. Much obliged.

Anyway, back to the tasks at hand. When last we left we had a command line game that we could keep guessing the number until we got it (or at least are close enough). But the number never changed. That makes for a fun guessing game -- once. We can - nay, we should - do better! We deserve a new number each time! We deserve that number to be random within our range! We deserve healthcare -- wait, sorry. Wrong platform (though by no means wrong).

So let's get to work. All the previous code is in this [repo](https://github.com/shatteredaesthetic/cipher-guess/tree/what-adt-03). I'm not going to print it all here today, because...well, it's simply getting to be too much now.

### Random as in Jellyfish

We're actually going to steal a lot of the code for generating random numbers from an [excellent tutorial](https://www.youtube.com/watch?v=TwFta_ES0pY) given by [evilsoft](https://github.com/evilsoft). If you are reading this: fine work, sir.

I'm going to post the code, then we'll go through it

_src/random.js_

```js
const { State, IO } = require('crocks')

// newSeed : () -> State Int Int
const newSeed = () =>
  State.get()
    .map(s => (1103515244 * s + 12345) & 0x7fffffff)
    .chain(State.put)

// calcValue : () => State Int Float
const calcValue = () => State.get().map(s => (s >>> 16) / 0x7fff)

// clamp : (Int, Int) -> Float -> Int
const clamp = (low, high) => n => Math.floor(n * (high - low)) + low

// type alias Low, High, Seed = Int
// randomRIO : (Low, High, Seed) -> IO Int
const randomRIO = (low, high, seed) => {
  const st = newSeed()
    .chain(calcValue)
    .map(clamp(low, high))

  return IO.of(st.evalWith(seed))
}

module.exports = {
  randomRIO,
}
```

I'm not going to explain those hard-coded numbers; I'm going to instead suggest you watch the aforementioned [tutorial video](https://www.youtube.com/watch?v=TwFta_ES0pY). I will, however, explain what's happening.

Our interface to this module is the `randomRIO` function. This takes three Ints -- the `low` and the `high` numbers that make up the playable range, and a seed for generating the number. First, we call a helper function `newSeed`. It takes no inputs, and outputs a `State Int Int`. This type is what we'll ultimately unwrap into our `IO`. Think of it as `State NewSeed RandomNumber`. For `newSeed`, we return a `State NewSeed IntFromOldSeed`.

Next, we chain into `calcValue`. This takes no inputs, and essentially returns `State NewSeed FloatFromOldSeed`. Finally, we map into `clamp` after feeding it the `low` and `high` parameters from `randomRIO`. that returns a function that takes our float (the `FloatFromOldSeed` from the last function) and fixes it into our range. We're left with `State NewSeed RandomNumber`, our goal!

In the return value, we run `evalWith` on our `State`, giving it the `seed` as the `OldSeed`. Using `evalWith` will return only the return value, the`randomNumber`. We wrap this in an`IO`. Boom! Pure random numbers.

### A space for randomness

Previously, we had an `Env` type, but it simply wrapped a _tolerance_ and _target_. Now, we need to bring the _range_ into `Env`, and use that to compute the _target_. Let's split all this logic into it's own module:

```js
const { State } = require('crocks')
const { tagged } = require('daggy')

// type alias low, high, tolerance = Int
// type Config = { low, high, tolerance }
const Config = tagged('Config', ['low', 'high', 'tolerance'])

// type alias target = Int
// type Env = { target, Config }
const Env = tagged('Env', ['target', 'config'])

// defaultCfg : Config
const defaultCfg = Config(1, 100, 3)

module.exports = {
  Env,
  defaultCfg,
}
```

> We previously had an `Env` type in our _src/utils.js_ file. That's being replaced. I'm not going to show it here, but you should delete the `Env` type from that file, if you're playing along at home.

Since we need some of the `Env` to create other parts of the `Env`, I opted to split the type into two, having one as a subtype. `Config` holds our _tolerance_ and our _range_, split out to it's _low_ and _high_ components, respectively. These values won't be changing during the game, and can be determined before the game starts. We create a default version of it (`defaultCfg`) to feed to `main`. `Env` simply wraps a `Config` together with a _target_.

### Now we're being illogical

...And our logic's broken. Damn. We were giving it an `Env` that was flat, and now we've added a layer. That's gonna screw up our logic functions. Also, we're no longer hard-coding the _range_ values, so we'll also need to get those where they're needed.

Let's start simple: the `secondTest`.

```js
// secondTest : Int -> ReaderT Env (Either Failure Int)
const secondTest = n =>
  ask()
    .map(({ target, config: { tolerance } }) =>
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
```

Really easing into it, aren't we? All we have to change is the topology of the parameter destructuring. We get the _config_ attribute, and grab the _tolerance_ off of it. Everything else works as before. Let's see `thirdTest`:

```js
// thirdTest : Int -> ReaderT Env (Either Failure Success)
const thirdTest = n =>
  ask()
    .map(({ target }) =>
      ifElse(
        x => target === x,
        pipe(Success.Equal, Right),
        pipe(Success.InTolerance, Right)
      )
    )
    .ap(M.of(n))
    .chain(liftFn(I))
```

That's right, nothing changes. The easiest change of all! Why did I even include it? Well...it's a pretty function, isn't it? No shaming!

Let's see `firstTest`, since it's the biggest change (though a familiarly-shaped one):

```js
// firstTest : Int -> ReaderT Env (Either Failure Int)
const firstTest = n =>
  ask()
    .map(({ config: { low, high } }) =>
      ifElse(
        n => !isNaN(n) && low <= n && n <= high,
        Right,
        pipe(Failure.InValid, Left)
      )
    )
    .ap(M.of(n))
    .chain(liftFn(I))
```

Not it looks like all the other functions. Uniformity for the win! We get the environment, then get the _config_ attribute off it, then grab the _low_ and _high_ attributes. We're not dealing with wrapping the values in a Pair, since they'll just be immediately unwrapped for use. We inject the original function into the `map`, then `ap` in our guess.

### Things are making sense again

Now let's fix our main module, _./index.js_. First, we'll get our imports updated:

```js
const { randomRIO } = require('./src/random')
const { Env, defaultCfg } = require('./src/config')

// main : Config -> IO ()
const main = cfg => {
  const { low, high } = cfg
  const target = randomRIO(low, high, Date.now()).run()
  const env = Env(target, cfg)

  return game(env)
}
```

Let's look at our updated `main` function. `main` has a `Config` as it's input, so we grab _low_ and _high_ off it, as a convenience to us. Readability and all. We feed those to `randomRIO`, plus a _seed_. We want something that's a large number that wouldn't repeat. `Date.now()` works perfectly for this. `randomRIO` returns an `IO Int`, so we unwrap it to get the `Int`. We combine this and the _cfg_ input into our `env : Env`. Then we return `game` with our `env` applied to it.

This is nice, but looks too imperative, doesn't it? Let's try to get back into our style:

```js
// main : Config -> IO ()
const main = cfg => {
  const { low, high } = cfg
  return randomRIO(low, high, Date.now())
    .map(target => Env(target, cfg))
    .chain(game)
}
```

That's more like it! We run `randomRIO`, then map across the returned IO, changing the random number into the `Env` we want. Then we chain `game`, starting the game.  Moving on, `game` holds our old logic. Let's see it:

```js
// game : Env => IO ()
const game = env =>
  getGuess(`Guess a number between 1 and 100`)
    .map(logic(env))
    .chain(
      either(
        fail => printLine(renderFailure(fail)).chain(() => game(env)),
        success => printLine(renderSuccess(success)).chain(exit)
      )
    )
```

Why did we separate the logic like this? We'd like this function to recurse, but we'd also like our `env` to persist unchanged throughout the whole game. The easiest way I thought of to do it was to split the two. This is how we're now going to call `main`:

```js
main(defaultCfg).run()
```

`main` is given the `defaultCfg`, getting us back to where we were at the end of the last post, but now with randomness! We just have to `run` it.

### Conclusions

We shuffled some things around, had to make more changes than we previously have had to, but we're now inching toward an interesting game. But we can guess forever right now. We're guaranteed to win through sheer determination. We should change that. Next time we'll take a break from the javascript, and try our hand at rewriting this is a functional language: purescript! I'm excited for the opportunity to try this language out. Stay tuned!
