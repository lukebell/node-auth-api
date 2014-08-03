module.exports = function (grunt)
{
    /* project configuration */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        vows: {
            all: {
                options: {
                    // String {spec|json|dot-matrix|xunit|tap} defaults to "dot-matrix"
                    reporter: "spec",
                    // Boolean, defaults to false
                    verbose: true,
                    // Boolean, defaults to false
                    silent: false,
                    // Colorize reporter output, boolean, defaults to true
                    colors: true,
                    // Run each test in its own vows process, defaults to false
                    isolate: false,
                    // String {plain|html|json|xml} defaults to none
                    coverage: "html"
                },
                // String or array of strings determining which files to include. This option is grunt's "full" file format.
                src: ["test/*-test.js"]
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'target/node-auth-api.zip'
                },
                files: [
                    {src: ['commons/**'], dest: ''},
                    {src: ['domain/**'], dest: ''},
                    {src: ['node_modules/**'], dest: ''},
                    {src: ['routes/**'], dest: ''},
                    {src: ['test/**'], dest: ''},
                    {src: ['*'], dest: '/'}
                ]
            }
        },
        shell: {
            testCoverage: {
                command: 'istanbul cover vows'
            }
        }
    });

    /* Load the plugin that provides the "uglify" task. */
    grunt.loadNpmTasks('grunt-contrib-uglify');

    /* Load the plugin that provides BDD style testing through vows */
    grunt.loadNpmTasks("grunt-vows");

    /* Load the plugin that compress project */
    grunt.loadNpmTasks('grunt-contrib-compress');

    /* Load the plugin to run shell commands */
    grunt.loadNpmTasks('grunt-shell');

    /* default tasks */
    grunt.registerTask('default', ['compress', 'vows', 'shell']);

    /* test task */
    grunt.registerTask('test', ['vows','shell']);

};