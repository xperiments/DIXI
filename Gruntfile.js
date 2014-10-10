module.exports = function (grunt) {

    grunt.initConfig(
        {
            ts:
            {
                main: {
                    src: [
                        "./src/**/*.ts"
                    ],
                    reference: "./src/reference.ts",  // If specified, generate this file that you can use for your reference management
                    html:['./src/templates/**/*.html'],
                    //watch: './ts',                     // If specified, watches this directory for changes, and re-runs the current target
                    out:'./bin/DIXI.js',
                    options: {                         // use to override the default options, http://gruntjs.com/configuring-tasks#options
                        target: 'es5',                 // 'es3' (default) | 'es5'
                        module: 'commonjs',            // 'amd' (default) | 'commonjs'
                        sourceMap: false,               // true (default) | false
                        declaration: false,            // true | false (default)
                        removeComments: true,           // true (default) | false
                        fast:"never",
                        compiler: '/usr/local/lib/node_modules/TypeScript/bin/tsc'
                    }
                }
            },
            watch: {
                main: {
                    files: ['./src/**/*.ts'],
                    tasks: ['ts:main','connect'],
//                    options:{
//                        livereload:true
//                    }
                }
            },
            connect: {
                server: {
                    options: {
                        port: 8080,
                        base: 'tests'
                    }
                }
            }

        });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.registerTask("default", ["ts:main","connect","watch"]);

}