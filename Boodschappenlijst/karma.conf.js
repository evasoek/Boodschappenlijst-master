module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
		'Scripts/angular.js',
		'Scripts/angular-mocks.js',
        'Scripts/ngDialog.js',
		'Scripts/angular-route.js',
		'Scripts/angular-cookies.js',
        'Scripts/angular-resource.js',
		'Scripts/app.js',
		'Scripts/Controllers/*.js',
		'Scripts/Tests/*.js'
		
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
	captureTimeout: 60000,
    singleRun: false
  });
};
