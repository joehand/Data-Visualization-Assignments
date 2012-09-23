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

var w = 1500,
    h = 1000,
    color = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([w + 1, h + 1])
    .children(function(d) { console.log(d);return isNaN(d.value) ? d3.entries(d.value) : null; })
    .value(function(d) {  return d.value; })
    .sticky(true);

var svg = d3.select("#shell").append("svg:svg")
    .style("width", w)
    .style("height", h)
  .append("svg:g")
    .attr("transform", "translate(-.5,-.5)");	
	
	
d3.json('tv-data.json', function(json) {
	
	
 	/*json.forEach(function(d) {
    	d.started_broadcasting = format.parse(d.started_broadcasting);
		if (d.finished_broadcasting !== '')
    		d.finished_broadcasting = format.parse(d.finished_broadcasting);
  	});*/
	
	var tvseries = d3.nest()
	      .key(function(d) { return d.country_of_origin.toLowerCase(); })
		  .key(function(d) { return d.genre.toLowerCase(); })
	      .sortKeys(d3.ascending)
	      .map(json);
	
	var data = {};

	//go down to show leaf and remake array to object
	$.each(tvseries, function(i, country) {
		
		var old_country = country;
		country = {};
		var countryName = '';
		
		$.each(old_country, function(j, genre) {
			var old_genre = genre;	
			genre = {};
			//make genre an empty object then fill with program_name: episode_count pairs
			$.each(old_genre, function(k, show){
				genre[show.program_name] = show.episode_count;
				genre['name'] = show.genre;
				countryName = show.country_of_origin;
			});
			country[genre['name']] = genre;
			delete genre['name'];
			
		});	
		
		data[countryName] = country;
		
		
	});
	
	
	
	console.log(data);
		
	
	
	var cell = svg.data(d3.entries(data)).selectAll("g")
		      .data(treemap)
		    .enter().append("svg:g")
		      .attr("class", "cell")
		      .attr("transform", function(d) {  return "translate(" + d.x + "," + d.y + ")"; });

		cell.append("svg:rect")
		      .attr("width", function(d) { return d.dx; })
		      .attr("height", function(d) { return d.dy; })
		      .style("fill", function(d) { return d.children ? color(d.data.key) : null; });
		
		
			cell.append("svg:text")
			      .attr("x", function(d) { return d.dx / 2; })
			      .attr("y", function(d) { return d.dy / 2; })
			      .attr("dy", ".35em")
			      .attr("text-anchor", "middle")
			      .text(function(d) { return d.children ? null : d.data.key; });
	
});

	
