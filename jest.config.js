module.exports = {
	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// The directory where Jest should output its coverage files
	coverageDirectory: "coverage",

	// An array of file extensions your modules use
	moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

	// The test environment that will be used for testing
	testEnvironment: "node",

	// A preset that is used as a base for Jest's configuration
	preset: "ts-jest",

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: ["\\\\node_modules\\\\"],
	coverageThreshold: {
		global: {
			lines: 65,
			branches: 65,
			functions: 65,
		},
	},

	testTimeout: 10000,
	modulePathIgnorePatterns: ["node_modules", "prod_node_modules"],

	// The glob patterns Jest uses to detect test files
	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],

	// An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
	testPathIgnorePatterns: ["\\\\node_modules\\\\", "\\\\lib\\\\"],
}
