/**
 * @file Vue Definitions
 */

/**
 * Vue App
 *
 * @typedef {{
	el: (!Element|string),
	data: !Object,
	mounted: !Function,
	methods: !Object,
	computed: !Object
 * }}
 */
export var VueApp;

/**
 * Vue Component
 *
 * @typedef {{
 	functional: (void|boolean),
 	data: (void|!Function),
	props: (void|!Object<string, !VueProp>),
	methods: (void|!Object<string, !Function>),
	computed: (void|!Object<string, !Function>),
	render: (void|!Function),
	template: (void|string)
 * }}
 */
export var VueComponent;

/**
 * Vue Property
 *
 * @typedef {{
	type: (!Function|!Array),
	required: boolean,
	default: (void|*)
 * }}
 */
export var VueProp;
