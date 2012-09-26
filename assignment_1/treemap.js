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

	var width = window.innerWidth  - 250,
	    height = window.innerHeight - 100,
	    color = d3.scale.category20c();	

	var tooltip = d3.select("body")
		.append("div")
		.attr('class', 'tooltip')
		.style("position", "absolute")
		.style("z-index", "5")
		.style("visibility", "hidden");

	
	my.init = function (nesting) {

		var treemap = d3.layout.treemap()
		    .size([width, height])
			.sticky(true)
		    .value(function(d) { return d.episode_count; });
		
		
		var svg = d3.select("#chart").append("svg")
		    	.attr("width", width)
		    	.attr("height", height)
				.on("mouseover", function(){ return tooltip.style("visibility", "visible");})
				.on("mouseout", function(){ return tooltip.style("visibility", "hidden");})
		  	.append("g")
		    	.attr("transform", "translate(-.5,-.5)")
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});


		d3.json('tv-data.json', function(json) {
			
			//clean data for capitalization differences
			_.each(json, function(data) {
				data.genre = data.genre.toLowerCase();
				data.country_of_origin = data.country_of_origin.toLowerCase();
			})

			var data = {
				name: 'tv shows',
				root: true,
				children: _.nest(json, nesting).children //using underscore.nest (https://github.com/iros/underscore.nest)
			};


			//Add the cells to the treemap
			var cell = svg.data([data]).selectAll("g")
		      			.data(treemap)
		    		.enter().append("g")
		      			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			  			.attr('class', function(d) { 
							if (d.parent && d.children)
								return d.parent.data.root ? d.data.name : d.parent.data.name;
							else if (!d.children)
								return d.parent.parent.data.name;
							})
			  			.on('mouseover', function(d) { updateLabel(d); return;});

			cell.append("rect")
			      .attr("width", function(d) { return d.dx; })
			      .attr("height", function(d) { return d.dy; })
			      .style("fill", function(d) { return d.children ? color(d.data.name) : null; })
				  .attr("title", function(d) { return d.children ? d.data.name : d.data.program_name; })

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

	
	function updateLabel(d) {
		var name = d.data.program_name,
			genre = d.data.genre,
			country = d.data.country_of_origin;

		var html = '<b>TV Show: </b>' + name;
			html += '<br/><b>Genre: </b>' + genre;
			html += '<br/><b>Country: </b>' + country;

	 	//update box with information
		tooltip.html(html);
	}
	
	return my;
}());

		
//Start everything up with default nesting.	
module.init( ['country_of_origin', 'genre']);


//Change nesting
d3.select("#country").on("click", function() {
	d3.selectAll('svg').remove();
   	module.init( ['country_of_origin', 'genre']);

	d3.select("#country").classed("active", true);
	d3.select("#genre").classed("active", false);
 });
	

d3.select("#genre").on("click", function() {
	d3.selectAll('svg').remove();
   	module.init( ['genre', 'country_of_origin']);

	d3.select("#genre").classed("active", true);
	d3.select("#country").classed("active", false);
 });

	
