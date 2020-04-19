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

svg.append("text")
     .attr("transform",
           "translate(" + (width/2) + " ," +
                          (height + margin.top + 20) + ")")
     .style("text-anchor", "middle")
     .text("t")

svg.append("g")
   .call(d3.axisLeft(y));
svg.append("text")
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


var Nf  = 20 ;

var x_coords = linspace(0,xmax,Nf);
var y_coords = linspace(0,1,Nf);


var X = new Array(Nf);
var Y = new Array(Nf);
var Vx = new Array(Nf);
var Vy = new Array(Nf);

var lambda = 0.08;
for (i=0; i<Nf; i++){
  X[i] = new Array(Nf);
  Y[i] = new Array(Nf);
  Vx[i] = new Array(Nf);
  Vy[i] = new Array(Nf);

  var TriSymb = d3.symbol().type(d3.symbolTriangle);

  var angle;
  for (j=0; j<Nf; j++){
    X[i][j] = x_coords[i];
    Y[i][j] = y_coords[j];
    Vx[i][j] = lambda*1.;
    Vy[i][j] = lambda*(Y[i][j]*(1-Y[i][j]));
    angle = Math.atan2(Vy[i][j],Vx[i][j]);
    angle = -2*angle*180./Math.PI + 90;
    svg.append("g")
       .append("path")
        .attr("d", "M" + x(0) + " " + y(0) + " L" + x(Vx[i][j]) + " " + y(Vy[i][j]))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("transform", "translate(" + (x(X[i][j]) - x(0)) + "," + (y(Y[i][j]) - y(0)) + ")");
    svg.append("path")
        .attr("d", TriSymb)
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("transform", "translate(" + x(X[i][j]+Vx[i][j]) + ","+y(Y[i][j]+Vy[i][j])+") rotate("+angle+") scale(0.3)" );
    // svg.append("g")
    //    .append("circle")
    //     .attr("r",2)
    //     .attr("cx", x(Vx[i][j]))
    //     .attr("cy", y(Vy[i][j]))
    //     .attr("transform", "translate(" + (x(X[i][j]) - x(0)) + "," + (y(Y[i][j]) - y(0)) + ")");
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
  // return {x: x, y: y0*Math.exp((x-x0))};
  return {x: x, y: (Math.exp(x-x0))/(Math.exp(x-x0)+1./y0-1)};
}

var x0 = 0.;
var y0 = 0.5;

function plot_sol(x0,y0){
  var xy = linspace(x0,xmax,N).map(x=>solution(x0,y0,x));

  sol = svg.append("path")
        .datum(xy)
        .attr("fill", "none")
        .attr("stroke","steelblue")
        .attr("stroke-width",2.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.x) })
          .y(function(d) { return y(d.y) })
         );
  return sol
}
sol = plot_sol(x0,y0)

 var drag = d3.drag().on("drag", dragmove);



function dragmove(d) {
 if ((x.invert(d3.event.x)<0.)||(x.invert(d3.event.x)>xmax)){return}
 if ((y.invert(d3.event.y)<0.)||(y.invert(d3.event.y)>1.)){return}
 x0 = x.invert(d3.event.x);
 y0 = y.invert(d3.event.y);
 sol.remove();
 sol = plot_sol(x0,y0)
 d3.select(this)
     .attr("cx",x(x0))
     .attr("cy",y(y0));
};

svg.append("circle")
     .attr("cx",x(x0))
     .attr("cy",y(y0))
     .attr("r",6)
     .attr("fill","white")
     .attr("stroke","black")
     .attr("cursor","move")
     .call(drag);
