# JS Mate Poe

A compact, dependency-free ~~JavaScript~~ wasm implementation of the beloved 16-bit Screen Mate Poe Windows program released in 1996.



&nbsp;
## Features

There have been dozens of ports of Screen Mate Poe over the past 27 years, including several browser-based implementations such as [this](http://esheep.petrucci.ch/) and [this](https://github.com/tobozo/jqsheep). Unfortunately many of the projects are now ancient and either rely on bloated frameworks like jQuery or use outdated/nonperformant animation techniques like `setTimeout()`.

JS Mate Poe is a lean, web-first iteration designed for playback in all modern web browsers, with all of the original characters, sounds, and animation sequences — except those relating to interactions with page objects. (Web page elements do not have coherent visual boundaries in the same way boxy desktop windows do, so Poe can't sit on a page title or anything like that. He will, however, occasionally climb up the side of the screen.)

As the name suggests, JS Mate Poe was originally a vanilla JavaScript project, but it has since been entirely re-rewritten in Rust — a real programming language! — and is now distributed as a compiled wasm binary instead.

Well, sort of.

For whatever reason, browsers cannot yet directly load wasm applications; they have to be initialized with JavaScript "glue" instead.

So until that changes, the wasm binary is distributed _inside_ a standalone Javascript file. That isn't ideal, but it is what it is.

Even so, JS Mate Poe has been heavily optimized for size to minimize the impact on page load and network:

| Encoding | Bytes |
| ---- | ---- |
| None | 103,955 |
| Brotli | 61,613 |
| Gzip | 63,740 |



&nbsp;
## Installation

Adding the screen mate to your web page is very easy. Simply download the `js-mate-poe.min.js` script from the [latest release](https://github.com/Blobfolio/js-mate-poe/releases), upload it to a location of your choosing, and add the following before the closing `</body>` tag of your web page:

```html
<script async src="https://yourdomain.com/assets/js-mate-poe.min.js"></script>
```

That's it!

By default, Poe will start playing automatically as soon as its script has loaded, but if you'd rather handle that manually — refer to the [next section](#methods) — just add a `data-manual` attribute to the script tag, like:

```html
<script async data-manual src="https://yourdomain.com/assets/js-mate-poe.min.js"></script>
```



&nbsp;
## Methods

All of the public endpoints are made available through the global `window.Poe` object.

### Starting/Stopping Poe

You can use the `Poe.active` getter/setter to check or change the current state (i.e. turn it on or off).

**Example:**

```js
// Check if Poe is currently running.
console.log(Poe.active); // true

// Disable Poe (and remove its DOM elements and event bindings).
Poe.active = false;

// (Re)start Poe.
Poe.active = true;
```

### Audio Playback

Some of the animation sequences make noise. Audio playback is enabled by default because it is adorable, but it can be disabled if you're a party pooper.

**Note:** Most browsers ignore audio events until the user has "interacted" with the page, so even though audio is enabled by default, it probably won't play unless you've clicked something (anything) on the page.

**Example:**
```js
// Audio is enabled by default.
console.log(Poe.audio); // true

// But if you turn it off...
Poe.audio = false;
console.log(Poe.audio); // false

// And back on again if you want.
Poe.audio = true;
console.log(Poe.audio); // true
```

### Playback Speed

The playback animation speed can be adjusted up or down to either slow or speed up the action. Values between `0` (paused) and `10` (10x speed) are supported.

**Example:**
```js
// The default speed is 1.
console.log(Poe.speed); // 1

// A fractional value between 0 and 1 slows things down.
Poe.speed = 0.5; // Half speed!

// A value greater than 1 speeds things up.
Poe.speed = 2; // Double speed!

// And back to the default.
Poe.speed = 1;
```



&nbsp;
## License

Copyright © 2023 [Blobfolio, LLC](https://blobfolio.com) &lt;hello@blobfolio.com&gt;

This work is free. You can redistribute it and/or modify it under the terms of the Do What The Fuck You Want To Public License, Version 2.

    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
    Version 2, December 2004
    
    Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
    
    Everyone is permitted to copy and distribute verbatim or modified
    copies of this license document, and changing it is allowed as long
    as the name is changed.
    
    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
    
    0. You just DO WHAT THE FUCK YOU WANT TO.



&nbsp;
## Credits

The [original Screen Mate Poe](http://www.thefullwiki.org/eSheep) (AKA eSheep, Screen Mate Poo, etc.) was based on Tatsutoshi Nomura's animated shorts "Stray Sheep", which aired on the Fuji Television network in Japan. Mr. Nomura has subsequently published a series of cute children's books and games featuring featuring Poe.

If you're looking for an adorable gift for young readers, be sure to check out ["Poe At Play"](https://www.biblio.com/9781591822882).
