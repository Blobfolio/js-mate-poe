# JS Mate Poe

A compact, dependency-free Javascript implementation of the beloved 16-bit Screen Mate Poe Windows program released in 1996.



&nbsp;
##### Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Methods](#methods)
4. [Building](#building)
5. [License](#license)
6. [Credits](#credits)



&nbsp;
## Features

There have been dozens of ports of Screen Mate Poe over the past 23 years, including several browser-based implements such as [this](http://esheep.petrucci.ch/) and [this](https://github.com/tobozo/jqsheep). Unfortunately many of the projects are now old — *ancient* in web years! — and either rely on bloated frameworks like jQuery or use outdated animation techniques like `setTimeout()`.

JS Mate Poe is a web-first, self-contained implementation written in vanilla Javascript. Everything it needs — graphics, sounds, styles — are embedded in the [main script](https://github.com/Blobfolio/js-mate-poe/blob/master/dist/js-mate-poe.min.js), making installation a breeze. It takes advantage of all of the latest and greatest [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript) goodies, including `requestAnimationFrame()` to maximize playback framerate while keeping resource requirements to a minimum.

The JS Mate Poe script has also been heavily optimized using [Google Closure Compiler](https://developers.google.com/closure/compiler/). Its impact on your page's load time will be minimal, particularly if your server uses Gzip and/or Brotli encodings.

| Encoding | Size |
| -------- | ---- |
| None | 92,051 Bytes |
| Gzip | 54,054 Bytes |
| Brotli | 50,943 Bytes |

[Version 1.0.1](https://github.com/Blobfolio/js-mate-poe/releases) contains all of the main animation sequences, including complex multi-sprite interactions such as alien encounters and multimedia experiences such as sneezing and bleating. Poe can also be dragged around the screen using your mouse (if you're *that* kind of person!).

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
window.addEventListener('load', () => Poe.start(), { once: true });
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
### Poe.audio()

Test whether or not Poe audio playback is enabled. This is `true` by default, but the ability can be toggled using [Poe.setAudio()](#poesetaudio).

**Example:**
```
// Audio is enabled by default.
console.log(Poe.audio()); // true

// But if you turn it off...
Poe.setAudio(false);
console.log(Poe.audio()); // false
```


&nbsp;
### Poe.setAudio()

Some of the animation sequences make noise. Audio playback is enabled by default because it is adorable, but if you want a quieter experience, you can use this method to explicitly control this behavior.

*Note:* Many browers — particularly mobile ones — block auto-playing audio, so JS Mate Poe might not be allowed to make noise regardless. This can be worked around by either asking users to whitelist auto-playing audio from your domain, or by executing this method from an interactive callback, such as an `onClick()` event.

**Arguments:**

| Type | Description | Default |
| ---- | ----------- | ------- |
| *boolean* | `true` to enable audio playback, `false` to disable it. | `false` |

**Example:**

```js
// Audio is enabled by default.
Poe.start();

// Turn it off by calling this method with no arguments, or by passing an explicit false.
Poe.setAudio();      // Audio off.
Poe.setAudio(false); // Audio off.

// Or turn it back on by passing true.
Poe.setAudio(true);  // Audio on.
```


&nbsp;
### Poe.printAscii()

Print an ASCII art version of Poe to the browser's debug console. It is doubtful many people will notice, but the important thing is that *you* know it's there.

**Example:**

```js
Poe.printAscii(); // A picture prints.
```


&nbsp;
### Poe.printVersion()

Print the program name and version to the browser's debug console.

**Example:**

```js
Poe.printVersion(); // "JS Mate Poe: 1.0.1"
```



&nbsp;
## Building

The JS Mate Poe code can be edited and/or compiled by Linux/Mac users meeting the following system requirements:

| Dependency | Description | Auto |
| ---------- | ----------- | ---- |
| [Brotli](https://github.com/google/brotli) | Static encoding. | * |
| [Gzip](https://www.gzip.org/) | Static encoding. | * |
| [Just](https://github.com/casey/just) | Task runner. | |
| [NPM](https://www.npmjs.com/) | Dependency management. | |
| [SassC](https://github.com/sass/sassc) | SCSS processing. | * |
| [Watchexec](https://github.com/watchexec/watchexec) | Source file monitoring. | * |

The Just build tasks will attempt to automatically install any missing dependencies (other than NPM and Just itself). If you do not already have Watchexec installed, you'll also need [Cargo](https://doc.rust-lang.org/stable/cargo/getting-started/installation.html), so Just can build it.

If you meet the requirements, hop into the terminal and type:
```bash
# Clone the repository.
git clone https://github.com/Blobfolio/js-mate-poe.git

# Go to it!
cd js-mate-poe

# Watch for changes...
just watch

# Or build without changing anything...
just build
```



&nbsp;
## License

Copyright © 2019 [Blobfolio, LLC](https://blobfolio.com) &lt;hello@blobfolio.com&gt;

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
