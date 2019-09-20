/**
 * @file Component: Poe Sprite
 */

/* eslint-disable quote-props */
import { ANIMATIONS, standardizeMateAnimationState } from './_animations.mjs';
import { TILES_X, TILES_Y } from './_image.mjs';
import { MateAnimationState, RawMateAnimation, VueComponent, VueProp } from './_types.mjs';



/**
 * Sanitize Frame
 *
 * @param {number} frame Frame.
 * @return {number} Frame.
 */
const sanitizeFrame = function(frame) {
	/** @type {number} */
	const max = TILES_X * TILES_Y;

	frame = parseInt(frame, 10) || 0;
	if (0 > frame) {
		return 0;
	}
	else if (max < frame) {
		return max;
	}

	return frame;
};

/**
 * Minimum Repeat
 *
 * @const {number}
 */
const repeatMin = 0;

/**
 * Maximum Repeat
 *
 * @const {number}
 */
const repeatMax = 99;

/**
 * Minimum Speed
 *
 * @const {number}
 */
const speedMin = 10;

/**
 * Maximum Speed
 *
 * @const {number}
 */
const speedMax = 9999;

/**
 * Timeout
 *
 * @type {?number}
 */
let _timeout = null;

/**
 * Component: Poe Sprite
 *
 * @const {VueComponent}
 */
