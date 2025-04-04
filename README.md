# JS Mate Poe

[![ci](https://img.shields.io/github/actions/workflow/status/Blobfolio/js-mate-poe/ci.yaml?style=flat-square&label=ci)](https://github.com/Blobfolio/js-mate-poe/actions)
[![deps.rs](https://deps.rs/repo/github/blobfolio/js-mate-poe/status.svg?style=flat-square&label=deps.rs)](https://deps.rs/repo/github/blobfolio/js-mate-poe)<br>
[![license](https://img.shields.io/badge/license-wtfpl-ff1493?style=flat-square)](https://en.wikipedia.org/wiki/WTFPL)
[![contributions welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square&label=contributions)](https://github.com/Blobfolio/js-mate-poe/issues)

A compact, dependency-free ~~Javascript~~ [wasm](https://en.wikipedia.org/wiki/WebAssembly) recreation of the beloved 16-bit Screen Mate Poe Windows program, distributed as a standalone library and a Firefox browser extension.

<img src="https://github.com/Blobfolio/js-mate-poe/raw/master/skel/img/gallery/poe0.webp" width="30%" alt="Add Poe to every site using the browser extension."></img> <img src="https://github.com/Blobfolio/js-mate-poe/raw/master/skel/img/gallery/poe1.png" width="30%" alt="Most of the time Poe just walks around the bottom of the screen."></img> <img src="https://github.com/Blobfolio/js-mate-poe/raw/master/skel/img/gallery/poe2.png" width="30%" alt="Sometimes a friend shows up, doubling the fun!"></img> 


&nbsp;
## About

There have been several ports of Screen Mate Poe since its original release in 1996, but modern desktop environments simply aren't _capable_ of running anything like a "screen mate" app anymore. (Display servers no longer give applications unfettered, global access to every conceivable windowing property, for reasons obvious in hindsight.)

But hey, the Internet is a thing now!

JS Mate Poe is a lean, web-first iteration designed for playback in modern web browsers. It was originally written in vanilla Javascript, but has since been re-rewritten in Rust, and is now compactly compiled to wasm.

It includes all the original characters and sounds, most of the animation sequences — a few desktop-specific things have been omitted, and I've probably forgotten a few — and some _new_ sequences and visual enhancements.

JS Mate Poe has been heavily optimized for both performance and size — it's smaller than the original! — ensuring a minimal impact on page load, bandwidth, and/or user experience. It is framework-free, isolated (via `ShadowDOM`), leverages hardware-accelerated rendering, and is all around _adorable_.

You're welcome!


&nbsp;
## Installation

JS Mate Poe is distributed as both a general purpose Javascript library and a Firefox browser extension.


### Library

To add the screen mate to your own web page, all you need to do is grab the `js-mate-poe.min.js` script from the [latest release](https://github.com/Blobfolio/js-mate-poe/releases), upload it to a location of your choosing, and add the following code snippet before the closing `</body>` tag of your HTML:

```html
<script async src="https://domain.com/path/to/js-mate-poe.min.js"></script>
```

By default, that's all you need to do! Poe will automatically start running around as soon as the script has loaded.

The following attributes can be added to the script tag for more granular control:

| Attribute | Description |
| --------- | ----------- |
| `data-no-start` | Disable autostart. (You'll need to start Poe manually.) |
| `data-no-audio` | Disable audio playback. |
| `data-no-focus` | Disable Poe's draggability. |

For example, if you wanted to launch Poe without sound support, you'd write this instead:

```html
<script async data-no-sound src="https://domain.com/path/to/js-mate-poe.min.js"></script>
```

The [next section](#advanced-library-usage) covers the minimal API, which you'd need to use to enable Poe programmatically.


### Firefox Extension

The Firefox browser extension lets you add Poe to any and every web site for constant companionship!

To install it, simply click the `js-mate-poe_firefox_#.#.#.xpi` package link from the [latest release](https://github.com/Blobfolio/js-mate-poe/releases).

Firefox should prompt you to install it then and there, but if you end up downloading the file, you can either double-click it, or go to the "Manage Your Extensions" settings page (`about:addons`), click the gear/settings icon, and select "Install Add-on From File".

Once installed, look for the little sheep icon in the URL bar — visible on all _regular_ pages (but not local or settings-type stuff) — and click that to turn Poe on or off.

If you want to allow audio — see also the [known issues](#known-issues) section below — you can enable that from the add-on's preferences tab. (Sound is disabled by default.)

#### Permissions

Browser extension permissions lack _nuance_, and as such, JS Mate Poe technically requires "access [to] your data on all sites" in order to run.

To be clear, it **does not** give two bleats about your personal data or browsing history, but because DOM access is an all-or-nothing proposition, is has to ask for EVERYTHING to be able to do anything. 😕

In actuality, all JS Mate Poe needs from the DOM is an ability to add and manipulate its _own_ page elements — the sheep — and query _relevant_ environmental details like the current window size.

The alarmist phrasing is unfortunate, but is what it is.


&nbsp;
## Advanced Library Usage

The standalone Javascript library adds a global `Poe` class to the `window` object that you can use for basic control (if you want it):

| Property | Type | Description | Default |
| -------- | ----- | ------- | ------------- |
| `active` | `bool` | Start or stop the Poe script. | `true` |
| `audio` | `bool` | Enable or disable audio playback. | `true` |
| `focus` | `bool` | Enable or disable the ability to click and drag Poe. | `true` |

These are standard getter/setter methods, so can either give you the current value or allow you to make changes depending on how you use them. For example:

```js
// Stop Poe (and remove its DOM elements and event bindings).
Poe.active = false;

// The current status should be `false`, i.e. stopped.
console.log(Poe.active);

// Restart Poe (and recreate its DOM elements, etc.)
Poe.active = true;

// The current status should be `true`, i.e. started.
console.log(Poe.active);
```

Short and sweet!


&nbsp;
## Credits

The [original Screen Mate Poe](https://en-academic.com/dic.nsf/enwiki/1080158) (AKA eSheep, Screen Mate Poo, etc.) was based on Tatsutoshi Nomura's animated shorts "Stray Sheep", which aired on the Fuji Television network in Japan. Mr. Nomura has subsequently published a series of cute children's books and games featuring Poe.

If you're looking for an adorable gift for young readers, be sure to check out ["Poe At Play"](https://www.biblio.com/9781591822882)!
