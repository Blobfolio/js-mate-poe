/**
 * @file Component: Poe Sprite
 */

/* global Vue */
/* eslint-disable quote-props */
import {
	Animation,
	AnimationList,
	Scene,
	SpriteInfo
} from '../core.mjs';
import { VueComponent, VueProp } from './vue.mjs';



/**
 * Poe Sprite Limits
 *
 * @enum {number}
 */
const PoeSpriteLimits = {
	repeatMin: 0,
	repeatMax: 99,
	speedMin: 10,
	speedMax: 9999,
};

/**
 * Sprite Sequence
 *
 * @typedef {{
	id: string,
	name: string,
	speed: number,
	repeat: number,
	repeatFrom: number,
	frames: !Array<number>
 * }}
 */
var SpriteSequence;

/**
 * Component: Poe Sprite
 *
 * @const {!VueComponent}
 */
export const PoeSprite = {
	/**
	 * Data
	 *
	 * @return {!Object} Data.
	 */
	'data': function() {
		return {
			/** @type {!Array<number>} */
			'frames': [],
			/** @type {number} */
			'preset': -1,
			'presets': AnimationList.reduce(
				/**
				 * Presets
				 *
				 * @param {!Array<!SpriteSequence>} out Collection.
				 * @param {!Animation} v Animation.
				 * @return {!Array<!SpriteSequence>} Collection.
				 */
				(out, v) => {
					// Do it by scene.
					/** @const {!Array<!Scene>} */
					const scenes = v.scenes.resolve();

					for (let i = 0; i < scenes.length; ++i) {
						/** @type {!number} */
						let repeat = scenes[i].frames.repeat;
						if (PoeSpriteLimits.repeatMax < repeat) {
							repeat = PoeSpriteLimits.repeatMax;
						}

						/** @type {number} */
						const repeatFrom = repeat ? scenes[i].frames.repeatFrom : 0;

						/** @type {string} */
						let name = v.name;
						if (0 < i) {
							name += ` (#${i + 1})`;
						}

						out.push(/** @type {!SpriteSequence} */ ({
							'id': `${v.id}_${i}`,
							'name': name,
							'speed': Math.floor(scenes[i].duration / scenes[i].frames.size),
							'repeat': repeat,
							'repeatFrom': repeatFrom,
							'frames': scenes[i].frames.frames,
						}));
					}

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
			/** @type {?number} */
			'timeout': null,
		};
	},

	/** @type {!Object<string, !VueProp>} */
	'props': {},

	/** @type {!Object} */
	'methods': {
		/**
		 * Add Frame
		 *
		 * @param {number} frame Frame.
		 * @return {void} Nothing.
		 */
		'addFrame': function(frame) {
			frame = parseInt(frame, 10) || 0;
			if (0 > frame) {
				this['frames'].push(0);
			}
			else if (SpriteInfo.EmptyTile < frame) {
				this['frames'].push(SpriteInfo.EmptyTile);
			}
			else {
				this['frames'].push(frame);
			}
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

			if (! this['frames'].length) {
				this['repeatFrom'] = 0;
				this['repeat'] = 0;
			}
			else if (this['frames'].length <= this['repeatFrom']) {
				this['repeatFrom'] = this['frames'].length - 1;
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
			this['timeout'] = null;

			// No change needed.
			if (0 > this['tick'] || 2 > this['playlist'].length) {
				return;
			}

			/** @type {number} */
			let tick = this['tick'] + 1;

			// Start over.
			if (this['playlist'].length <= tick) {
				tick = 0;
			}

			// Bump the frame as needed.
			Vue.nextTick(() => {
				this['tick'] = tick;
				this['timeout'] = setTimeout(() => {
					this['timeout'] = null;
					this['tickCycle']();
				}, this['speed']);
			});
		},
	},

	/** @type {!Object} */
	'computed': {
		/**
		 * Settings Errors
		 *
		 * @return {(boolean|!Array<string>)} Errors or false.
		 */
		'errors': function() {
			/** @type {!Array<string>} */
			let out = [];

			// Speed.
			if (PoeSpriteLimits.speedMin > this['speed']) {
				out.push(`Speed must be at least ${PoeSpriteLimits.speedMin}ms.`);
			}
			else if (PoeSpriteLimits.speedMax < this['speed']) {
				out.push(`Speed cannot exceed ${PoeSpriteLimits.speedMax}ms.`);
			}

			// Repeat.
			if (PoeSpriteLimits.repeatMin > this['repeat']) {
				out.push(`Repeat must be at least ${PoeSpriteLimits.repeatMin}.`);

				// Check repeat from only if we're repeating.

				/** @type {number} */
				const fromMax = this['frames'].length ? this['frames'].length - 1 : 0;

				if (PoeSpriteLimits.repeatMin > this['repeatFrom']) {
					out.push(`Repeat From must be at least ${PoeSpriteLimits.repeatMin}.`);
				}
				else if (fromMax < this['repeatFrom']) {
					out.push(`Repeat From cannot exceed ${fromMax}.`);
				}
			}
			else if (PoeSpriteLimits.repeatMax < this['repeat']) {
				out.push(`Repeat cannot exceed ${PoeSpriteLimits.repeatMax}.`);
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
			if (this['timeout']) {
				clearTimeout(this['timeout']);
				this['timeout'] = null;
			}

			if (! this['playlist'].length) {
				this['tick'] = -1;
			}
			else {
				Vue.nextTick(() => {
					this['tick'] = 0;
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
				PoeSpriteLimits.repeatMin > v
			) {
				this['repeat'] = PoeSpriteLimits.repeatMin;
			}
			else if (PoeSpriteLimits.repeatMax < v) {
				this['repeat'] = PoeSpriteLimits.repeatMax;
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
				PoeSpriteLimits.repeatMin > v
			) {
				this['repeatFrom'] = PoeSpriteLimits.repeatMin;
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
					v-for="f in ${SpriteInfo.XTiles * SpriteInfo.YTiles}"
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
							max="${PoeSpriteLimits.speedMax}"
							min="${PoeSpriteLimits.speedMin}"
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
							max="${PoeSpriteLimits.repeatMax}"
							min="${PoeSpriteLimits.repeatMin}"
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
							min="${PoeSpriteLimits.repeatMin}"
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
								<template v-if="repeat && index >= repeatFrom">
									<br><span class="infinity">∞</span>
								</template>
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
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
};