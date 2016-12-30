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
                    'js/vendor/ionic.bundle.min.js',
                    // 'js/vendor/angular.min.js',
                    // 'js/vendor/angular-animate.min.js',
                    'js/vendor/angular-route.min.js',
                    'js/vendor/mobiscroll.custom-2.16.1.min.js',
                    'js/qiniu/ajaxfileupload.js',
                    'js/qiniu/moment.js',
                    'js/qiniu/qiniu.min.js',
                    'js/qiniu/plupload.full.min.js',
                    'js/security/core.js',
                    'js/security/tripledes3.js',
                    'js/security/mode-ecb.js'
                ],
                dest: 'dist/base_<%= pkg.name %>.js'
            },
            js_h5: {
                options: {
                    separator: ';'
                },
                src: [
                    'html5/scb/kj/jquery.min.js',
                    'html5/scb/kj/hammer.js',
                    'html5/scb/kj/jquery.hammer.js',
                    'html5/scb/kj/carousel.js',
                ],
                dest: 'dist/js_h5.js'
            },
            js: {
                options: {
                    separator: ';'
                },
                src: [
                    'js/controller/*.js',
                    'js/app.js',
                    'js/animation.js',
                    'js/ngTouch/*.js',
                    'js/route.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            css: {
                src: [
                    [
                        'css/scroll/mobiscroll.custom-2.16.1.min.css',
                        'css/scroll/ionic.css',
                        'css/*.css'
                    ]
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
                    'dist/base_<%= pkg.name %>.min.<%= pkg.version %>.js': ['<%= concat.js_base.dest %>'],
                    'dist/<%= pkg.name %>.min.<%= pkg.version %>.js': ['<%= concat.js.dest %>'],
                    'dist/js_h5.min.js': ['<%= concat.js_h5.dest %>'],
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