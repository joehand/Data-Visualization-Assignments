//Building from treemap d3 example: http://bl.ocks.org/972398

/*
JSON Data format:
[
{
    "country_of_origin": "Japan", 
    "episode_count": "02900", 
    "episode_length": "45", 
    "finished_broadcasting": "", 
    "genre": "Music show", 
    "program_name": "Nodo Jiman(\u306e\u3069\u81ea\u6162)", 
    "seasons": "", 
    "started_broadcasting": "1953/03"
},
...
]
*/


var module = (function () {
	
	var my = {};
	
	my.init = function (nesting) {
		var format = d3.time.format("%Y/%m");

		var width = $(window).width() - 10,
		    height = $(window).height() - 100,
		    color = d3.scale.category20c();

		var treemap = d3.layout.treemap()
		    .size([width, height])
			.sticky(true)
		    .value(function(d) { return d.episode_count; });

		var svg = d3.select("#chart").append("svg")
		    .attr("width", width)
		    .attr("height", height)
		  .append("g")
		    .attr("transform", "translate(-.5,-.5)");


		d3.json('tv-data.json', function(json) {

			//Create a duration variable for each show
		 	json.forEach(function(d) {
		    	d.started_broadcasting = format.parse(d.started_broadcasting);
				if (d.finished_broadcasting !== '')
		    		d.finished_broadcasting = format.parse(d.finished_broadcasting);
				else
					d.finished_broadcasting = new Date();

			    d.duration = new Date(d.finished_broadcasting - d.started_broadcasting).getTime();
		  	});

			var data = {
				name: 'tv shows',
				children: _.nest(json, nesting).children //using underscore.nest (https://github.com/iros/underscore.nest)
			};

			console.log(data);

			//Add the cells to the treemap
			var cell = svg.data([data]).selectAll("g")
		      .data(treemap)
		    .enter().append("g")
		      .attr("class", "cell")
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			cell.append("rect")
			      .attr("width", function(d) { return d.dx; })
			      .attr("height", function(d) { return d.dy; })
			      .style("fill", function(d) { return d.children ? color(d.data.name) : null; })
				  .attr("title", function(d) { return d.children ? d.data.name : d.data.program_name; })

			cell
				  .attr('class', function(d) { return d.children ? escape(d.data.name) : null; })
				  .on('mouseover', function(d) { showLabel(d); return;})
				  .on('mouseout', hideLabel)

			var text = cell.append("text")
			      .attr("x", function(d) { return d.dx / 2; })
			      .attr("y", function(d) { return d.dy / 2; })
			      .attr("dy", ".35em")
			      .attr("text-anchor", "middle")
				  //is there a better way to do this?
			      .attr("class", function(d) { if(d.data.program_name && (d.dx < d.data.program_name.length * 6 || d.dy < 13)) return 'hide-label'; })
			      .text(function(d) { return d.children ? null : d.data.program_name; });    



		});

	};
	
	
	function showLabel(d) {
		//do something
		displayInfo(d);
	}

	function hideLabel() {
		//do something
		var box = d3.select("#info").html('');
	}	

	function displayInfo(d) {

		var box = d3.select("#info"),
			name = d.data.program_name,
			genre = d.data.genre,
			country = d.data.country_of_origin;

		var html = '<b>TV Show: </b>' + name;
			html += '<br/><b>Genre: </b>' + genre;
			html += '<br/><b>Country: </b>' + country;

	 	//update box with information
		box.html(html);
	}

	
	return my;
}());

		
	
module.init( ['country_of_origin', 'genre']);


d3.select("#country").on("click", function() {
	d3.selectAll('svg').remove();
   	module.init( ['country_of_origin', 'genre'])
 });
	

d3.select("#genre").on("click", function() {
	d3.selectAll('svg').remove();
   	module.init( ['genre', 'country_of_origin'])
 });

	
