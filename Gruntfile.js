module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {

            js: {
                options: {
                    separator: ';'
                },
                src: [
                    //'js/ngTouch/ngTouchend.js',
                    //'js/ngTouch/ngTouchstart.js',
                    //'js/ngTouch/ngTouchmove.js',
                    'js/controller/article.js',
                    'js/controller/login.js',
                    'js/controller/register.js',
                    'js/controller/user.js',
                    'js/app.js',
                    'js/route.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            css: {
                src: [
                    ['css/*.css'],
                ],
                dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.css'
            }
        },
        cssmin: {
            css: {
                src:'dist/<%= pkg.name %>.<%= pkg.version %>.css',
                dest:'dist/<%= pkg.name %>.min.<%= pkg.version %>.css'
            }
        },
        uglify: {
            options: {
                mangle: false, //不混淆变量名
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.<%= pkg.version %>.js': ['<%= concat.js.dest %>']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-css');

    //grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('default', [ 'concat','uglify','cssmin']);
};