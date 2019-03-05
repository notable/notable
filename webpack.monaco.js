
/* IMPORT */

const path = require ( 'path' );

/* CONFIG */

const config = {
	mode: 'production',
	entry: {
		'monaco.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
	},
	output: {
		globalObject: 'self',
		path: path.join ( __dirname, 'src', 'renderer', 'template', 'dist', 'javascript' )
	}
};

/* EXPORT */

module.exports = config;
