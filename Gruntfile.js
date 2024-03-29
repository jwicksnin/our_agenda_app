'use strict';
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-mongoimport');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: ['build'],
      dev: {
        src: ['build/app.js', 'build/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
      },
      prod: ['dist']
    },
    copy: {
      prod: {
        expand: true,
        cwd: 'assets',
        src: ['css/*.css', '*.html', 'images/**/*' ],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      },
      dev: {
        expand: true,
        cwd: 'assets',
        src: ['css/*.css', '*.html', 'images/**/*' ],
        dest: 'build/',
        flatten: false,
        filter: 'isFile'
      }
    },
    browserify: {
      prod: {
        src: ['assets/js/*.js'],
        dest: 'dist/browser.js',
        options: {
          transform: ['debowerify'],
          debug: false
        }
      },
      dev: {
        src: ['assets/js/*.js'],
        dest: 'build/a.js',
        options: {
          transform: ['debowerify'],
          debug: true
        }
      }
    },
    simplemocha:{
      dev:{
        src:['test/*_test.js'],
        options:{
          reporter: 'spec',
          slow: 200,
          timeout: 1000
        }
      }
    },
    watch:{
      all:{
        files:['app.js', '**/*.js'],
        tasks:['jshint']
      },
      express: {
        files: ['app.js', 'models/**/*.js', 'routes/**/*.js','assets/**/*'],
        tasks: ['sass:dev', 'browserify:dev', 'express:dev'],
        options: {
          spawn: false
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'app.js', 'models/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true,
        globals: {
          console: true,
          module: true
        }
      }
    },
    casper: {
      acceptance : {
        options : {
          test : true
        },
        files : {
          'test/acceptance/casper-results.xml' : ['test/acceptance/*_test.js']
        }
      }
    },
    express: {
      options : {
        /*will be something*/
      },
      dev: {
        options: {
          script: 'app.js'
        }
      },
      prod: {
        options: {
          script: 'app.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'app.js'
        }
      }
    },
    sass: {
      dist: {
        files: {'build/css/styles.css': 'assets/scss/styles.scss'}
      },
      dev: {
        options: {
          includePaths: ['public/scss/'],
          sourceComments: 'map'
        },
        files: {'build/css/styles.css': 'assets/scss/styles.scss'}
      }
    },
    mongoimport: {
      options: {
        db : 'oaa',
        //optional
        //host : 'localhost',
        //port: '27017',
        //username : 'username',
        //password : 'password',
        //stopOnError : false,
        collections : [
          {
            name : 'user',
            type : 'json',
            file : 'db/seeds/users.json',
            jsonArray : true,  //optional
            upsert : true,  //optional
            drop : true  //optional
          },
          {
            name : 'meetings',
            type :'json',
            file : 'db/seeds/meetings.json',
            jsonArray : true,
            upsert : true,
            drop : true
          }
        ]
      }
    }
  });

  grunt.registerTask('build:dev',  ['clean:dev', 'sass:dev', 'browserify:dev', 'jshint:all', 'copy:dev']);
  grunt.registerTask('build:prod', ['clean:prod', 'browserify:prod', 'jshint:all', 'copy:prod']);
  grunt.registerTask('test', ['jshint', 'simplemocha:dev']);
  //grunt.registerTask('watch', ['test', 'watch:all']);
  grunt.registerTask('test:acceptance', ['express:dev','casper']);
  grunt.registerTask('server', [ 'build:dev', 'express:dev', 'watch:express' ]);
  grunt.registerTask('default', ['jshint', 'test', 'watch:express']);

};
