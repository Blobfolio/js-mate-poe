/**
 * @file Component: Poe Animation
 */

/* eslint-disable quote-props */
import { DRAGGING_ANIMATION, FALLING_ANIMATION, FLAGS } from './_animations.mjs';
import { MateAnimationStep, VueComponent, VueProp } from './_types.mjs';



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
		'variableDuration': {
			'type': Boolean,
			'required': false,
			'default': false,
		},

		/** @type {VueProp} */
		'startFrom': {
			'type': [Object, null],
			'required': false,
			'default': null,
		},

		/** @type {VueProp} */
		'start': {
			'type': Object,
			'required': true,
		},

		/** @type {VueProp} */
		'end': {
			'type': Object,
			'required': true,
		},

		/** @type {VueProp} */
		'repeat': {
			'type': Number,
			'required': false,
			'default': 0,
		},

		/** @type {VueProp} */
		'repeatFrom': {
			'type': Number,
			'required': false,
			'default': 0,
		},

		/** @type {VueProp} */
		'frames': {
			'type': Array,
			'required': true,
		},

		/** @type {VueProp} */
		'audio': {
			'type': [Object, null],
			'required': false,
			'default': null,
		},

		/** @type {VueProp} */
		'useDefault': {
			'type': Number,
			'required': false,
			'default': 0,
		},

		/** @type {VueProp} */
		'useEntrance': {
			'type': Number,
			'required': false,
			'default': 0,
		},

		/** @type {VueProp} */
		'useFirst': {
			'type': Number,
			'required': false,
			'default': 0,
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
		'hasAudio': function() {
			return null !== this['audio'] && 'string' === typeof this['audio']['file'];
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
			if (DRAGGING_ANIMATION === this['id'] || FALLING_ANIMATION === this['id']) {
				return true;
			}

			return ! this['useDefault'] &&
				! this['useFirst'] &&
				! this['useEntrance'];
		},

		/**
		 * Is Playable?
		 *
		 * @return {boolean} True/false.
		 */
		'isPlayable': function() {
			return !! (FLAGS.demoPlay & this['flags']);
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

			const length = this['steps'].length;
			let duration = 0;
			for (let i = 0; i < length; ++i) {
				duration += this['steps'][i].interval;
			}

			return new Intl.NumberFormat('en-US', {}).format(duration) + 'ms';
		},

		/**
		 * Speed
		 *
		 * @return {string} Speed.
		 */
		'speed': function() {
			const start = `${this['start']['speed']}ms`;
			const end = `${this['start']['speed']}ms`;

			if (start === end) {
				return start;
			}

			return `${start} – ${end}`;
		},

		/**
		 * Steps
		 *
		 * Calculate the animation steps.
		 *
		 * @return {Array<MateAnimationStep>} Steps.
		 */
		'steps': function() {
			let out = [];

			const framesLength = this['frames'].length;
			const stepsLength = framesLength + (framesLength + this['repeatFrom']) * this['repeat'];
			const speedDiff = this['end']['speed'] - this['start']['speed'];
			const xDiff = this['end']['x'] - this['start']['x'];
			const yDiff = this['end']['y'] - this['start']['y'];
			const now = 0;

			let last = 0 - this['start']['speed'];
			for (let i = 0; i < stepsLength; ++i) {
				const progress = i / stepsLength;
				const time = Math.floor(last + this['start']['speed'] + speedDiff * progress);
				const interval = time - last;
				last = time;

				// What frame should we show?
				/** @type {number} */
				let frame = 0;
				if (i < framesLength) {
					frame = this['frames'][i];
				}
				else if (! this['repeatFrom']) {
					frame = this['frames'][i % framesLength];
				}
				else {
					frame = this['frames'][this['repeatFrom'] + (i - this['repeatFrom']) % (framesLength - this['repeatFrom'])];
				}

				out.push(/** @type {!MateAnimationStep} */ ({
					'step': i,
					'time': now + time,
					'interval': interval,
					'frame': frame,
					'x': this['start']['x'] + xDiff * progress,
					'y': this['start']['y'] + yDiff * progress,
					'audio': null,
				}));
			}

			return out;
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
						v-if="hasAudio"
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
						v-if="0 < useFirst"
						class="animation-legend-icon"
						icon="startup"
						title="Startup Choice"
					></poe-icon>

					<poe-icon
						v-if="0 < useDefault"
						class="animation-legend-icon"
						icon="default"
						title="Default Choice"
					></poe-icon>

					<poe-icon
						v-if="0 < useEntrance"
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

					<div class="animation-legend-value">{{ speed }}</div>
				</div>

				<!-- Time. -->
				<div class="animation-legend">
					<poe-icon
						class="animation-legend-icon"
						icon="time"
						title="Playback Duration"
					></poe-icon>

					<div class="animation-legend-value">{{ duration }}</div>
				</div>
			</div><!-- .animation-legends -->

			<div
				class="frames-list"
				:class="{ 'is-repeatable' : repeat > 0 }"
			>
				<poe-frame
					v-for="(f, index) in frames"
					:key="'frame-' + id + '-' + index"
					:frame="f"
					:repeat="repeat > 0 && index >= repeatFrom"
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
					:values="[{ weight: 1, id: childId }]"
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
