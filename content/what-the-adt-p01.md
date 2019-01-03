---
path: "/what-the-adt-p01"
title: "What the ADT Purescript 01 - Trying our Hand at a Real FP"
date: "2018-10-06T21:34:13.432Z"
---

## Purescript, Part 1: Up to speed

Here we are, again. I know, I know: it's been awhile - exactly what I didn't what to have happen. The plan was posts to have much more frequently, but, you know - life.

Anyway, I thought we'd get back into the swing of things by getting completely out of our swing - and getting out of our programming language. We've been jumping through some hoops to make our style work in javascript; perhaps it's time we tried our hand at a real programming language: something with a type system, with currying by default, with recursion. My choice is Purescript.

___

Enough talk, let's begin. All purescript projects begin with declaring our module and importing some libraries (most importantly, the `Prelude`). Because our file is called `Main.purs`, our module is also called `Main`. Let's see it:

>Note: the purescript code samples are labeled as *haskell* so I can get come syntax highlighting. It makes it much easier to read the code, and they're close enough to make it work.

*./src/Main.purs*

```haskell
module Main where

import Prelude
```


Let's start by defining some types. We're thinking forward to future functionality, so we're going to abandon our `ReaderT` for something a little more beefy: an `RWS` monad. This is basically a `Reader`, a `Writer`, and a `State` monad, all rolled up into one big ball of useful functionality.

*./src/Main.purs*

```haskell
newtype GameEnvironment = GameEnvironment
  { low :: Int, high :: Int, tolerance :: Int }
  
gameEnvironment :: Int -> Int -> Int -> GameEnvironment
gameEnvironment l h tol =
  GameEnvironment { low: l, high: h, tolerance: tol }
  
data GameState = GameState Int

type Log = Array String

type Game = RWS GameEnvironment Log GameState

```

We feed our `RWS` with and `env` for the `Reader`, a monoid for the `Writer`, and a type holding the state for the `State`. Our env is a newtype that holds a record containing the same three things that the `Config`<sup>*</sup> held in the javascript version: our `high` and `low` bounds, and the tolerance for our answer. Then we define a constructor function for our `GameEnvironment` type.

GameState is a sum type with one constructor, and the monoid we'll be using will be an `Array` or `Strings`.  With these we define our `Game` type as an `RWS` monad with the aforementioned type populating it. So far, so good. Now what?

I guess we can start with a function that will play the game. Let's call it `game`!

```haskell
game :: Int -> Game (Maybe Int)
game guess = do
```

I'll stop here so I can explain this a bit. Our function will take an Int which is the guess from the player. It will return a `Game (Maybe Int)`, our monad that's been parameterized with a `Maybe Int`. I chose a `Maybe` so I could indicate when the guess was no good with a `Nothing`, (we don't return the error messages like before<sup>*</sup>...you'll see), and return the target with the winning guess. Who knows, maybe we'll do something cool with it in the future.

The `do` is for Purescript's do-notation. Since monads allow us to define sequential computations, as can use do-notation as a syntactic sugar around all the `bind`ing we'd otherwise do (same as our `chain` function in javascriptland). I'll leave [this]() as a far better explanation than I have time to give here.

We need some more imports to make this work, so let's get them:

```haskell
import Data.Array as A
import Control.Monad.RWS (RWS)
import Control.Monad.Reader.Class (ask)
import Control.Monad.State.Class (get)
import Control.Monad.Writer.Class (tell)
import Data.Maybe (Maybe(..))
```

What have we got here? We need to grab `get` from `State`, `ask` from `Reader`, and `tell` from `Writer`, from their respective homes. We also get `Maybe` from it's home, making sure to add the `(..)` so we have acess to the constructors. We qualify our `Array` import, placing them under the namespace of `A`.

Okay, let's continue:

```haskell
game guess = do
  GameEnvironment env <- ask
  GameState target <- get
  logic guess env target

```

Is...is that it? This will be a common reaction to porting this over. We had to provide a lot of infrastructure to do this in javascript, but purescript gives it to us for nothing!

So, what's going on here? We're `ask`ing the `Reader` part of `Game` to get the environment, unwarpping the newtype. We do similar for the `target`, in the `State` part of `Game`, using `get` to obtain it, and unwrapping it. We feed these and our guess into `logic`, and that's where all the action is. Let's check it out:

```haskell
logic :: Int -> { low :: Int, high :: Int, tolerance :: Int } -> Int -> Game (Maybe Int)
logic g { low: l, high: h, tolerance: tol } t
  | g < l = do
    tell $ A.singleton "Too low for bounds."
    pure Nothing
  | g > h = do
    tell $ A.singleton "That's too high."
    pure Nothing
  | t == g = do
    tell $ A.singleton "That's it, Exactly!"
    pure $ Just t
  | g < t - tol = do
    tell $ A.singleton "That's too low"
    pure Nothing
  | g > t + tol = do
    tell $ A.singleton "Too high, try again"
    pure Nothing
  | otherwise = do
    tell $ A.singleton $ "Close Enough! The number was " <> show t
    pure $ Just t
    
```

