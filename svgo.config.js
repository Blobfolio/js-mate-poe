module.exports = {
	multipass: true,
	plugins: [
		'cleanupAttrs',
		'cleanupEnableBackground',
		'cleanupListOfValues',
		'cleanupNumericValues',
		'collapseGroups',
		'convertColors',
		'convertEllipseToCircle',
		'convertPathData',
		'convertShapeToPath',
		'convertStyleToAttrs',
		'convertTransform',
		'inlineStyles',
		'mergePaths',
		'minifyStyles',
		'moveElemsAttrsToGroup',
		'removeComments',
		'removeDesc',
		'removeDimensions',
		'removeDoctype',
		'removeEditorsNSData',
		'removeEmptyAttrs',
		'removeEmptyContainers',
		'removeEmptyText',
		'removeHiddenElems',
		'removeMetadata',
		'removeNonInheritableGroupAttrs',
		'removeOffCanvasPaths',
		'removeRasterImages',
		'removeScriptElement',
		'removeStyleElement',
		'removeTitle',
		'removeUnknownsAndDefaults',
		'removeUnusedNS',
		'removeUselessDefs',
		'removeUselessStrokeAndFill',
		'removeXMLProcInst',
		{
			name: 'removeAttrs',
			params: {
				attrs: '(aria-label|font-face|font-family|font-size|font-style|font-variant|font-weight|letter-spacing|line-height|text-align|word-spacing)'
			},
		},
		{
			name: 'sortAttrs',
			params: {
				xmlnsOrder: 'alphabetical',
			},
		},
	],
};
