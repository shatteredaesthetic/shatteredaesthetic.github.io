---
path: "/what-the-adt-00"
title: "What the ADT 00 - Introductions All Around"
date: "2018-05-02T22:12:03.284Z"
---

## Part 0, in which we justify ourselves...

In the beginning, there was... you know what? No. No, I'm going to avoid all the easy 'hello world' references and creation-mythologizing. This is just a programming blog, after all. You're welcome.

Let's not sell ourselves short, though. Learning functional programming can seem world-altering when you start to really get it. Shopping becomes a monoid, paying becomes a fold, recipes can be monadic, etc. The change in thinking is profound. (Full disclosure: I hope my metaphors are correct. Wouldn't that be embarrassing? Twitter will let me know my folly...)

#### Okay, so...who are you?

But this is a strange way to introduce a blog: let's start over. My name is Jason, and I'm a sound engineer, an electrical engineer who manufactures 3D printers, and a programmer who writes functional code. At least, I try to when I can, even in JavascriptLand.

Those first two may not seem related, but, the more functional code I write, the more it starts to resemble signal flow through a sound system, or electrical signal through a circuit. You take input from a microphone and send it to a speaker, passing it through subcircuits along the way. This seems very close to a program, where we take user input, pass it through a pipeline of functions to transform it to a format we want, and printing it to the screen (or saving it to file).

I think that's what oriented me toward functional programming when I first started to learn. Javascript was a very different beast than it is today, and the learning materials of the time were overwhelmingly oriented towards objects. I was implored from all sides to learn the design patterns, and learn them well. The paradigm was hard to wrap my head around. It was around this time I picked up a newish language called Clojure, and I spent several months learning the basics through a modern lisp. Functional programming got me!

But I always came back to Javascript, trying to port back anything I learned from my excursions. And there were many: Elm, Elixir, Faust, Haskell, Racket, tcl, Pharo, etc. The idea of a pipeline of pure functions was nice, but I again had a hard time with the types.

You've read the cool blog posts and seen the relevant conference talks, but perhaps, like me, you were still left trying to wrap your head around all this type stuff, because it really seems worth it. Can I bring pure functional programming concepts into Javascript, though? It is a very versatile language, after all. Yes, it turns out, I can! And you can, too! And I'm here to show you how! Or, at least, learn along side you.

We can get to your banking info later.

#### So, what is this?

Of course, I'll be learning as I go, too, so we'll want something that starts easy. Something we can build out later, with more and more features. Something easy to understand the mechanics of. Oh, and something fun, while we're at it. How about a game? A guessing game. And, since we're doing pure functional work, let's guess numbers.

My vision for this series is an attempt to create and extend a simple game, completely in the open. It'll be interactive, and I will iteratively add new features as we go. I'll start with a command line interface, then make a web interface, and, possibly, even a stand-alone app. Along the way we'll refactor, and even rewrite whole sections in other languages, to get a feel for the differences.

So join me for the journey, and welcome!