I know, right? Our three functions from before can be completely contained *within the guards of the function!* For each guard, we give the requisite message to the `Writer` part of `Game`'s monoid, and return a `Maybe Int`, containing either a `Nothing` in the case of a bad input or bad guess, or a `Just` containing the `target` in the case of a good guess.

Great, I guess it's time we started to worry about getting input, and returning output to the console. Let's start with something no purescript project is complete without: a `main` function.

```haskell
main :: Effect Unit
main = void do
  let env = gameEnvironment 1 100 3
  rnd <- randomInt 1 100
  runGame env $ GameState rnd
```

We'll need to add an import for this to make sense:

```haskell
import Effect (Effect)
```

We use `void` because we don't care about the result of the computation: we're just replacing it with a `Unit` anyway. This is because we're side-effecting here - well, not here exactly. We've put it off to another function, `runGame`. We feed it a `GameEnvironment` and a `GameState` that we create.

We're in the home-stretch now...let's check out `runGame`, but first...you got it, imports:

```haskell
import Control.Monad.RWS (evalRWS)
import Data.Foldable (for_)
import Data.Tuple (Tuple(..))
import Effect.Console (log)
import Effect.Random (randomInt)
import Game (game)
import Node.ReadLine as RL

runGame :: GameEnvironment -> GameState -> Effect Unit
runGame env state = do
  interface <- RL.createConsoleInterface RL.noCompletion
  RL.setPrompt "> " 2 interface

  let
    lineHandler :: String -> Effect Unit
    lineHandler input =
      case parseInt input $ toRadix 10 of
        Just guess -> do
          let Tuple result written = evalRWS (game guess) env state
          for_ written log
          case result of
            Just _ -> do
              RL.close interface
            Nothing -> do
              log "Guess again:"
              RL.close interface
              runGame env state
        Nothing -> do
          log "Try again, but with a whole number this time."
          RL.close interface
          runGame env state

  RL.setLineHandler interface lineHandler
  log "Guess a whole number between 1 and 100:"
  RL.prompt interface

  pure unit
```

This is the motherlode. The important import here is `Node.ReadLine`, a purescript wrapper around the `readline` module from node, which...might be familiar to you. The first thing we have to do is create for ourselves an interface, and set our prompt to "> ". Then we define a handler for each line of input, set that handler as our LineHandler, log an instruction, and prompt the player for input.

Most of the input and output happens in this function. We first parse the input into an `Int`, which actually returns in a `Maybe`, allowing us to chastise the player for giving us bad input, if they do. That's in the `Nothing` branch, where we chastise them, close the interface, and recall the `runGame` function with the same inputs.

If we did get a valid `Int`, we pass that `guess` into the `game` function, feeding that as the first paramter to `evalRWS`. We're using `evalRWS` here instead of `runRWS` because I don't care about getting the state returned. What I do care about (and you should, too) is the monoid with all our messages, and the `result`. First, we iterate through the log, printing each out to the Console. Then we match on the `result`: if we get a `Just`, we discard (for now) the integer and just close the interface. If we get a `Nothing`, we log a message to the player, close the interface, and call the `runGame` function again with the same inputs.

We're in the homestretch: there's one function we haven't touched yet, but...it's going to need some love. You see, we need to get input from the outside world, and that's a dangerous, scary place full of untyped things. Luckily, we can leverage javascript to make things happen for us.

