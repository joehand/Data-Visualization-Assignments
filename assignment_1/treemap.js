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

var format = d3.time.format("%Y/%m");

var width = $(window).width(),
    height = $(window).height() - 100,
    color = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([width, height])
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
		children: _.nest(json, [ 'country_of_origin', 'genre']).children
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
	      .style("fill", function(d) { return d.children ? color(d.data.name) : null; });

	cell.append("text")
	      .attr("x", function(d) { return d.dx / 2; })
	      .attr("y", function(d) { return d.dy / 2; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .text(function(d) { return d.children ? null : d.data.program_name; });    
	
});

	
	
