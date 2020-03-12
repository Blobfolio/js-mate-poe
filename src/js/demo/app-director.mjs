/**
 * @file JS Mate Poe: Vue Demo: Director
 */

/* eslint-disable quote-props */
/* global Vue */
import {
	Animation,
	AnimationFlag,
	AnimationList,
	AsciiArt,
	LogMsg,
	Playlist,
	Scene,
	SceneFlag,
	SceneList,
	SpriteInfo,
	Universe
} from '../core.mjs';
import { universeForBrowser } from '../middleware/universe.browser.mjs';
import { PoeFrame } from './poe_frame.mjs';
import { PoeIcon } from './poe_icon.mjs';
/* eslint-disable-next-line */
import { VueApp } from './vue.mjs';



// Set universe overloads.
universeForBrowser();



// ---------------------------------------------------------------------
// Vue
// ---------------------------------------------------------------------

/** @type {boolean} */
let _mounted = false;

/**
 * Escape Attribute
 *
 * If for some reason an arbitrary string needs to be shoved
 * into an HTML context, this function can be used to escape
 * it in a similar way to the WP esc_attr() function.
 *
 * @param {string} attr Attribute value.
 * @return {string} Escaped value.
 */
const escAttr = function(attr) {
	return ('' + attr)				// Force string.
		.replace(/&/g, '&amp;')		// & must be first.
		.replace(/'/g, '&apos;')	// Other entities.
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
};

/**
 * Zero Pad
 *
 * @param {number} v Value.
 * @param {number} length Length.
 * @return {string} Number.
 */
const zeroPad = function(v, length) {
	length = parseInt(length, 10) || 0;
	v = parseInt(v, 10) || 0;

	/** @type {string} */
	let str = v.toString();

	while (str.length < length) {
		str = '0' + str;
	}

	return str;
};



Vue.component('poe-frame', PoeFrame);
Vue.component('poe-icon', PoeIcon);



new Vue(/** @type {!VueApp} */ ({
	/** @type {string} */
	'el': '#app',

	/** @type {Object} */
	'data': {
		'name': LogMsg.Name,
		'animations': AnimationList.reduce(
			/**
			 * Collection
			 *
			 * @param {!Array<!Animation>} out Collection.
			 * @param {!Animation} v Animation.
			 * @return {!Array<!Animation>} Collection.
			 */
			(out, v) => {
				out.push(/** @type {!Animation} */ ({
					/** @type {!Playlist} */
					'id': v.id,
					/** @type {string} */
					'name': v.name,
					/** @type {!SceneList} */
					'scenes': v.scenes,
					/** @type {number} */
					'flags': v.flags,
				}));

				return out;
			},
			[]
		)
			.sort((a, b) => {
				return (a['name'] < b['name']) ? -1 : 1;
			}),

		'currentAnimation': 0,
		'currentFlipX': false,
		'currentFlipY': false,
		'currentFrame': 3,
		'currentScene': 0,
		'currentStep': 0,
		'currentStepTimeout': null,

		'filmW': 2002,
		'filmH': 1502,
		'filmX': -1001,
		'filmY': -751,

		'durationMin': 10,
		'durationMax': 30000,
		'moveMin': -5000,
		'moveMax': 5000,
		'repeatMax': 99,

		'scenes': [
			{
				'duration': 1000,
				'flipX': false,
				'flipY': false,
				'moveX': 0,
				'moveY': 0,
				'repeat': 0,
				'repeatFrom': 0,
				'frames': [],
			},
		],
	},

	/**
	 * Mounted
	 *
	 * @return {void} Nothing.
	 */
	'mounted': function() {
		if (! _mounted) {
			_mounted = true;

			// Set the canvas size.
			Universe.height = parseInt(window.innerHeight, 10) || 1024;
			Universe.width = parseInt(window.innerWidth, 10) || 768;

			// Print something fun to the console.
			/* eslint-disable-next-line */
			console.info(`%c${AsciiArt}`, 'color:#b2bec3;font-family:monospace;font-weight:bold;');

			/* eslint-disable-next-line */
			console.info(`%c${LogMsg.Name}: %c${LogMsg.Version}`, 'color:#ff1493;font-weight:bold;', 'color:#00abc0;font-weight:bold;');

			/* eslint-disable-next-line */
			console.info(`%c${LogMsg.URL}`, 'color:#e67e22;text-decoration:underline;');
		}
	},

	/** @type {Object} */
	'filters': {
		/**
		 * Zero Pad
		 *
		 * @param {number} v Value.
		 * @param {number} length Length.
		 * @return {string} Number.
		 */
		'zeroPad': function(v, length) {
			return zeroPad(v, length);
		},
	},

	/** @type {Object} */
	'methods': {
		/**
		 * Film Tick
		 *
		 * @return {void} Nothing.
		 */
		'filmTick': function() {
			this['currentStepTimeout'] = null;
			if (false === this['steps']) {
				return;
			}

			++this['currentStep'];
			if (this['currentStep'] >= this['steps'].length) {
				this['currentStep'] = 0;
			}

			this['currentFrame'] = this['steps'][this['currentStep']]['frame'];
			this['currentFlipX'] = this['steps'][this['currentStep']]['flipX'];
			this['currentFlipY'] = this['steps'][this['currentStep']]['flipY'];

			this['filmX'] -= this['steps'][this['currentStep']]['moveX'];
			// Reached the right side.
			if (0 < this['filmX']) {
				this['filmX'] = -1592;
			}
			// Reached the left side.
			else if (-1592 > this['filmX']) {
				this['filmX'] = 0;
			}

			this['filmY'] -= this['steps'][this['currentStep']]['moveY'];
			// Reached the top side.
			if (0 < this['filmY']) {
				this['filmY'] = -1402;
			}
			// Reached the bottom side.
			else if (-1402 > this['filmY']) {
				this['filmY'] = 0;
			}

			if (1 < this['steps'].length) {
				this['currentStepTimeout'] = setTimeout(() => {
					this['filmTick']();
				}, this['steps'][this['currentStep']]['interval']);
			}
		},

		/**
		 * Add Frame
		 *
		 * @param {number} frame Frame.
		 * @return {void} Nothing.
		 */
		'frameAdd': function(frame) {
			if (0 > frame) {
				frame = 0;
			}
			else if (SpriteInfo.EmptyTile < frame) {
				frame = SpriteInfo.EmptyTile;
			}

			this['scene']['frames'].push(frame);
		},

		/**
		 * Remove Frame
		 *
		 * @param {number} frame Frame.
		 * @return {void} Nothing.
		 */
		'frameRemove': function(frame) {
			frame = parseInt(frame, 10) || -1;
			if ('undefined' !== typeof this['scene']['frames'][frame]) {
				this['scene']['frames'].splice(frame, 1);
			}
		},

		/**
		 * Move Frame Up
		 *
		 * @param {number} frame Frame.
		 * @return {void} Nothing.
		 */
		'frameUp': function(frame) {
			frame = parseInt(frame, 10);

			if (
				! isNaN(frame) &&
				0 < frame &&
				('undefined' !== typeof this['scene']['frames'][frame])
			) {
				[
					this['scene']['frames'][frame],
					this['scene']['frames'][frame - 1],
				] = [
					this['scene']['frames'][frame - 1],
					this['scene']['frames'][frame],
				];
				this['$forceUpdate']();
			}
		},

		/**
		 * Move Frame Down
		 *
		 * @param {number} frame Frame.
		 * @return {void} Nothing.
		 */
		'frameDown': function(frame) {
			frame = parseInt(frame, 10);

			if (
				! isNaN(frame) &&
				frame + 1 < this['scene']['frames'].length &&
				('undefined' !== typeof this['scene']['frames'][frame])
			) {
				[
					this['scene']['frames'][frame],
					this['scene']['frames'][frame + 1],
				] = [
					this['scene']['frames'][frame + 1],
					this['scene']['frames'][frame],
				];
				this['$forceUpdate']();
			}
		},

		/**
		 * Sanitize Duration
		 *
		 * @param {number} v Value.
		 * @return {number} Value.
		 */
		'sanitizeDuration': function(v) {
			v = parseInt(v, 10) || 0;

			if (this['durationMin'] > v) {
				return this['durationMin'];
			}
			else if (this['durationMax'] < v) {
				return this['durationMax'];
			}

			return v;
		},

		/**
		 * Sanitize Movement
		 *
		 * @param {number} v Value.
		 * @return {number} Value.
		 */
		'sanitizeMove': function(v) {
			v = parseInt(v, 10) || 0;

			if (this['moveMin'] > v) {
				return this['moveMin'];
			}
			else if (this['moveMax'] < v) {
				return this['moveMax'];
			}

			return v;
		},

		/**
		 * Sanitize Repeat
		 *
		 * @param {number} v Value.
		 * @return {number} Value.
		 */
		'sanitizeRepeat': function(v) {
			v = parseInt(v, 10) || 0;

			if (0 > v) {
				return 0;
			}
			else if (this['repeatMax'] < v) {
				return this['repeatMax'];
			}

			return v;
		},

		/**
		 * Add Scene
		 *
		 * @return {void} Nothing.
		 */
		'sceneAdd': function() {
			this['scenes'].push({
				'duration': 1000,
				'flipX': false,
				'flipY': false,
				'moveX': 0,
				'moveY': 0,
				'repeat': 0,
				'repeatFrom': 0,
				'frames': [],
			});

			this['sceneToggle'](this['scenes'].length - 1);
		},

		/**
		 * Toggle Scene
		 *
		 * @param {number} scene Scene.
		 * @return {void} Nothing.
		 */
		'sceneToggle': function(scene) {
			if (0 > scene) {
				scene = 0;
			}
			else if (this['scenes'].length <= scene) {
				scene = this['scenes'].length - 1;
			}

			this['currentScene'] = scene;
		},
	},

	/** @type {Object} */
	'computed': {
		/**
		 * Animation List
		 *
		 * Static HTML options are much more efficient than looping a
		 * template.
		 *
		 * @return {string} Options.
		 */
		'animationList': function() {
			/** @type {string} */
			let out = '<option value="0"> --- </option>';

			for (let i = 0; i < this['animations'].length; ++i) {
				out += `<option value="${ this['animations'][i]['id'] }">${ escAttr(this['animations'][i]['name']) }</option>`;
			}

			return out;
		},

		/**
		 * Film Styles
		 *
		 * Instead of moving the sprite, we shift the background.
		 *
		 * @return {string} Film styles.
		 */
		'filmStyle': function() {
			return `background-position: ${this['filmX']}px ${this['filmY']}px`;
		},

		/**
		 * Repeat From Max
		 *
		 * @return {number} Max.
		 */
		'repeatFromMax': function() {
			if (this['scene']['frames'].length) {
				return this['scene']['frames'].length - 1;
			}

			return 0;
		},

		/**
		 * Current Scene
		 *
		 * @return {!Object} Scene.
		 */
		'scene': function() {
			return this['scenes'][this['currentScene']];
		},

		/**
		 * Steps
		 *
		 * @return {!Array|boolean} Steps or false.
		 */
		'steps': function() {
			/** @type {!Array} */
			let out = [];

			// Loop each scene.
			for (let i = 0; i < this['scenes'].length; ++i) {
				// Skip empty scenes.
				if (! this['scenes'][i]['frames'].length) {
					continue;
				}

				/** @const {number} */
				const repeat = this['sanitizeRepeat'](this['scenes'][i]['repeat']);

				/** @type {number} */
				let repeatFrom = repeat ? this['scenes'][i]['repeatFrom'] : 0;
				if (repeatFrom >= this['scenes'][i]['frames'].length) {
					repeatFrom = this['scenes'][i]['frames'].length - 1;
				}
				else if (0 > repeatFrom) {
					repeatFrom = 0;
				}

				/** @const {number} */
				const sceneLength = this['scenes'][i]['frames'].length + (this['scenes'][i]['frames'].length - repeatFrom) * repeat;
				if (! sceneLength) {
					continue;
				}

				/** @const {number} */
				const interval = this['sanitizeDuration'](this['scenes'][i]['duration']) / sceneLength;

				/** @const {number} */
				const intervalX = this['sanitizeMove'](this['scenes'][i]['moveX']) / sceneLength;

				/** @const {number} */
				const intervalY = this['sanitizeMove'](this['scenes'][i]['moveY']) / sceneLength;

				// Finally add up all the steps!
				for (let j = 0; j < sceneLength; ++j) {
					// We need to find the right frame.
					/** @type {number} */
					let frame = 0;
					if (this['scenes'][i]['frames'].length > j) {
						frame = this['scenes'][i]['frames'][j];
					}
					else if (! repeatFrom) {
						frame = this['scenes'][i]['frames'][j % this['scenes'][i]['frames'].length];
					}
					else {
						frame = this['scenes'][i]['frames'][repeatFrom + (j - repeatFrom) % (this['scenes'][i]['frames'].length - repeatFrom)];
					}

					out.push({
						'interval': interval,
						'flipX': this['scenes'][i]['flipX'],
						'flipY': this['scenes'][i]['flipY'],
						'moveX': intervalX,
						'moveY': intervalY,
						'frame': frame,
					});
				}
			}

			return out.length ? out : false;
		},

		/**
		 * Steps Hash
		 *
		 * @return {number} Hash.
		 */
		'stepsHash': function() {
			if (false === this['steps']) {
				return 0;
			}

			// Stringify objects.
			/** @const {string} */
			const value = JSON.stringify(this['steps']);

			/** @type {number} */
			let hash = 0;

			/** @const {number} */
			const strlen = value.length;

			for (let i = 0; i < strlen; i++) {
				let c = value.charCodeAt(i);
				hash = ((hash << 5) - hash) + c;
				hash = hash & hash; // Convert to 32-bit integer.
			}

			return hash;
		},
	},

	/** @type {Object} */
	'watch': {
		/**
		 * Current Animation
		 *
		 * @param {number} v Animation.
		 * @return {void} Nothing.
		 */
		'currentAnimation': function(v) {
			this['scenes'].length = 0;

			if (0 === v) {
				this['scenes'].push({
					'duration': 1000,
					'flipX': false,
					'flipY': false,
					'moveX': 0,
					'moveY': 0,
					'repeat': 0,
					'repeatFrom': 0,
					'frames': [],
				});
			}
			else {
				/** @const {!Animation} */
				const animation = this['animations'].find((entry) => v === entry.id);

				/** @type {boolean} */
				let flipX = !! (AnimationFlag.ReverseX & animation.flags);

				/** @type {boolean} */
				let flipY = !! (AnimationFlag.ReverseY & animation.flags);

				/** @const {!Array<!Scene>} */
				const scenes = animation['scenes'].resolve();

				for (let i = 0; i < scenes.length; ++i) {
					/** @type {number} */
					let moveX = null !== scenes[i].move ? this['sanitizeMove'](scenes[i].move.x) : 0;

					/** @type {number} */
					let moveY = null !== scenes[i].move ? this['sanitizeMove'](scenes[i].move.y) : 0;

					// If the sprite is reversed, its direction should be too.
					if (moveX && flipX) {
						moveX = 0 - moveX;
					}
					if (moveY && flipY) {
						moveY = 0 - moveY;
					}

					this['scenes'].push({
						'duration': this['sanitizeDuration'](scenes[i].duration),
						'flipX': flipX,
						'flipY': flipY,
						'moveX': moveX,
						'moveY': moveY,
						'repeat': this['sanitizeRepeat'](scenes[i].frames.repeat),
						'repeatFrom': scenes[i].frames.repeatFrom,
						'frames': [...scenes[i].frames.frames],
					});

					// We might be flipping after.
					if (SceneFlag.FlipXAfter & scenes[i].flags) {
						flipX = ! flipX;
					}
					if (SceneFlag.FlipYAfter & scenes[i].flags) {
						flipY = ! flipY;
					}
				}
			}

			this['sceneToggle'](0);
		},

		/**
		 * Steps Hash
		 *
		 * @param {number} hash Hash.
		 * @return {void} Nothing.
		 */
		'stepsHash': function(hash) {
			// Reset the timeout.
			if (this['currentStepTimeout']) {
				clearTimeout(this['currentStepTimeout']);
				this['currentStepTimeout'] = null;
			}

			// Reset the step and everything that goes with it.
			this['currentFlipX'] = false;
			this['currentFlipY'] = false;
			this['currentFrame'] = 0;
			this['currentStep'] = 0;
			this['filmX'] = -1001;
			this['filmY'] = -751;

			// Start playback!
			if (hash) {
				this['filmTick']();
			}
		},
	},
}));
