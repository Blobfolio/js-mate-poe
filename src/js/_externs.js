/**
 * @file Externs.
 */



/**
 * Vue Component
 *
 * @typedef {{
 	functional: (void|boolean),
 	data: (void|Function),
	props: (void|Object<string, VueProp>),
	methods: (void|Object<string, Function>),
	computed: (void|Object<string, Function>),
	render: (void|Function),
	template: (void|string)
 * }}
 */
var VueComponent;

/**
 * Vue Property
 *
 * @typedef {{
	type: (Function|Array),
	required: boolean,
	default: (void|*)
 * }}
 */
var VueProp;

/**
 * Vue App
 *
 * @typedef {{
	el: (Element|string),
	data: Object,
	mounted: Function,
	methods: Object,
	computed: Object
 * }}
 */
var VueApp;

/**
 * Vue
 *
 * @constructor
 * @param {VueApp} opts Options.
 * @return {void} Nothing.
 */
var Vue = function(opts){};

/**
 * Vue Component
 *
 * @param {string} title Title.
 * @param {VueComponent} component Component.
 * @return {void} Nothing.
 */
Vue.component = function(title, component){};

/**
 * Vue Tick
 *
 * @param {Function} cb Callback.
 * @return {void} Nothing.
 */
Vue.nextTick = function(cb){};
