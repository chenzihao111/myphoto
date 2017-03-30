module.exports = function(grunt) {
    
    grunt.initConfig({
        
         pkg : grunt.file.readJSON('package.json'),
         
         concat : {
             webqq : {
                 files : {
                     'dist/index.js' : ['../js/m.Tween.js','../js/index.js'],
                     'dist/index.css' : ['../bs/css/bootstrap.css','../bs/css/index.css']
                 }
             }
         },

         uglify : {
             webqq : {
                 files : {
                     'dist/index.min.js' : ['dist/index.js']
                 }
             }
         },

         cssmin : {
              webqq : {
                 files : {
                     'dist/index.min.css' : ['dist/index.css']
                 }
             }           
         }
        
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat','uglify','cssmin']);

    
};