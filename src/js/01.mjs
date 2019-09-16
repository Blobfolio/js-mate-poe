/**
 * @file Animation debug table.
 */

import { ANIMATIONS, DEFAULT_CHOICES, DRAGGING_ANIMATION, FALLING_ANIMATION, OFFSCREEN_CHOICES, STARTUP_CHOICES } from './animations.mjs';
import { DEBUG_CSS } from './css.mjs';
import { RawMateAnimation } from './types.mjs';



// ---------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------

/**
 * Demo Animation
 *
 * @typedef {{
	id: number,
	name: string,
	type: string,
	play: boolean,
	audio: boolean,
	default: number,
	offscreen: number,
	startup: number,
	link: boolean,
	next: Array<number>,
	edge: Array<number>,
	mate: Array<number>,
	repeat: boolean,
	frames: Array<Element>
 * }}
 */
var DemoAnimation;

/* eslint-disable */
/**
 * Type Ordering
 *
 * @type {Object<string, number>}
 */
const typeOrder = {
	'primary': 1,
	'conditional': 2,
	'other': 3,
};
/* eslint-enable */

/**
 * Total Default Weight
 *
 * @type {number}
 */
const _defaultTotal = DEFAULT_CHOICES.reduce((out, v) => {
	if ('number' === typeof v) {
		++out;
	}
	else if (
		'number' === typeof v.weight &&
		0 < v.weight
	) {
		out += v.weight;
	}

	return out;
}, 0);

/**
 * Total Offscreen Weight
 *
 * @type {number}
 */
const _offscreenTotal = OFFSCREEN_CHOICES.reduce((out, v) => {
	if ('number' === typeof v) {
		++out;
	}
	else if (
		'number' === typeof v.weight &&
		0 < v.weight
	) {
		out += v.weight;
	}

	return out;
}, 0);

/**
 * Total Startup Weight
 *
 * @type {number}
 */
const _startupTotal = STARTUP_CHOICES.reduce((out, v) => {
	if ('number' === typeof v) {
		++out;
	}
	else if (
		'number' === typeof v.weight &&
		0 < v.weight
	) {
		out += v.weight;
	}

	return out;
}, 0);

/**
 * Animations
 *
 * @type {Array<DemoAnimation>}
 */
const _animations = Object.values(/** @type {!RawMateAnimation} */ (ANIMATIONS)).reduce((out, v) => {
	/** @type {DemoAnimation} */
	let tmp = {
		id: v.id,
		name: v.name,
		type: 'other',
		play: false,
		audio: (null !== v.audio && 'string' === typeof v.audio.file),
		default: v.defaultChoice / _defaultTotal,
		offscreen: v.offscreenChoice / _offscreenTotal,
		startup: v.startupChoice / _startupTotal,
		link: false,
		next: [],
		edge: [],
		mate: [],
		repeat: 0 !== v.repeat,
		frames: [],
	};

	// Can we trigger this animation?
	if (
		v.defaultChoice ||
		(
			v.startupChoice &&
			(
				(21 === v.id) ||
				(28 === v.id) ||
				(54 === v.id) ||
				(63 === v.id)
			)
		)
	) {
		// Note that we can trigger the animation.
		tmp.play = true;

		// This makes the type primary.
		tmp.type = 'primary';
	}
	// Special types?
	else if (
		v.startupChoice ||
		v.offscreenChoice ||
		FALLING_ANIMATION === v.id ||
		DRAGGING_ANIMATION === v.id
	) {
		tmp.type = 'conditional';
	}

	// Is this a link?
	tmp.link = 'other' === tmp.type;

	// Is there a next?
	if ('number' === typeof v.next) {
		tmp.next.push(v.next);
	}
	else if (Array.isArray(v.next) && v.next.length) {
		for (let j = 0; j < v.next.length; ++j) {
			if ('number' === typeof v.next[j]) {
				tmp.next.push(v.next[j]);
			}
			else if ('number' === typeof v.next[j].id) {
				tmp.next.push(v.next[j].id);
			}
		}
	}
	tmp.next.sort(function(a, b) {
		return a < b ? -1 : 1;
	});

	// Is there a edge?
	if ('number' === typeof v.edge) {
		tmp.edge.push(v.edge);
	}
	else if (Array.isArray(v.edge) && v.edge.length) {
		for (let j = 0; j < v.edge.length; ++j) {
			if ('number' === typeof v.edge[j]) {
				tmp.edge.push(v.edge[j]);
			}
			else if ('number' === typeof v.edge[j].id) {
				tmp.edge.push(v.edge[j].id);
			}
		}
	}
	tmp.edge.sort(function(a, b) {
		return a < b ? -1 : 1;
	});

	// Is there a child?
	if (v.childId) {
		tmp.mate.push(v.childId);
	}

	// Get the frames settled.
	const framesLength = v.frames.length;
	const repeat = v.repeat ? v.repeatFrom : 9999;
	for (let i = 0; i < framesLength; ++i) {
		let frame = document.createElement('DIV');
		frame.title = `Frame #${v.frames[i]}`;
		frame.className = `poe-demo-frame f${v.frames[i]}`;
		if (i >= repeat) {
			frame.className += ' is-repeated';
		}

		tmp.frames.push(frame);
	}

	out.push(tmp);
	return out;
}, []).sort(function(a, b) {
	const a_key = typeOrder[a.type] + '_' + a.name.toLowerCase().trim();
	const b_key = typeOrder[b.type] + '_' + b.name.toLowerCase().trim();

	return a_key < b_key ? -1 : 1;
});




// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/**
 * Make Table
 *
 * @return {void} Nothing.
 */
const build = function() {
	// Poe must be present.
	if (
		! ('Poe' in window) ||
		! document.getElementById('poe-demo') ||
		! document.getElementById('poe-demo-body')
	) {
		console.error('This script is only used for the demo. Your project only requires js-mate-poe.min.js!');
		return;
	}

	// Add the style sheet.
	/** @type {Element} */
	const parent = document.head || document.body;

	/** @type {Element} */
	let style = document.createElement('STYLE');
	style.type = 'text/css';
	style.id = 'poe-demo-css';

	style.appendChild(document.createTextNode(DEBUG_CSS));
	parent.appendChild(style);

	// Populate the table rows.
	/** @type {Element} */
	const tbody = document.getElementById('poe-demo-body');

	const animationsLength = _animations.length;
	for (let i = 0; i < animationsLength; ++i) {
		/** @type {DemoAnimation} */
		const animation = _animations[i];

		/** @type {Element} */
		let row = document.createElement('TR');
		row.className = `poe-demo-row is-${animation.type}`;

		/** @type {?Element} */
		let cell = null;

		// Should we play anything?
		if (animation.play) {
			cell = makeIcon('play');
			cell.addEventListener('click', (e) => {
				e.preventDefault();
				window['Poe']['setAnimation'](animation.id);
			});
			row.appendChild(makeTableCell(cell, 'play'));
		}
		else {
			row.appendChild(makeTableCell(null, 'play'));
		}

		// The ID.
		cell = makeTableCell(`#${animation.id}`, 'id');
		cell.id = `poe-demo-animation-${animation.id}`;
		row.appendChild(cell);

		// The name.
		cell = makeTableCell(animation.name, 'name');
		row.appendChild(cell);

		// Is this a default animation?
		cell = makeIcon('default');
		if (animation.default) {
			cell.title = `Probability: ${Math.round(animation.default * 1000) / 10}%`;
		}
		else {
			cell.className += ' is-inactive';
		}
		row.appendChild(makeTableCell(cell, 'default'));

		// Is this a startup animation?
		cell = makeIcon('startup');
		if (animation.startup) {
			cell.title = `Probability: ${Math.round(animation.startup * 1000) / 10}%`;
		}
		else {
			cell.className += ' is-inactive';
		}
		row.appendChild(makeTableCell(cell, 'startup'));

		// Is this a offscreen animation?
		cell = makeIcon('offscreen');
		if (animation.offscreen) {
			cell.title = `Probability: ${Math.round(animation.offscreen * 1000) / 10}%`;
		}
		else {
			cell.className += ' is-inactive';
		}
		row.appendChild(makeTableCell(cell, 'offscreen'));

		// Is this dependent?
		cell = makeIcon('link');
		if (! animation.link) {
			cell.className += ' is-inactive';
		}
		row.appendChild(makeTableCell(cell, 'link'));

		// Does this make noise?
		cell = makeIcon('audio');
		if (! animation.audio) {
			cell.className += ' is-inactive';
		}
		row.appendChild(makeTableCell(cell, 'audio'));

		// The chain.
		cell = document.createElement('DIV');
		cell.className = 'poe-demo-chains';

		if (animation.next.length) {
			cell.appendChild(makeChain(animation.next, 'Next'));
		}
		if (animation.edge.length) {
			cell.appendChild(makeChain(animation.edge, 'Edge'));
		}
		if (animation.mate.length) {
			cell.appendChild(makeChain(animation.mate, 'Child'));
		}

		row.appendChild(makeTableCell(cell, 'chain'));

		// Add the row.
		tbody.appendChild(row);

		// Start a new row for the frames.
		row = document.createElement('TR');
		row.className = `poe-demo-row for-frames is-${animation.type}`;

		// Give us a buffer.
		cell = document.createElement('TD');
		cell.setAttribute('colspan', '2');
		cell.className = 'poe-demo-col for-buffer';
		row.appendChild(cell);

		// The frames need a bit of calculation.
		/** @type {Element} */
		let frames = document.createElement('DIV');
		frames.className = 'poe-demo-frames';
		if (animation.repeat) {
			frames.className += ' is-repeatable';
		}

		const framesLength = animation.frames.length;
		for (let j = 0; j < framesLength; ++j) {
			frames.appendChild(animation.frames[j]);
		}

		cell = makeTableCell(frames, 'frames');
		cell.setAttribute('colspan', '7');
		row.appendChild(cell);

		// Add it too!
		tbody.appendChild(row);
	}
};