export const poeSprite = {
	/**
	 * Data
	 *
	 * @return {Object} Data.
	 */
	'data': function() {
		return {
			/** @type {Array<number>} */
			'frames': [],
			/** @type {number} */
			'preset': -1,
			/** @type {Array} */
			'presets': ANIMATIONS.reduce(
				/**
				 * Presets
				 *
				 * @param {Array} out Collection.
				 * @param {RawMateAnimation} v Value.
				 * @return {Array} Collection.
				 */
				(out, v) => {
					/** @type {MateAnimationState} */
					const start = standardizeMateAnimationState(v.start);

					/** @type {!number} */
					let repeat = Number(('function' === typeof v.repeat) ? 5 : v.repeat);
					if (repeatMax < repeat) {
						repeat = repeatMax;
					}

					/** @type {number} */
					const repeatFrom = repeat ? v.repeatFrom : 0;

					out.push({
						'id': v.id,
						'name': v.name,
						'speed': start.speed,
						'repeat': repeat,
						'repeatFrom': repeatFrom,
						'frames': v.frames,
					});

					return out;
				},
				[]
			)
				.sort((a, b) => {
					const a_key = a['name'].toLowerCase();
					const b_key = b['name'].toLowerCase();

					if (a_key < b_key) {
						return -1;
					}
					else if (a_key > b_key) {
						return 1;
					}

					return 0;
				}),
			/** @type {number} */
			'repeat': 0,
			/** @type {number} */
			'repeatFrom': 0,
			/** @type {number} */
			'speed': 200,
			/** @type {number} */
			'tick': -1,
		};
	},

	/** @type {Object<string, VueProp>} */
	'props': {},

	/** @type {Object} */
	'methods': {
		/**
		 * Add Frame
		 *
		 * @param {number} frame Frame.
		 * @return {void} Nothing.
		 */
		'addFrame': function(frame) {
			this['frames'].push(sanitizeFrame(frame));
		},

		/**
		 * Remove Frame
		 *
		 * @param {number} index Index.
		 * @return {void} Nothing.
		 */
		'removeFrame': function(index) {
			index = parseInt(index, 10) || 0;
			if ('undefined' !== typeof this['frames'][index]) {
				this['frames'].splice(index, 1);
			}

			const length = this['frames'].length;
			if (! length) {
				this['repeatFrom'] = 0;
				this['repeat'] = 0;
			}
			else if (length <= this['repeatFrom']) {
				this['repeatFrom'] = length - 1;
			}
		},

		/**
		 * Move Frame Up
		 *
		 * @param {number} index Index.
		 * @return {void} Nothing.
		 */
		'raiseFrame': function(index) {
			index = parseInt(index, 10) || 0;

			if (0 < index && 'undefined' !== typeof this['frames'][index]) {
				[this['frames'][index], this['frames'][index - 1]] = [this['frames'][index - 1], this['frames'][index]];
			}
		},

		/**
		 * Move Frame Down
		 *
		 * @param {number} index Index.
		 * @return {void} Nothing.
		 */
		'lowerFrame': function(index) {
			index = parseInt(index, 10) || 0;

			if (
				0 <= index &&
				this['frames'].length - 1 > index &&
				'undefined' !== typeof this['frames'][index]
			) {
				[this['frames'][index], this['frames'][index + 1]] = [this['frames'][index + 1], this['frames'][index]];
			}
		},

		/**
		 * Cycle Tick
		 *
		 * @return {void} Nothing.
		 */
		'tickCycle': function() {
			_timeout = null;
			const length = this['playlist'].length;

			// No change needed.
			if (0 > this['tick'] || 2 > length) {
				return;
			}

			/** @type {number} */
			let tick = this['tick'] + 1;

			// Start over.
			if (length <= tick) {
				tick = 0;
			}

			this['tick'] = tick;

			// Bump the frame as needed.
			window['Vue']['nextTick'](() => {
				_timeout = setTimeout(() => {
					_timeout = null;
					window.requestAnimationFrame(() => {
						this['tickCycle']();
					});
				}, this['speed']);
			});
		},
	},

	/** @type {Object} */
	'computed': {
		/**
		 * Settings Errors
		 *
		 * @return {(boolean|Array<string>)} Errors or false.
		 */
		'errors': function() {
			/** @type {Array<string>} */
			let out = [];

			// Speed.
			if (speedMin > this['speed']) {
				out.push(`Speed must be at least ${speedMin}ms.`);
			}
			else if (speedMax < this['speed']) {
				out.push(`Speed cannot exceed ${speedMax}ms.`);
			}

			// Repeat.
			if (repeatMin > this['repeat']) {
				out.push(`Repeat must be at least ${repeatMin}.`);

				// Check repeat from only if we're repeating.

				/** @type {number} */
				const fromMax = this['frames'].length ? this['frames'].length - 1 : 0;

				if (repeatMin > this['repeatFrom']) {
					out.push(`Repeat From must be at least ${repeatMin}.`);
				}
				else if (fromMax < this['repeatFrom']) {
					out.push(`Repeat From cannot exceed ${fromMax}.`);
				}
			}
			else if (repeatMax < this['repeat']) {
				out.push(`Repeat cannot exceed ${repeatMax}.`);
			}

			return out.length ? out : false;
		},

		/**
		 * Playlist
		 *
		 * @return {(boolean|Array<number>)} Frames.
		 */
		'playlist': function() {
			/** @type {number} */
			const framesLength = this['frames'].length;

			if (! framesLength) {
				return false;
			}

			/** @type {Array<number>} */
			let out = [];

			/** @type {number} */
			const stepsLength = framesLength + (framesLength - this['repeatFrom']) * this['repeat'];

			for (let i = 0; i < stepsLength; ++i) {
				if (i < framesLength) {
					out.push(this['frames'][i]);
				}
				else if (! this['repeatFrom']) {
					out.push(this['frames'][i % framesLength]);
				}
				else {
					out.push(this['frames'][this['repeatFrom'] + (i - this['repeatFrom']) % (framesLength - this['repeatFrom'])]);
				}
			}

			return out;
		},

		/**
		 * Preset List
		 *
		 * @return {string} HTML.
		 */
		'presetList': function() {
			let out = '<option value="-1"> --- </option>';

			const length = this['presets'].length;
			for (let i = 0; i < length; ++i) {
				out += `<option value="${i}">${this['presets'][i]['name']}</option>`;
			}

			return out;
		},
	},

	/** @type {Object} */
	'watch': {
		/**
		 * Playlist
		 *
		 * @return {void} Nothing.
		 */
		'playlist': function() {
			// Clear any existing animations.
			if (_timeout) {
				clearTimeout(_timeout);
				_timeout = null;
			}

			if (! this['playlist'].length) {
				this['tick'] = -1;
			}
			else {
				this['tick'] = 0;
				window['Vue']['nextTick'](() => {
					this['tickCycle']();
				});
			}
		},

		/**
		 * Preset
		 *
		 * @param {number} preset Preset.
		 * @return {void} Nothing.
		 */
		'preset': function(preset) {
			if (0 > preset) {
				this['repeatFrom'] = 0;
				this['repeat'] = 0;
				this['speed'] = 200;
				this['frames'] = [];
			}
			else {
				this['frames'] = JSON.parse(JSON.stringify(this['presets'][preset]['frames']));
				this['speed'] = this['presets'][preset]['speed'];
				this['repeat'] = this['presets'][preset]['repeat'];
				this['repeatFrom'] = this['presets'][preset]['repeatFrom'];
			}
		},

		/**
		 * Repeat
		 *
		 * @param {number} v Value.
		 * @return {void} Nothing.
		 */
		'repeat': function(v) {
			if (
				('number' !== typeof v) ||
				repeatMin > v
			) {
				this['repeat'] = repeatMin;
			}
			else if (repeatMax < v) {
				this['repeat'] = repeatMax;
			}
		},

		/**
		 * Repeat From
		 *
		 * @param {number} v Value.
		 * @return {void} Nothing.
		 */
		'repeatFrom': function(v) {
			if (
				! this['repeat'] ||
				('number' !== typeof v) ||
				repeatMin > v
			) {
				this['repeatFrom'] = repeatMin;
			}
			else if (this['frames'].length <= v) {
				this['repeatFrom'] = this['frames'].length - 1;
			}
		},
	},

	/** @type {string} */
	'template': `
		<div class="sprite-wrapper">
			<div class="sprite">
				<div
					v-for="f in ${TILES_X * TILES_Y}"
					class="sprite-frame"
					:data-frame="'#' + (f - 1)"
				>
					<poe-frame
						:frame="f - 1"
						v-on:click.prevent="addFrame(f - 1)"
					></poe-frame>
				</div>
			</div>

			<div class="playground">
				<div class="playground-settings">
					<fieldset
						class="playground-setting for-presets"
					>
						<label for="playground-preset" class="accent">Preset</label>
						<select
							id="playground-preset"
							v-model.number="preset"
							v-html="presetList"
						></select>
					</fieldset>

					<fieldset
						class="playground-setting for-speed"
						:class="{ 'is-disabled' : ! playlist.length }"
					>
						<label for="playground-speed" class="accent is-required">Speed</label>
						<input
							id="playground-speed"
							max="${speedMax}"
							min="${speedMin}"
							step="1"
							type="number"
							v-model.number="speed"
						/>
					</fieldset>

					<fieldset
						class="playground-setting for-repeat"
						:class="{ 'is-disabled' : ! playlist.length }"
					>
						<label for="playground-repeat" class="accent">Repeat</label>
						<input
							id="playground-repeat"
							max="${repeatMax}"
							min="${repeatMin}"
							step="1"
							type="number"
							v-model.number="repeat"
						/>
					</fieldset>

					<fieldset
						class="playground-setting for-repeat-from"
						:class="{ 'is-disabled' : repeat <= 0 || ! playlist.length }"
					>
						<label for="playground-repeat-from" class="accent">From</label>
						<input
							id="playground-repeat-from"
							:max="frames.length ? frames.length - 1 : 0"
							min="${repeatMin}"
							step="1"
							type="number"
							v-model.number="repeatFrom"
						/>
					</fieldset>

					<div
						v-if="false !== errors"
						class="playground-settings-errors accent"
					>
						<p v-for="error in errors">{{ error }}</p>
					</div>
				</div>

				<div class="playground-movie" v-if="false !== playlist && 0 <= tick">
					<poe-frame
						class="playground-movie-frame"
						:frame="playlist[tick]"
						:key="'playground-movie-' + playlist[tick]"
					></poe-frame>
				</div>

				<table class="playground-frames" v-if="false !== playlist">
					<tbody>
						<tr v-for="(f, index) in frames">
							<td class="playground-frames-col for-id accent">
								#{{ f }}
							</td>
							<td class="playground-frames-col for-frame">
								<poe-frame
									class="playground-frame"
									:frame="f"
									:key="'playground-frames-' + index + '-' + f"
									v-on:click.prevent="removeFrame(index)"
								></poe-frame>
							</td>
							<td class="playground-frames-col for-up">
								<div class="playground-frames-order">
									<poe-icon
										v-if="index > 0"
										icon="arrow"
										class="up"
										v-on:click.prevent="raiseFrame(index)"
									></poe-icon>

									<poe-icon
										v-if="index < frames.length - 1"
										icon="arrow"
										class="down"
										v-on:click.prevent="lowerFrame(index)"
									></poe-icon>
								</div>
							</td>
							<td class="playground-frames-col for-repeat accent">
								<template v-if="repeat && index >= repeatFrom">∞</template>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
};
