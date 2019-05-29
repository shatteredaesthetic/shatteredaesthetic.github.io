---
path: '/what-the-adt-p02'
title: 'What the ADT Purescript 02 - Setting Limits'
date: '2019-05-28T20:17:13.432Z'
---

## Purescript, Part 2: We Need Limitations

Welcome back! It certainly has been awhile, but it's nice to know we've got the kind of relationship where we can just pick up where we left off. Well, we have that with the code, anyway.

When we left off, we had ported our game from javascript into purescript. There's still some problems, though: we can just keep guessing until we get it right. That won't do for a game: that gets boring really fast. We really should limit the number of our guesses, to make things interesting. Let's do that, then.

Code is up on [this repo](https://gitlab.com/shatteredaesthetic/cipher-guess-ps/tree/what-adt-p02).

#### Adjusting Our Types

The first thing we do is add another `Int` to be our number of guesses. Great, but...where do we put it? It makes sense to put it in the `GameState`, since it is only used within the logic, and will change with use, so let's add it there:

```haskell
data GameState = GameState Int Int
```

Which `Int` is which, now? It's hard to say...we should create some aliases for these Ints, so we can make our intentions clearer.


```haskell
type Target = Int

type Guesses = Int

data GameState = GameState Guesses Target
```

Much nicer. We made our aliases, and fixed our `GameState` type to use them. The type now self-documents, which is very nice. Let's continue.

#### Fixing Our Logic

Let's take a look at our existing `game` function:

```haskell
game :: Int -> Game (Maybe Int)
game guess = do
  GameEnvironment env <- ask
  GameState target <- get
  logic guess env target
```

We've changed the shape of our `GameState`, so we need to change this function. We need the `Guesses` bit in the `logic` function, so we don't really need to unwrap `GameState`. We'll change this to just get the state, then we'll pass that into our call to `logic`:

```haskell
game :: Int -> Game (Maybe Int)
game guess = do
  GameEnvironment cfg <- ask
  state <- get
  logic guess cfg state
```
Now the type signature of `logic` needs to be updated, to reflect that it's now given the whole `GameState`:

```haskell
logic :: Int
      -> { low :: Int, high :: Int, tolerance :: Int }
      -> GameState
      -> Game (Maybe Int)
```

We'll unwrap the `GameState` type at the outset, so we can check our number of guesses. We'll add a new first guard that checks to see if `guesses` is 0. If it is, we'll end the game with a message, telling the player what the `target` was. Right now we end the game if the player gets the guess right (within a tolerance) by returning the `target` in a `Just`, so let's do that here as well.

```haskell
logic g { low: l, high: h, tolerance: tol } (GameState guesses t)
  | guesses == 0 = do
    tell $ A.singleton $ "Game Over! You're out of guesses. The number was " <> show t
    pure $ Just t
```

Great, now we need to decrement our number of guesses each time we're given a bad one. We only need to change a piece of the `GameState`, so, in each guard that returns a `Nothing`, we'll add this:

```haskell
put $ GameState (guesses - 1) t
```

This puts a new state into the `GameState`, decrementing the guesses. That's actually all we have to do here, so let's see the function:

```haskell
logic :: Int
      -> { low :: Int, high :: Int, tolerance :: Int }
      -> GameState
      -> Game (Maybe Int)
logic g { low: l, high: h, tolerance: tol } (GameState guesses t)
  | guesses == 0 = do
    tell $ A.singleton $ "Game Over! You're out of guesses. The number was " <> show t
    pure $ Just t
  | g < l = do
    tell $ A.singleton "Too low for bounds."
    put $ GameState (guesses - 1) t
    pure Nothing
  | g > h = do
    tell $ A.singleton "Too high for bounds."
    put $ GameState (guesses - 1) t
    pure Nothing
  | t == g = do
    tell $ A.singleton "That's it, Exactly!"
    pure $ Just t
  | g < t - tol = do
    tell $ A.singleton "That's too low, try again."
    put $ GameState (guesses - 1) t
    pure Nothing
  | g > t + tol = do
    tell $ A.singleton "That's too high, try again."
    put $ GameState (guesses - 1) t
    pure Nothing
  | otherwise = do
    tell $ A.singleton $ "Close Enough! The number was " <> show t
    pure $ Just t
```

Our logic is good, but we're not quite finished.

#### One Final Thing

In our `main` function, we create our `GameState` with only the target, but now it also needs a number of `Guesses`. We should probably add that, to appease the compiler gods:

```haskell
main :: Effect Unit
main = void do
  let env = gameEnvironment 1 100 3
  rnd <- randomInt 1 100
  runGame env $ GameState 3 rnd
```

And we're done! Boom! All that's left is to play the game and revel in our smartness. We try one number...wrong. Another number...wrong. Another number...wrong, Another...wrong. Another...wrong. Wait a minute, something isn't working here.

#### A Big Problem

The way it's written _looks_ really good, and it compiles nicely, but...it doesn't work! Every wrong guess, we pass the initial `GameState` back in. The new state we `put` in within `logic` gets obliterated. We need to fix something within the `runGame` function to get the updated state.

### A Big Solution

The best solution I see requires only a few small changes. Let's look at `logic`: it returns a `Game (Maybe Int)`, returning the `target`, but we never do anything with that returned value; it gets ignored. What we do need from `logic`, though, is the updated state. what if we returned that instead? The solution, then, is to invert which branch of the `Maybe` each possibility returns: the correct answers now return the `Nothing`, and the wrong answers return a `Just GameState` with the updated state. We can then remove all calls to `put`, since we no longer need them. Now our function looks like this:

```haskell
logic :: Int
      -> { low :: Int, high :: Int, tolerance :: Int }
      -> GameState
      -> Game (Maybe GameState)
logic g { low: l, high: h, tolerance: tol } (GameState guesses t)
  | guesses == 0 = do
    tell $ A.singleton $ "Game Over! You're out of guesses. The number was " <> show t
    pure Nothing
  | g < l = do
    tell $ A.singleton "Too low for bounds."
    pure $ Just $ GameState (guesses - 1) t
  | g > h = do
    tell $ A.singleton "Too high for bounds."
    pure $ Just $ GameState (guesses - 1) t
  | t == g = do
    tell $ A.singleton "That's it, Exactly!"
    pure Nothing
  | g < t - tol = do
    tell $ A.singleton "That's too low, try again."
    pure $ Just $ GameState (guesses - 1) t
  | g > t + tol = do
    tell $ A.singleton "That's too high, try again."
    pure $ Just $ GameState (guesses - 1) t
  | otherwise = do
    tell $ A.singleton $ "Close Enough! The number was " <> show t
    pure Nothing
```

Great, now we need to change the type signature of `game` to

```haskell
game :: Int -> Game (Maybe GameState)
```

We also need to change the `lineHandler` function within `runGame` to flip the results and feed the new state to the recalling of `runGame`.

```haskell
lineHandler :: String -> Effect Unit
    lineHandler input =
      case fromStringAs decimal input of
        Just guess -> do
          let Tuple result written = evalRWS (game guess) env state
          for_ written log
          case result of
            Nothing -> do
              RL.close interface
            Just newSt -> do
              log "Guess again:"
              RL.close interface
              runGame env newSt
        Nothing -> do
          log "Try again, but with a whole number this time."
          RL.close interface
          runGame env state
```
Now it's working!

#### To Be Continued...

We've successfully limited our guesses. We can now be a Winner...or a Loser. The game functions nicely.

But it can be a bit hard to read the screen sometimes. Perhaps a little color can help the experience of playing. Next time we'll color the responses to aid the UX, and it'll come out much sooner than this one did.
