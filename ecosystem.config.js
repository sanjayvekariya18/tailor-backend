module.exports = {
	apps: [
		{
			name: "tailor-backend",
			script: "./dist/server.js",
			interpreter: "./node_modules/.bin/ts-node",
		},
	],
};
