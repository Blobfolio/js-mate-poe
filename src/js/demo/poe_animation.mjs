/**
 * @file Component: Poe Animation
 * @todo Handle flipping.
 */

/* eslint-disable quote-props */
import {
	Animation,
	AnimationFlag,
	Choice,
	Playlist,
	Scene,
	SceneFlag
} from '../core.mjs';
import { VueComponent, VueProp } from './vue.mjs';



/**
 * Component: Poe Animation
 *
 * @const {VueComponent}
 */
export const PoeAnimation = {
	/**
	 * Data
	 *
	 * @return {!Object} Data.
	 */
	'data': function() {
		return {
			'expanded': true,
		};
	},

	/** @type {!Object<string, !VueProp>} */
	'props': {
		/** @type {VueProp} */
		'id': {
			'type': Number,
			'required': true,
		},
	},

	/** @type {!Object} */
	'methods': {
		/**
		 * Play Animation
		 *
		 * @param {number} id ID.
		 * @return {void} Nothing.
		 */
		'playAnimation': function(id) {
			this['$root']['playAnimation'](id);
		},
	},

	/** @type {!Object} */
	'computed': {
		/**
		 * Animation
		 *
		 * @return {!Animation} Animation.
		 */
		'animation': function() {
			return this['$root']['animations'].find((v) => this['id'] === v['id']);
		},

		/**
		 * Child ID
		 *
		 * @return {?Playlist} Name.
		 */
		'childId': function() {
			return this['animation']['childId'];
		},

		/**
		 * Default Choice
		 *
		 * @return {boolean} True/false.
		 */
		'defaultChoice': function() {
			return !! (AnimationFlag.DefaultChoice & this['flags']);
		},

		/**
		 * Duration
		 *
		 * @return {string} Duration.
		 */
		'duration': function() {
			if (this['variableDuration']) {
				return '(varies)';
			}

			/** @type {number} */
			let duration = 0;
			for (let i = 0; i < this['scenes'].length; ++i) {
				duration += this['scenes'][i]['duration'];
			}

			// Display big numbers as seconds.
			if (1000 < duration) {
				duration = Math.floor(duration / 100) / 10;
				return new Intl.NumberFormat('en-US', {}).format(duration) + 's';
			}

			// Otherwise milliseconds will do.
			return new Intl.NumberFormat('en-US', {}).format(duration) + 'ms';
		},

		/**
		 * Edge
		 *
		 * @return {?Array<!Choice>} Name.
		 */
		'edge': function() {
			if (null === this['animation']['edge']) {
				return null;
			}

			return this['animation']['edge'].raw;
		},

		/**
		 * Entrance Choice
		 *
		 * @return {boolean} True/false.
		 */
		'entranceChoice': function() {
			return !! (AnimationFlag.EntranceChoice & this['flags']);
		},

		/**
		 * First Choice
		 *
		 * @return {boolean} True/false.
		 */
		'firstChoice': function() {
			return !! (AnimationFlag.FirstChoice & this['flags']);
		},

		/**
		 * Flags
		 *
		 * @return {number} Flags.
		 */
		'flags': function() {
			return this['animation']['flags'];
		},

		/**
		 * Frames
		 *
		 * @return {!Array} Frames.
		 */
		'frames': function() {
			/** @type {!Array} */
			let out = [];

			/** @type {boolean} */
			let flipX = !! (AnimationFlag.ReverseX & this['flags']);

			/** @type {boolean} */
			let flipY = !! (AnimationFlag.ReverseY & this['flags']);

			// Loop the scenes.
			for (let i = 0; i < this['scenes'].length; ++i) {
				/** @type {!Array<number>} */
				const frames = this['scenes'][i]['frames'].frames;

				/** @type {boolean} */
				const repeat = 0 < this['scenes'][i]['frames'].repeat;

				/** @type {number} */
				const repeatFrom = this['scenes'][i]['frames'].repeatFrom;

				for (let j = 0; j < frames.length; ++j) {
					out.push({
						'id': frames[j],
						'repeat': repeat && j >= repeatFrom,
						'flipX': flipX,
						'flipY': flipY,
					});

					if (
						(SceneFlag.FlipXAfter & this['scenes'][i].flags) &&
						(frames.length - 1 === j)
					) {
						flipX = ! flipX;
					}
					if (
						(SceneFlag.FlipYAfter & this['scenes'][i].flags) &&
						(frames.length - 1 === j)
					) {
						flipY = ! flipY;
					}
				}
			}

			return out;
		},

		/**
		 * Has Child?
		 *
		 * @return {boolean} True/false.
		 */
		'hasChild': function() {
			return 0 < this['childId'];
		},

		/**
		 * Has Edge?
		 *
		 * @return {boolean} True/false.
		 */
		'hasEdge': function() {
			return null !== this['edge'];
		},

		/**
		 * Has Next?
		 *
		 * @return {boolean} True/false.
		 */
		'hasNext': function() {
			return null !== this['next'];
		},

		/**
		 * Has Repeat?
		 *
		 * @return {boolean} True/false.
		 */
		'hasRepeat': function() {
			for (let i = 0; i < this['frames'].length; ++i) {
				if (this['frames'][i]['repeat']) {
					return true;
				}
			}

			return false;
		},

		/**
		 * Has Audio?
		 *
		 * @return {boolean} True/false.
		 */
		'hasSound': function() {
			for (let i = 0; i < this['scenes'].length; ++i) {
				if (null !== this['scenes'][i]['sound']) {
					return true;
				}
			}

			return false;
		},

		/**
		 * Has a Tree of Animations?
		 *
		 * @return {boolean} True/false.
		 */
		'hasTree': function() {
			return this['hasChild'] || this['hasEdge'] || this['hasNext'];
		},

		/**
		 * Is Dependent?
		 *
		 * @return {boolean} True/false.
		 */
		'isDependent': function() {
			// Dragging and falling are special.
			if (Playlist.Drag === this['id'] || Playlist.Fall === this['id']) {
				return true;
			}

			return ! this['defaultChoice'] &&
				! this['entranceChoice'] &&
				! this['firstChoice'];
		},

		/**
		 * Is Playable?
		 *
		 * @return {boolean} True/false.
		 */
		'isPlayable': function() {
			return !! (AnimationFlag.DirectPlay & this['flags']);
		},

		/**
		 * Name
		 *
		 * @return {string} Name.
		 */
		'name': function() {
			return this['animation']['name'];
		},

		/**
		 * Next
		 *
		 * @return {?Array<!Choice>} Name.
		 */
		'next': function() {
			if (null === this['animation']['next']) {
				return null;
			}

			return this['animation']['next'].raw;
		},

		/**
		 * Scenes
		 *
		 * @return {!Array<!Scene>} Scenes.
		 */
		'scenes': function() {
			return this['animation']['scenes'].resolve();
		},

		/**
		 * Speed
		 *
		 * @return {string} Speed.
		 */
		'speed': function() {
			/** @type {number} */
			let min = 9999999999;

			/** @type {number} */
			let max = 0;

			for (let i = 0; i < this['scenes'].length; ++i) {
				/** @const {number} */
				const speed = Math.floor(this['scenes'][i]['duration'] / this['scenes'][i]['frames'].size);

				// Some of our variable animations might get screwy.
				if (0 < speed) {
					if (speed < min) {
						min = speed;
					}
					if (speed > max) {
						max = speed;
					}
				}
			}

			/** @type {string} */
			const start = `${min}ms`;

			/** @type {string} */
			const end = `${max}ms`;

			if (start === end) {
				return start;
			}

			return `${start} – ${end}`;
		},

		/**
		 * Variable Duration
		 *
		 * @return {boolean} True/false.
		 */
		'variableDuration': function() {
			return !! (AnimationFlag.VariableDuration & this['flags']);
		},

	},

	/** @type {string} */
	'template': `
		<div
			class="animation"
			:id="'animation-' + id"
		>
			<h3 class="animation-title accent">
				<a
					class="animation-name"
					:href="'#animation-' + id"
				>{{ name }}</a>
				<span class="animation-id">#{{ id }}</span>
			</h3>

			<div class="animation-legends">
				<!-- Main attributes. -->
				<div class="animation-legend">
					<poe-icon
						v-if="isPlayable"
						class="animation-legend-icon play-toggle"
						icon="play"
						title="Play Animation"
						v-on:click.prevent="playAnimation(id)"
					></poe-icon>

					<poe-icon
						v-if="hasSound"
						class="animation-legend-icon"
						icon="audio"
						title="Makes Noise"
					></poe-icon>

					<poe-icon
						v-if="isDependent"
						class="animation-legend-icon"
						icon="link"
						title="Dependent Animation"
					></poe-icon>

					<poe-icon
						v-if="firstChoice"
						class="animation-legend-icon"
						icon="startup"
						title="Startup Choice"
					></poe-icon>

					<poe-icon
						v-if="defaultChoice"
						class="animation-legend-icon"
						icon="default"
						title="Default Choice"
					></poe-icon>

					<poe-icon
						v-if="entranceChoice"
						class="animation-legend-icon"
						icon="offscreen"
						title="Offscreen Choice"
					></poe-icon>
				</div>

				<!-- Speed. -->
				<div class="animation-legend">
					<poe-icon
						class="animation-legend-icon"
						icon="speed"
						title="Playback Speed"
					></poe-icon>

					<div class="animation-legend-value is-lower">{{ speed }}</div>
				</div>

				<!-- Time. -->
				<div class="animation-legend">
					<poe-icon
						class="animation-legend-icon"
						icon="time"
						title="Playback Duration"
					></poe-icon>

					<div class="animation-legend-value is-lower">{{ duration }}</div>
				</div>
			</div><!-- .animation-legends -->

			<div
				class="frames-list"
				:class="{ 'is-repeatable' : hasRepeat }"
			>
				<poe-frame
					v-for="(f, index) in frames"
					:key="'frame-' + id + '-' + index"
					:flipX="f.flipX"
					:flipY="f.flipY"
					:frame="f.id"
					:repeat="f.repeat"
				></poe-frame>
			</div>

			<div
				class="animation-trees"
				v-if="hasTree && expanded"
			>
				<poe-tree
					v-if="hasChild"
					:key="'tree-child-' + id"
					trunk="Child"
					:values="[[childId, 1]]"
				></poe-tree>

				<poe-tree
					v-if="hasNext"
					:key="'tree-next-' + id"
					trunk="Next"
					:values="next"
				></poe-tree>

				<poe-tree
					v-if="hasEdge"
					:key="'tree-edge-' + id"
					trunk="Edge"
					:values="edge"
				></poe-tree>
			</div>
		</div>
	`,
};