/**
 * Make Table Cell
 *
 * @param {string|null|Element|Text} el Child element.
 * @param {string} col Column name.
 * @return {Element} Element.
 */
const makeTableCell = function(el, col) {
	// Make it a proper element if needed.
	if (null === el || ! el) {
		el = document.createTextNode('');
	}
	else if ('string' === typeof el) {
		el = document.createTextNode(el);
	}

	/** @type {Element} */
	let cell = document.createElement('TD');
	cell.className = `poe-demo-col for-${col}`;
	cell.appendChild(/** @type {Element|Text} */ (el));
	return cell;
};

/**
 * Make Icon
 *
 * @param {string} icon Icon.
 * @return {Element} Element.
 */
const makeIcon = function(icon) {
	/** @type {Element} */
	let el = document.createElement('DIV');
	el.className = `poe-icon is-${icon}`;
	el.innerHTML = `<svg><use xlink:href="#i-${icon}"></use></svg>`;
	return el;
};

/**
 * Make Chain
 *
 * @param {Array<number>} links Links.
 * @param {string} name Name.
 * @return {Element} Element.
 */
const makeChain = function(links, name) {
	/** @type {Element} */
	let cell = document.createElement('DIV');
	cell.className = 'poe-demo-chain';

	/** @type {Element} */
	let label = document.createElement('SPAN');
	label.className = 'poe-demo-chain-name';
	label.innerText = `${name}:`;
	cell.appendChild(label);

	const length = links.length;
	for (let i = 0; i < length; ++i) {
		let link = document.createElement('A');
		link.href = `#poe-demo-animation-${links[i]}`;
		link.className = 'poe-demo-chain-link';
		link.innerText = links[i];
		cell.appendChild(link);
	}

	return cell;
};



// ---------------------------------------------------------------------
// Do It Now
// ---------------------------------------------------------------------

build();
