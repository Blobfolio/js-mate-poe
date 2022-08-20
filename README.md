# JS Mate Poe

A compact, dependency-free Javascript implementation of the beloved 16-bit Screen Mate Poe Windows program released in 1996.



&nbsp;
##### Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Methods](#methods)
4. [License](#license)
5. [Credits](#credits)



&nbsp;
## Features

There have been dozens of ports of Screen Mate Poe over the past 23 years, including several browser-based implementations such as [this](http://esheep.petrucci.ch/) and [this](https://github.com/tobozo/jqsheep). Unfortunately many of the projects are now old — *ancient* in web years! — and either rely on bloated frameworks like jQuery or use outdated animation techniques like `setTimeout()`.

JS Mate Poe is a web-first, self-contained implementation written in vanilla Javascript. Everything it needs — graphics, sounds, styles — are embedded in the [main script](https://github.com/Blobfolio/js-mate-poe/blob/master/dist/js-mate-poe.min.js), making installation a breeze. It takes advantage of all of the latest and greatest [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript) goodies, including `requestAnimationFrame()` to maximize playback framerate while keeping resource requirements to a minimum.

The JS Mate Poe script has also been heavily optimized using [Google Closure Compiler](https://developers.google.com/closure/compiler/). Its impact on your page's load time will be minimal, particularly if your server supports serving Gzip and/or Brotli-encoded data.

| Encoding | Size |
| -------- | ---- |
| None | 96,514 Bytes |
| Gzip | 53,592 Bytes |
| Brotli | 52,227 Bytes |

The [latest release](https://github.com/Blobfolio/js-mate-poe/releases/latest) contains all of the main animation sequences, including complex multi-sprite interactions such as alien encounters and multimedia experiences such as sneezing and bleating. Poe can also be dragged around the screen using your mouse (if you're *that* kind of person!).

JS Mate Poe *does not* support alternate characters or sprites; it's Poe or bust. Also intentionally omitted are interactions with individual page elements such as `<div>` or `<h1>`; edge detection is instead bound to the main window.

To see JS Mate Poe in action — and for a full list of animation sequences — look at [`dist/demo/`](https://github.com/Blobfolio/js-mate-poe/blob/master/dist/demo/).



&nbsp;
## Installation

Adding the screen mate to your web page is very easy. All you need to do is download and include `dist/js-mate-poe.min.js` and then call `Poe.start()`.

```html
<script src="js-mate-poe.min.js"></script>
<script>
    // Start the screen mate.
    Poe.start();
</script>
```

If your web page has a lot going on, you might want to wait to trigger Poe's entrance until everything has loaded.

```js
window.addEventListener('load', Poe.start, { once: true });
```



&nbsp;
## Methods

All of the public endpoints are made available through the global `window.Poe` object.


&nbsp;
### Poe.start()

The screen mate must be turned on. Use this method to start it!

**Example:**

```js
Poe.start();
```


&nbsp;
### Poe.stop()

If you're tired of the fun and games, you can either double-click the main Poe sprite, or execute this method to stop the program.

This will remove all traces of the Poe sprite from your page. If you change your mind, you can restart it at any time by calling `Poe.start()` again.

**Example:**

```js
// Get the screen mate going.
Poe.start();

// Stop it.
Poe.stop();

// Restart it.
Poe.start();
```


&nbsp;
### Audio Playback

Some of the animation sequences make noise. Audio playback is enabled by default because it is adorable, but it can be disabled if you're a party pooper.

*Note:* Many browers — particularly mobile ones — block auto-playing audio, so JS Mate Poe might not be allowed to make noise regardless. This can be worked around by either asking users to whitelist auto-playing audio from your domain, or by having users click Poe with their mouse.

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


&nbsp;
### Playback Speed

The playback animation speed can be adjusted up or down to either slow or speed up the action.

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

Copyright © 2022 [Blobfolio, LLC](https://blobfolio.com) &lt;hello@blobfolio.com&gt;

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
