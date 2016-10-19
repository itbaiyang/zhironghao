module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js_base: {
                options: {
                    separator: ';'
                },
                src: [
                    'js/vendor/jquery.min.js',
                    'js/vendor/angular.min.js',
                    'js/vendor/angular-animate.min.js',
                    'js/vendor/angular-route.min.js',
                    'js/qiniu/ajaxfileupload.js',
                    'js/qiniu/moment.js',
                    'js/qiniu/qiniu.min.js',
                    'js/qiniu/plupload.full.min.js',
                    'js/security/core.js',
                    'js/security/tripledes3.js',
                    'js/security/mode-ecb.js',
                ],
                dest: 'dist/base_<%= pkg.name %>.js'
            },
            js: {
                options: {
                    separator: ';'
                },
                src: [
                    'js/controller/*.js',
                    'js/app.js',
                    'js/ngTouch/*.js',
                    'js/animation.js',
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
                // mangle: false, //不混淆变量名
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/base_<%= pkg.name %>.min.<%= pkg.version %>.js': ['<%= concat.js_base.dest %>'],
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