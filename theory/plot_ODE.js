var max_w =800;
var max_h = 400;
var margin = {top: 10, right: 30, bottom: 30, left: 60};
var width = max_w - margin.left - margin.right;
var height = max_h - margin.top - margin.bottom;
var xmax = 5;
var x = d3.scaleLinear()
        .domain([0,xmax])
        .range([ 0, width ]);

var y = d3.scaleLinear()
          .domain([0,1])
          .range([ height, 0 ]);

svg1 = d3.select("#ODE")
        .append("svg")
          .attr("width", max_w)
          .attr("height", max_h)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

svg1.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

svg1.append("text")
     .attr("transform",
           "translate(" + (width/2) + " ," +
                          (height + margin.top + 20) + ")")
     .style("text-anchor", "middle")
     .text("t")

svg1.append("g")
   .call(d3.axisLeft(y));
svg1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("y(t)");

function linspace(x0,xf,N){
 var delta = (xf - x0)/ (N-1) ;
 return  d3.range(N).map(function(i){return x0+i*delta;});
}


var Nf = 15 ;
var Nx = 2*Nf ;
var Ny = Nf ;

var x_coords = linspace(0,xmax,Nx);
var y_coords = linspace(0,1,Ny);


var X = new Array(Ny);
var Y = new Array(Ny);
var Vx = new Array(Ny);
var Vy = new Array(Ny);

var lambda = 0.08;
for (i=0; i<Ny; i++){
  X[i] = new Array(Nx);
  Y[i] = new Array(Nx);
  Vx[i] = new Array(Nx);
  Vy[i] = new Array(Nx);

  var TriSymb = d3.symbol().type(d3.symbolTriangle);

  var angle;
  for (j=0; j<Nx; j++){
    X[i][j] = x_coords[j];
    Y[i][j] = y_coords[i];
    Vx[i][j] = lambda*1.;
    Vy[i][j] = lambda*(Y[i][j]*(1-Y[i][j]));
    angle = Math.atan2(Vy[i][j],Vx[i][j]);
    angle = -2*angle*180./Math.PI + 90;
    svg1.append("g")
       .append("path")
        .attr("d", "M" + x(0) + " " + y(0) + " L" + x(Vx[i][j]) + " " + y(Vy[i][j]))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("transform", "translate(" + (x(X[i][j]) - x(0)) + "," + (y(Y[i][j]) - y(0)) + ")");
    svg1.append("path")
        .attr("d", TriSymb)
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("transform", "translate(" + x(X[i][j]+Vx[i][j]) + ","+y(Y[i][j]+Vy[i][j])+") rotate("+angle+") scale(0.3)" );
  }
}

var N = 100;
function solution(x0,y0,x){
  // return {x: x, y: y0*Math.exp((x-x0))};
  return {x: x, y: (Math.exp(x-x0))/(Math.exp(x-x0)+1./y0-1)};
}

var x0 = 0.75;
var y0 = 0.55;

function plot_sol(svg,x0,y0){
  var xy = linspace(x0,xmax,N).map(x=>solution(x0,y0,x));
  var sol = svg.append("path")
        .datum(xy)
        .attr("fill", "none")
        .attr("stroke","steelblue")
        .attr("stroke-width",2.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.x) })
          .y(function(d) { return y(d.y) })
         );

  var aux_x = svg.append("line")
                   .attr("x1", x(x0))
                   .attr("y1", y(y0))
                   .attr("x2", x(x0))
                   .attr("y2", y(0))
                   .attr("stroke-width", 1)
                   .attr("stroke", "black")
                   .style("stroke-dasharray", ("3, 3"));
  var aux_y = svg.append("line")
                  .attr("x1", x(x0))
                  .attr("y1", y(y0))
                  .attr("x2", x(0))
                  .attr("y2", y(y0))
                  .attr("stroke-width", 1)
                  .attr("stroke", "black")
                  .style("stroke-dasharray", ("3, 3"));
  var labelx = svg.append("text")
                    .html("t&#x2080")
                    .attr("x",x(x0))
                    .attr("y",y(0.))
                    .attr("dy","1em");
  var labely = svg.append("text")
                    .html("y&#x2080")
                    .attr("x",x(0))
                    .attr("dx","-1.5em")
                    .attr("y",y(y0));
  return { sol: sol, aux: [aux_x, aux_y], labels: [ labelx, labely]}
}
var graph = plot_sol(svg1,x0,y0)

var drag1 = d3.drag().on("drag", dragmove1);



function dragmove1(d) {
 if ((x.invert(d3.event.x)<0.)||(x.invert(d3.event.x)>xmax)){return}
 if ((y.invert(d3.event.y)<0.)||(y.invert(d3.event.y)>1.)){return}
 x0 = x.invert(d3.event.x);
 y0 = y.invert(d3.event.y);
 graph["sol"].remove();
 graph["aux"][0].remove();
 graph["aux"][1].remove();
 graph["labels"][0].remove();
 graph["labels"][1].remove();
 graph = plot_sol(svg1,x0,y0);
 d3.select(this)
     .attr("cx",x(x0))
     .attr("cy",y(y0));
};

svg1.append("circle")
     .attr("cx",x(x0))
     .attr("cy",y(y0))
     .attr("r",6)
     .attr("fill","white")
     .attr("stroke","black")
     .attr("cursor","move")
     .call(drag1);
