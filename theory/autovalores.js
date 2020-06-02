const{PI, atan2, exp} = Math;

var max_w =600;
var max_h = 600;
var margin = {top: 65, right: 30, bottom: 30, left: 60};
var width = max_w - margin.left - margin.right;
var height = max_h - margin.top - margin.bottom;
var xmin = -5;
var xmax = 5;
var ymin = -5;
var ymax = 5;
var x = d3.scaleLinear()
        .domain([xmin,xmax])
        .range([ 0, width ]);

var y = d3.scaleLinear()
          .domain([ymin,ymax])
          .range([ height, 0 ]);

function linspace(x0,xf,N){
    var delta = (xf - x0)/ (N-1) ;
    return  d3.range(N).map(function(i){return x0+i*delta;});
}

var plot = 'YAX';

var svg = d3.select("#"+plot)
.append("svg")
  .attr("width", max_w)
  .attr("height", max_h)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
 .attr("class", "axis")
 .attr("transform", "translate(0," + height/2 + ")")
 .call(d3.axisBottom(x));

/* svg.append("text")
.attr("transform",
"translate(" + (width/2) + " ," +
              (y(0)+30) + ")")
.style("text-anchor", "middle")
.text("t") */

svg.append("g")
 .attr("class", "axis")
 .attr("transform", "translate(" + width/2 + ",0)")
 .call(d3.axisLeft(y));

/* svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x",0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text("N(t)"); */