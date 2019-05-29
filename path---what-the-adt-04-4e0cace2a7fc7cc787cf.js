webpackJsonp([0xcfede5fe90d7],{659:function(n,a){n.exports={data:{site:{siteMetadata:{title:"(shatteredaesthetic)",author:"Jason Polhemus"}},markdownRemark:{id:"/Users/travis/build/shatteredaesthetic/shatteredaesthetic.github.io/content/what-the-adt-04.md absPath of file >>> MarkdownRemark",html:'<h2>Part 4: We’re Getting Tired of Guessing the same Number</h2>\n<p>Welcome back, it’s been a while, I know. Lots of big changes for me personally, which reminds me: I’m now based out of Chicago, so if you know of anyone who’s hiring, send me word. Much obliged.</p>\n<p>Anyway, back to the tasks at hand. When last we left we had a command line game that we could keep guessing the number until we got it (or at least are close enough). But the number never changed. That makes for a fun guessing game — once. We can - nay, we should - do better! We deserve a new number each time! We deserve that number to be random within our range! We deserve healthcare — wait, sorry. Wrong platform (though by no means wrong).</p>\n<p>So let’s get to work. All the previous code is in this <a href="https://github.com/shatteredaesthetic/cipher-guess/tree/what-adt-03">repo</a>. I’m not going to print it all here today, because…well, it’s simply getting to be too much now.</p>\n<h3>Random as in Jellyfish</h3>\n<p>We’re actually going to steal a lot of the code for generating random numbers from an <a href="https://www.youtube.com/watch?v=TwFta_ES0pY">excellent tutorial</a> given by <a href="https://github.com/evilsoft">evilsoft</a>. If you are reading this: fine work, sir.</p>\n<p>I’m going to post the code, then we’ll go through it</p>\n<p><em>src/random.js</em></p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> State<span class="token punctuation">,</span> IO <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'crocks\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">// newSeed : () -> State Int Int</span>\n<span class="token keyword">const</span> <span class="token function-variable function">newSeed</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span>\n  State<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>s <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token number">1103515244</span> <span class="token operator">*</span> s <span class="token operator">+</span> <span class="token number">12345</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0x7fffffff</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span>State<span class="token punctuation">.</span>put<span class="token punctuation">)</span>\n\n<span class="token comment">// calcValue : () => State Int Float</span>\n<span class="token keyword">const</span> <span class="token function-variable function">calcValue</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> State<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>s <span class="token operator">=></span> <span class="token punctuation">(</span>s <span class="token operator">>>></span> <span class="token number">16</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">0x7fff</span><span class="token punctuation">)</span>\n\n<span class="token comment">// clamp : (Int, Int) -> Float -> Int</span>\n<span class="token keyword">const</span> <span class="token function-variable function">clamp</span> <span class="token operator">=</span> <span class="token punctuation">(</span>low<span class="token punctuation">,</span> high<span class="token punctuation">)</span> <span class="token operator">=></span> n <span class="token operator">=></span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>n <span class="token operator">*</span> <span class="token punctuation">(</span>high <span class="token operator">-</span> low<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> low\n\n<span class="token comment">// type alias Low, High, Seed = Int</span>\n<span class="token comment">// randomRIO : (Low, High, Seed) -> IO Int</span>\n<span class="token keyword">const</span> <span class="token function-variable function">randomRIO</span> <span class="token operator">=</span> <span class="token punctuation">(</span>low<span class="token punctuation">,</span> high<span class="token punctuation">,</span> seed<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> st <span class="token operator">=</span> <span class="token function">newSeed</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span>calcValue<span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token function">clamp</span><span class="token punctuation">(</span>low<span class="token punctuation">,</span> high<span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">return</span> IO<span class="token punctuation">.</span><span class="token keyword">of</span><span class="token punctuation">(</span>st<span class="token punctuation">.</span><span class="token function">evalWith</span><span class="token punctuation">(</span>seed<span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  randomRIO<span class="token punctuation">,</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>I’m not going to explain those hard-coded numbers; I’m going to instead suggest you watch the aforementioned <a href="https://www.youtube.com/watch?v=TwFta_ES0pY">tutorial video</a>. I will, however, explain what’s happening.</p>\n<p>Our interface to this module is the <code class="language-text">randomRIO</code> function. This takes three Ints — the <code class="language-text">low</code> and the <code class="language-text">high</code> numbers that make up the playable range, and a seed for generating the number. First, we call a helper function <code class="language-text">newSeed</code>. It takes no inputs, and outputs a <code class="language-text">State Int Int</code>. This type is what we’ll ultimately unwrap into our <code class="language-text">IO</code>. Think of it as <code class="language-text">State NewSeed RandomNumber</code>. For <code class="language-text">newSeed</code>, we return a <code class="language-text">State NewSeed IntFromOldSeed</code>.</p>\n<p>Next, we chain into <code class="language-text">calcValue</code>. This takes no inputs, and essentially returns <code class="language-text">State NewSeed FloatFromOldSeed</code>. Finally, we map into <code class="language-text">clamp</code> after feeding it the <code class="language-text">low</code> and <code class="language-text">high</code> parameters from <code class="language-text">randomRIO</code>. that returns a function that takes our float (the <code class="language-text">FloatFromOldSeed</code> from the last function) and fixes it into our range. We’re left with <code class="language-text">State NewSeed RandomNumber</code>, our goal!</p>\n<p>In the return value, we run <code class="language-text">evalWith</code> on our <code class="language-text">State</code>, giving it the <code class="language-text">seed</code> as the <code class="language-text">OldSeed</code>. Using <code class="language-text">evalWith</code> will return only the return value, the<code class="language-text">randomNumber</code>. We wrap this in an<code class="language-text">IO</code>. Boom! Pure random numbers.</p>\n<h3>A space for randomness</h3>\n<p>Previously, we had an <code class="language-text">Env</code> type, but it simply wrapped a <em>tolerance</em> and <em>target</em>. Now, we need to bring the <em>range</em> into <code class="language-text">Env</code>, and use that to compute the <em>target</em>. Let’s split all this logic into it’s own module:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> State <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'crocks\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> tagged <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'daggy\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">// type alias low, high, tolerance = Int</span>\n<span class="token comment">// type Config = { low, high, tolerance }</span>\n<span class="token keyword">const</span> Config <span class="token operator">=</span> <span class="token function">tagged</span><span class="token punctuation">(</span><span class="token string">\'Config\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">\'low\'</span><span class="token punctuation">,</span> <span class="token string">\'high\'</span><span class="token punctuation">,</span> <span class="token string">\'tolerance\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token comment">// type alias target = Int</span>\n<span class="token comment">// type Env = { target, Config }</span>\n<span class="token keyword">const</span> Env <span class="token operator">=</span> <span class="token function">tagged</span><span class="token punctuation">(</span><span class="token string">\'Env\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">\'target\'</span><span class="token punctuation">,</span> <span class="token string">\'config\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token comment">// defaultCfg : Config</span>\n<span class="token keyword">const</span> defaultCfg <span class="token operator">=</span> <span class="token function">Config</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span>\n\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  Env<span class="token punctuation">,</span>\n  defaultCfg<span class="token punctuation">,</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<blockquote>\n<p>We previously had an <code class="language-text">Env</code> type in our <em>src/utils.js</em> file. That’s being replaced. I’m not going to show it here, but you should delete the <code class="language-text">Env</code> type from that file, if you’re playing along at home.</p>\n</blockquote>\n<p>Since we need some of the <code class="language-text">Env</code> to create other parts of the <code class="language-text">Env</code>, I opted to split the type into two, having one as a subtype. <code class="language-text">Config</code> holds our <em>tolerance</em> and our <em>range</em>, split out to it’s <em>low</em> and <em>high</em> components, respectively. These values won’t be changing during the game, and can be determined before the game starts. We create a default version of it (<code class="language-text">defaultCfg</code>) to feed to <code class="language-text">main</code>. <code class="language-text">Env</code> simply wraps a <code class="language-text">Config</code> together with a <em>target</em>.</p>\n<h3>Now we’re being illogical</h3>\n<p>…And our logic’s broken. Damn. We were giving it an <code class="language-text">Env</code> that was flat, and now we’ve added a layer. That’s gonna screw up our logic functions. Also, we’re no longer hard-coding the <em>range</em> values, so we’ll also need to get those where they’re needed.</p>\n<p>Let’s start simple: the <code class="language-text">secondTest</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">// secondTest : Int -> ReaderT Env (Either Failure Int)</span>\n<span class="token keyword">const</span> <span class="token function-variable function">secondTest</span> <span class="token operator">=</span> n <span class="token operator">=></span>\n  <span class="token function">ask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">{</span> target<span class="token punctuation">,</span> config<span class="token punctuation">:</span> <span class="token punctuation">{</span> tolerance <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span>\n      <span class="token function">branch</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>\n        <span class="token punctuation">.</span><span class="token function">bimap</span><span class="token punctuation">(</span>x <span class="token operator">=></span> x <span class="token operator">-</span> tolerance<span class="token punctuation">,</span> x <span class="token operator">=></span> x <span class="token operator">+</span> tolerance<span class="token punctuation">)</span>\n        <span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>isTolerant<span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">ap</span><span class="token punctuation">(</span>M<span class="token punctuation">.</span><span class="token keyword">of</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span>\n      <span class="token function">liftFn</span><span class="token punctuation">(</span>o <span class="token operator">=></span>\n        o<span class="token punctuation">.</span><span class="token function">cata</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n          LT<span class="token punctuation">:</span> <span class="token function">K</span><span class="token punctuation">(</span><span class="token function">Left</span><span class="token punctuation">(</span>Failure<span class="token punctuation">.</span><span class="token function">TooLow</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n          EQ<span class="token punctuation">:</span> <span class="token function">K</span><span class="token punctuation">(</span><span class="token function">Right</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n          GT<span class="token punctuation">:</span> <span class="token function">K</span><span class="token punctuation">(</span><span class="token function">Left</span><span class="token punctuation">(</span>Failure<span class="token punctuation">.</span><span class="token function">TooHigh</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span></code></pre>\n      </div>\n<p>Really easing into it, aren’t we? All we have to change is the topology of the parameter destructuring. We get the <em>config</em> attribute, and grab the <em>tolerance</em> off of it. Everything else works as before. Let’s see <code class="language-text">thirdTest</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">// thirdTest : Int -> ReaderT Env (Either Failure Success)</span>\n<span class="token keyword">const</span> <span class="token function-variable function">thirdTest</span> <span class="token operator">=</span> n <span class="token operator">=></span>\n  <span class="token function">ask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">{</span> target <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span>\n      <span class="token function">ifElse</span><span class="token punctuation">(</span>\n        x <span class="token operator">=></span> target <span class="token operator">===</span> x<span class="token punctuation">,</span>\n        <span class="token function">pipe</span><span class="token punctuation">(</span>Success<span class="token punctuation">.</span>Equal<span class="token punctuation">,</span> Right<span class="token punctuation">)</span><span class="token punctuation">,</span>\n        <span class="token function">pipe</span><span class="token punctuation">(</span>Success<span class="token punctuation">.</span>InTolerance<span class="token punctuation">,</span> Right<span class="token punctuation">)</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">ap</span><span class="token punctuation">(</span>M<span class="token punctuation">.</span><span class="token keyword">of</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span><span class="token function">liftFn</span><span class="token punctuation">(</span>I<span class="token punctuation">)</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p>That’s right, nothing changes. The easiest change of all! Why did I even include it? Well…it’s a pretty function, isn’t it? No shaming!</p>\n<p>Let’s see <code class="language-text">firstTest</code>, since it’s the biggest change (though a familiarly-shaped one):</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">// firstTest : Int -> ReaderT Env (Either Failure Int)</span>\n<span class="token keyword">const</span> <span class="token function-variable function">firstTest</span> <span class="token operator">=</span> n <span class="token operator">=></span>\n  <span class="token function">ask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">{</span> config<span class="token punctuation">:</span> <span class="token punctuation">{</span> low<span class="token punctuation">,</span> high <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span>\n      <span class="token function">ifElse</span><span class="token punctuation">(</span>\n        n <span class="token operator">=></span> <span class="token operator">!</span><span class="token function">isNaN</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> low <span class="token operator">&lt;=</span> n <span class="token operator">&amp;&amp;</span> n <span class="token operator">&lt;=</span> high<span class="token punctuation">,</span>\n        Right<span class="token punctuation">,</span>\n        <span class="token function">pipe</span><span class="token punctuation">(</span>Failure<span class="token punctuation">.</span>InValid<span class="token punctuation">,</span> Left<span class="token punctuation">)</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">ap</span><span class="token punctuation">(</span>M<span class="token punctuation">.</span><span class="token keyword">of</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span><span class="token function">liftFn</span><span class="token punctuation">(</span>I<span class="token punctuation">)</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p>Not it looks like all the other functions. Uniformity for the win! We get the environment, then get the <em>config</em> attribute off it, then grab the <em>low</em> and <em>high</em> attributes. We’re not dealing with wrapping the values in a Pair, since they’ll just be immediately unwrapped for use. We inject the original function into the <code class="language-text">map</code>, then <code class="language-text">ap</code> in our guess.</p>\n<h3>Things are making sense again</h3>\n<p>Now let’s fix our main module, <em>./index.js</em>. First, we’ll get our imports updated:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> randomRIO <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./src/random\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> Env<span class="token punctuation">,</span> defaultCfg <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./src/config\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">// main : Config -> IO ()</span>\n<span class="token keyword">const</span> <span class="token function-variable function">main</span> <span class="token operator">=</span> cfg <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> low<span class="token punctuation">,</span> high <span class="token punctuation">}</span> <span class="token operator">=</span> cfg\n  <span class="token keyword">const</span> target <span class="token operator">=</span> <span class="token function">randomRIO</span><span class="token punctuation">(</span>low<span class="token punctuation">,</span> high<span class="token punctuation">,</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> env <span class="token operator">=</span> <span class="token function">Env</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> cfg<span class="token punctuation">)</span>\n\n  <span class="token keyword">return</span> <span class="token function">game</span><span class="token punctuation">(</span>env<span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>Let’s look at our updated <code class="language-text">main</code> function. <code class="language-text">main</code> has a <code class="language-text">Config</code> as it’s input, so we grab <em>low</em> and <em>high</em> off it, as a convenience to us. Readability and all. We feed those to <code class="language-text">randomRIO</code>, plus a <em>seed</em>. We want something that’s a large number that wouldn’t repeat. <code class="language-text">Date.now()</code> works perfectly for this. <code class="language-text">randomRIO</code> returns an <code class="language-text">IO Int</code>, so we unwrap it to get the <code class="language-text">Int</code>. We combine this and the <em>cfg</em> input into our <code class="language-text">env : Env</code>. Then we return <code class="language-text">game</code> with our <code class="language-text">env</code> applied to it.</p>\n<p>This is nice, but looks too imperative, doesn’t it? Let’s try to get back into our style:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">// main : Config -> IO ()</span>\n<span class="token keyword">const</span> <span class="token function-variable function">main</span> <span class="token operator">=</span> cfg <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> low<span class="token punctuation">,</span> high <span class="token punctuation">}</span> <span class="token operator">=</span> cfg\n  <span class="token keyword">return</span> <span class="token function">randomRIO</span><span class="token punctuation">(</span>low<span class="token punctuation">,</span> high<span class="token punctuation">,</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>target <span class="token operator">=></span> <span class="token function">Env</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> cfg<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span>game<span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>That’s more like it! We run <code class="language-text">randomRIO</code>, then map across the returned IO, changing the random number into the <code class="language-text">Env</code> we want. Then we chain <code class="language-text">game</code>, starting the game.  Moving on, <code class="language-text">game</code> holds our old logic. Let’s see it:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">// game : Env => IO ()</span>\n<span class="token keyword">const</span> <span class="token function-variable function">game</span> <span class="token operator">=</span> env <span class="token operator">=></span>\n  <span class="token function">getGuess</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`Guess a number between 1 and 100`</span></span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token function">logic</span><span class="token punctuation">(</span>env<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span>\n      <span class="token function">either</span><span class="token punctuation">(</span>\n        fail <span class="token operator">=></span> <span class="token function">printLine</span><span class="token punctuation">(</span><span class="token function">renderFailure</span><span class="token punctuation">(</span>fail<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">game</span><span class="token punctuation">(</span>env<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n        success <span class="token operator">=></span> <span class="token function">printLine</span><span class="token punctuation">(</span><span class="token function">renderSuccess</span><span class="token punctuation">(</span>success<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">chain</span><span class="token punctuation">(</span>exit<span class="token punctuation">)</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span></code></pre>\n      </div>\n<p>Why did we separate the logic like this? We’d like this function to recurse, but we’d also like our <code class="language-text">env</code> to persist unchanged throughout the whole game. The easiest way I thought of to do it was to split the two. This is how we’re now going to call <code class="language-text">main</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token function">main</span><span class="token punctuation">(</span>defaultCfg<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p><code class="language-text">main</code> is given the <code class="language-text">defaultCfg</code>, getting us back to where we were at the end of the last post, but now with randomness! We just have to <code class="language-text">run</code> it.</p>\n<h3>Conclusions</h3>\n<p>We shuffled some things around, had to make more changes than we previously have had to, but we’re now inching toward an interesting game. But we can guess forever right now. We’re guaranteed to win through sheer determination. We should change that. Next time we’ll take a break from the javascript, and try our hand at rewriting this is a functional language: purescript! I’m excited for the opportunity to try this language out. Stay tuned!</p>',
frontmatter:{path:"/what-the-adt-04",title:"What the ADT 04 - Things are Starting to Get Random",date:"July 29, 2018"}}},pathContext:{slug:"/what-the-adt-04/",previous:{fields:{slug:"/what-the-adt-03/"},frontmatter:{path:"/what-the-adt-03",title:"What the ADT 03 - More Than Just a Single-Use"}},next:{fields:{slug:"/what-the-adt-p01/"},frontmatter:{path:"/what-the-adt-p01",title:"What the ADT Purescript 01 - Trying our Hand at a Real FP"}}}}}});
//# sourceMappingURL=path---what-the-adt-04-4e0cace2a7fc7cc787cf.js.map