/**
 * @file Component: Poe Animation
 */

/* eslint-disable quote-props */
import { FLAGS, PLAYLIST } from './_animations.mjs';
import { MateAnimationScene, MateAnimationStep, VueComponent, VueProp } from './_types.mjs';



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
		'scene': {
			'type': [Array],
			'required': true,
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
			for (let i = 0; i < this['sceneLength']; ++i) {
				if (
					null !== this['scene'][i]['audio'] &&
					'string' === typeof this['scene'][i]['audio']['file']
				) {
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
			if (PLAYLIST.Drag === this['id'] || PLAYLIST.Fall === this['id']) {
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
		 * Duration
		 *
		 * @return {string} Duration.
		 */
		'duration': function() {
			if (this['variableDuration']) {
				return '(varies)';
			}

			/** @type {number} */
			const length = this['steps'].length;

			/** @type {number} */
			let duration = 0;
			for (let i = 0; i < length; ++i) {
				duration += this['steps'][i].interval;
			}

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
			for (let i = 0; i < this['sceneLength']; ++i) {
				/** @type {boolean} */
				const repeat = 0 < this['scene'][i]['repeat'];

				/** @type {number} */
				const repeatFrom = repeat ? this['scene'][i]['repeatFrom'] : 0;

				/** @type {number} */
				const length = this['scene'][i]['frames'].length;

				for (let j = 0; j < length; ++j) {
					out.push({
						'id': this['scene'][i]['frames'][j],
						'repeat': repeat && j >= repeatFrom,
						'flipped': false,
					});
				}
			}

			return out;
		},

		/**
		 * Scene Length
		 *
		 * @return {number} Length.
		 */
		'sceneLength': function() {
			return this['scene'].length;
		},

		/**
		 * Speed
		 *
		 * @return {string} Speed.
		 */
		'speed': function() {
			/** @type {Array<number>} */
			let soup = [];

			for (let i = 0; i < this['sceneLength']; ++i) {
				soup.push(this['scene'][i]['start']['speed']);
				soup.push(this['scene'][i]['end']['speed']);
			}

			/** @type {string} */
			const start = `${Math.min(...soup)}ms`;

			/** @type {string} */
			const end = `${Math.max(...soup)}ms`;

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
			/** @type {Array<MateAnimationStep>} */
			let out = [];

			/** @type {number} */
			const now = 0;

			/** @type {number} */
			let step = 0;

			/** @type {number} */
			let last = 0 - this['scene'][0]['start']['speed'];

			// Loop through the scenes.
			for (let i = 0; i < this['sceneLength']; ++i) {
				/** @type {MateAnimationScene} */
				const scene = this['scene'][i];

				/** @type {number} */
				const framesLength = scene['frames'].length;

				/** @type {number} */
				const stepsLength = framesLength + (framesLength - scene['repeatFrom']) * scene['repeat'];

				/** @type {number} */
				const speedDiff = scene['end']['speed'] - scene['start']['speed'];

				/** @type {number} */
				const xDiff = scene['end']['x'] - scene['start']['x'];

				/** @type {number} */
				const yDiff = scene['end']['y'] - scene['start']['y'];

				// Figure out what each slice should look like.
				for (let j = 0; j < stepsLength; ++j) {
					/** @type {number} */
					const progress = j / stepsLength;

					/** @type {number} */
					const time = Math.floor(last + scene['start']['speed'] + speedDiff * progress);

					/** @type {number} */
					const interval = time - last;

					last = time;

					// What frame should we show?
					/** @type {number} */
					let frame = 0;
					if (j < framesLength) {
						frame = scene['frames'][j];
					}
					else if (! scene['repeatFrom']) {
						frame = scene['frames'][j % framesLength];
					}
					else {
						frame = scene['frames'][scene['repeatFrom'] + (j - scene['repeatFrom']) % (framesLength - scene['repeatFrom'])];
					}

					out.push(/** @type {!MateAnimationStep} */ ({
						'step': step,
						'scene': i,
						'time': now + time,
						'interval': interval,
						'frame': frame,
						'x': scene['start']['x'] + xDiff * progress,
						'y': scene['start']['y'] + yDiff * progress,
						'audio': null,
						'flip': !! ((FLAGS.autoFlip & scene['flags']) && stepsLength - 1 === j),
						'flags': scene['flags'],
					}));

					++step;
				}
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
