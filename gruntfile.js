module.exports=function(grunt){
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		jshint:{
			target:{
				src:['public-dev/javascripts/**/*.js']
			},
			options:{
				eqeqeq:true,
				curly:true,
				undef:true,
				unused:true,
				browser:true,
				globals:{
					jquery:true,
					$:true,
					alert:true,
					devel:true,
					console:true
				},
			}
		},
		uglify:{
			options:{
				banner:'/*!<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			target:{	
				files:[{
					expand:true,
					cwd:'public-dev/javascripts',
					src:'**/*.js',
					dest:'public/javascripts',
					ext:'.min.js'
				}]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default',['jshint','uglify']);
};