>Quick side note: I stole this from `purescript-parseint`. Integrating that library kept breaking my project, and I didn't know why, so I figured I'd just copy it (and change it slightly). Thanks go out to [Athan Clark](https://github.com/athanclark) for the original!

Let's see the purescript first: 

*./src/Data/Int/Parse.purs*

```haskell
module Data.Int.Parse (parseInt) where

import Prelude
import Data.Maybe (Maybe (..))
import Data.Int (round)
import Data.Function.Uncurried (Fn2, runFn2)
import Global (isNaN)

foreign import unsafeParseInt :: Fn2 String Int Number

-- | Warning - this function follows the same semantics as native JS's `parseInt()` function -
-- | it will parse "as much as it can", when it can - sometimes it succeeds when the input isn't
-- | completely sanitary.
parseInt :: String -> Int -> Maybe Int
parseInt s i =
  let
    x = runFn2 unsafeParseInt s $ clamp 2 36 i
  in
    if isNaN x
      then Nothing
      else Just (round x)

```

After our module declaration and imports, we define a `foreign import`. This is the function we are FFIing into in javascript. We'll define this in a moment. Let's take a lok at that Type:

```haskell
foreign import unsafeParseInt :: Fn2 String Int Number
```

This is a type that holds the input and output types for a two-input function. `unsafeParseInt` will take a `String`, defining the string we want to parse, and an `Int`, defining the radix, or base, that we're parsing the string to. Now, the meat: `parseInt` takes the `String` we're parsing, and an `Int` for the radix as well. We clamp the radix `i` to be between 2 and 36 (the range of acceptable radixes), and feed that and the string to `unsafeParseInt`, returning the `Fn2` that we execute by feeding it to `runFn2`. We check that the result was a number, returning the number in a `Just` if so, and a `Nothing` if not.

Seems simple enough, if a little circular. Let's check our the javascript:

```js
exports.unsafeParseInt = function unsafeParseInt(input, base) {
  return parseInt(input, base);
}
```

So...we just call `parseInt`. That's it. FFI is pretty awesome in purescript, compared to the backflips you need to do to achieve the same result in elm (which we may see sometime...). We add this import to `Main/purs`

```haskell
import Data.Int.Parse (parseInt)
```

...And we're done. Boom. It's as simple as that.

Of course, after writing `parseInt`, I found `fromStringAs` paired with `decimal` from the `purescript-integers` package, as well as `read` from `purescript-read`. I'm going to use `fromStringAs` instead of my function. So, let's see the whole shebang, so we can marvel at the beautiful, smaller codebase:

*./src/Main.purs*

```haskell
module Main where

import Prelude
import Control.Monad.RWS (RWS, evalRWS)
import Control.Monad.Reader.Class (ask)
import Control.Monad.State.Class (get)
import Control.Monad.Writer.Class (tell)
import Data.Array as A
import Data.Foldable (for_)
import Data.Int (fromStringAs, hexadecimal)
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Console (log)
import Effect.Random (randomInt)
import Game (game)
import Node.ReadLine as RL

newtype GameEnvironment = GameEnvironment
  { low :: Int, high :: Int, tolerance :: Int }
  
gameEnvironment :: Int -> Int -> Int -> GameEnvironment
gameEnvironment l h tol =
  GameEnvironment { low: l, high: h, tolerance: tol }
  
data GameState = GameState Int

type Log = Array String

type Game = RWS GameEnvironment Log GameState

game :: Int -> Game (Maybe Int)
game guess = do
  GameEnvironment env <- ask
  GameState target <- get
  logic guess env target
  
logic :: Int -> { low :: Int, high :: Int, tolerance :: Int } -> Int -> Game (Maybe Int)
logic g { low: l, high: h, tolerance: tol } t
  | g < l = do
    tell $ A.singleton "Too low for bounds."
    pure Nothing
  | g > h = do
    tell $ A.singleton "That's too high."
    pure Nothing
  | t == g = do
    tell $ A.singleton "That's it, Exactly!"
    pure $ Just t
  | g < t - tol = do
    tell $ A.singleton "That's too low"
    pure Nothing
  | g > t + tol = do
    tell $ A.singleton "Too high, try again"
    pure Nothing
  | otherwise = do
    tell $ A.singleton $ "Close Enough! The number was " <> show t
    pure $ Just t
    
runGame :: GameEnvironment -> GameState -> Effect Unit
runGame env state = do
  interface <- RL.createConsoleInterface RL.noCompletion
  RL.setPrompt "> " 2 interface

  let
    lineHandler :: String -> Effect Unit
    lineHandler input =
      case fromStringAs decimal input of
        Just guess -> do
          let Tuple result written = evalRWS (game guess) env state
          for_ written log
          case result of
            Just _ -> do
              RL.close interface
            Nothing -> do
              log "Guess again:"
              RL.close interface
              runGame env state
        Nothing -> do
          log "Try again, but with a whole number this time."
          RL.close interface
          runGame env state

  RL.setLineHandler interface lineHandler
  log "Guess a whole number between 1 and 100:"
  RL.prompt interface

  pure unit
    
main :: Effect Unit
main = void do
  let env = gameEnvironment 1 100 3
  rnd <- randomInt 1 100
  runGame env $ GameState rnd
```

Style is subjective, of course, but i must say: I think this looks much nicer and cleaner than the javascript. That's right, I'm claiming ML over Algol. Fight me!

And that's a good place to stop, for now. Next time we're going to stick with our new purescript codebase, and inplement a limit to the guesses. This is fun and all, but, with infinite guesses, players will always eventually win. That's no fun! Let's get this game to be more fun!

___
___

<sup>* from the [javascript version](https://github.com/shatteredaesthetic/cipher-guess/tree/what-adt-04)</sup>
