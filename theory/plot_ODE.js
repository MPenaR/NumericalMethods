var max_w = 460;
var max_h = 400;
var margin = {top: 10, right: 30, bottom: 30, left: 60};
var width = max_w - margin.left - margin.right;
var height = max_h - margin.top - margin.bottom;

var x = d3.scaleLinear()
        .domain([0,1])
        .range([ 0, width ]);

var y = d3.scaleLinear()
          .domain([0,1])
          .range([ height, 0 ]);

svg = d3.select("#ODE")
        .append("svg")
          .attr("width", max_w)
          .attr("height", max_h)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

svg.append("g")
   .call(d3.axisLeft(y));

function linspace(x0,xf,N){
 var delta = (xf - x0)/ (N-1) ;
 return  d3.range(N).map(function(i){return x0+i*delta;});
}


var Nf  = 15 ;

var x_coords = linspace(0,1,Nf);
var y_coords = linspace(0,1,Nf);


var X = new Array(Nf);
var Y = new Array(Nf);
var Vx = new Array(Nf);
var Vy = new Array(Nf);

var lambda = 0.02;
for (i=0; i<Nf; i++){
  X[i] = new Array(Nf);
  Y[i] = new Array(Nf);
  Vx[i] = new Array(Nf);
  Vy[i] = new Array(Nf);
  for (j=0; j<Nf; j++){
    X[i][j] = x_coords[i];
    Y[i][j] = y_coords[j];
    Vx[i][j] = lambda*1.;
    Vy[i][j] = lambda*(-Y[i][j]);
    svg.append("g")
       .append("path")
        .attr("d", "M" + x(0) + " " + y(0) + " L" + x(Vx[i][j]) + " " + y(Vy[i][j]))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("transform", "translate(" + (x(X[i][j]) - x(0)) + "," + (y(Y[i][j]) - y(0)) + ")");
    // svg.append("circle")
    //       .attr("cx",x(X[i][j]))
    //       .attr("cy",y(Y[i][j]))
    //       .attr("r",1)
    //       .attr("fill","black")
    //       .attr("stroke","black");
  }
}
var N = 100;
function solution(x0,y0,x){
  return {x: x, y: y0*Math.exp(-(x-x0))};
}

var xy = linspace(0.1,1,N).map(x=>solution(0.1,0.5,x));

svg.append("path")
      .datum(xy)
      .attr("fill", "none")
      .attr("stroke","black")
      .attr("stroke-width",1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
       );
