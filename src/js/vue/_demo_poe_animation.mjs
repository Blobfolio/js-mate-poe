/**
 * @file Component: Poe Animation
 */

/* eslint-disable quote-props */
import { sceneSpeed } from '../_animations.mjs';
import {
	AnimationFlag,
	DemoFlag,
	Playlist,
	VueComponent,
	VueProp
} from '../_types.mjs';



/**
 * Component: Poe Animation
 *
 * @const {VueComponent}
 */
export const poeAnimation = {
	/**
	 * Data
	 *
	 * @return {Object} Data.
	 */
	'data': function() {
		return {
			'expanded': true,
		};
	},

	/** @type {Object<string, VueProp>} */
	'props': {
		/** @type {VueProp} */
		'id': {
			'type': Number,
			'required': true,
		},

		/** @type {VueProp} */
		'name': {
			'type': String,
			'required': true,
		},

		/** @type {VueProp} */
		'scenes': {
			'type': [Array],
			'required': true,
		},

		/** @type {VueProp} */
		'flags': {
			'type': Number,
			'required': false,
			'default': 0,
		},

		/** @type {VueProp} */
		'childId': {
			'type': Number,
			'required': false,
			'default': 0,
		},

		/** @type {VueProp} */
		'edge': {
			'type': [Array, null],
			'required': false,
			'default': null,
		},

		/** @type {VueProp} */
		'next': {
			'type': [Array, null],
			'required': false,
			'default': null,
		},
	},

	/** @type {Object} */
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

	/** @type {Object} */
	'computed': {
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
			return null !== this['edge'] && 0 < this['edge'].length;
		},

		/**
		 * Has Next?
		 *
		 * @return {boolean} True/false.
		 */
		'hasNext': function() {
			return null !== this['next'] && 0 < this['next'].length;
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
				! this['firstChoice'] &&
				! this['entranceChoice'];
		},

		/**
		 * Is Playable?
		 *
		 * @return {boolean} True/false.
		 */
		'isPlayable': function() {
			return !! (AnimationFlag.DemoPlay & this['flags']);
		},

		/**
		 * Is Repeatable?
		 *
		 * @return {boolean} True/false.
		 */
		'isRepeated': function() {
			/** @type {number} */
			const framesLength = this['frames'].length;

			for (let i = 0; i < framesLength; ++i) {
				if (this['frames'][i].repeat) {
					return true;
				}
			}

			return false;
		},

		/**
		 * Variable Duration
		 *
		 * @return {boolean} True/false.
		 */
		'variableDuration': function() {
			return !! (AnimationFlag.VariableDuration & this['flags']);
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
		 * Frames
		 *
		 * @return {Array} Frames.
		 */
		'frames': function() {
			/** @type {Array} */
			let out = [];

			// Loop the scenes.
			for (let i = 0; i < this['scenes'].length; ++i) {
				/** @type {boolean} */
				const repeat = null !== this['scenes'][i]['repeat'];

				/** @type {number} */
				const repeatFrom = repeat ? this['scenes'][i]['repeat'][1] : 0;

				for (let j = 0; j < this['scenes'][i]['frames'].length; ++j) {
					out.push({
						'id': this['scenes'][i]['frames'][j],
						'repeat': repeat && j >= repeatFrom,
						'flipped': false,
					});
				}
			}

			return out;
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
				const speed = sceneSpeed(this['scenes'][i]);

				if (speed < min) {
					min = speed;
				}
				if (speed > max) {
					max = speed;
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
		 * Default Choice
		 *
		 * @return {boolean} True/false.
		 */
		'defaultChoice': function() {
			return !! (DemoFlag.DefaultChoice & this['flags']);
		},

		/**
		 * Entrance Choice
		 *
		 * @return {boolean} True/false.
		 */
		'entranceChoice': function() {
			return !! (DemoFlag.EntranceChoice & this['flags']);
		},

		/**
		 * First Choice
		 *
		 * @return {boolean} True/false.
		 */
		'firstChoice': function() {
			return !! (DemoFlag.FirstChoice & this['flags']);
		},
	},

	/** @type {string} */
	'template': `
		<div
			class="animation"
			:id="'animation-' + id"
		>
			<h3 class="animation-title accent">
				<abbr
					class="animation-name"
					title="View Details"
				>{{ name }}</abbr>
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
				:class="{ 'is-repeatable' : isRepeated > 0 }"
			>
				<poe-frame
					v-for="(f, index) in frames"
					:key="'frame-' + id + '-' + index"
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
