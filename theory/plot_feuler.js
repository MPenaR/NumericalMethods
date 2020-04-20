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

svg2 = d3.select("#feuler")
        .append("svg")
          .attr("width", max_w)
          .attr("height", max_h)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

svg2.append("text")
     .attr("transform",
           "translate(" + (width/2) + " ," +
                          (height + margin.top + 20) + ")")
     .style("text-anchor", "middle")
     .text("t")

svg2.append("g")
   .call(d3.axisLeft(y));
svg2.append("text")
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
    svg2.append("g")
       .append("path")
        .attr("d", "M" + x(0) + " " + y(0) + " L" + x(Vx[i][j]) + " " + y(Vy[i][j]))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("transform", "translate(" + (x(X[i][j]) - x(0)) + "," + (y(Y[i][j]) - y(0)) + ")");
    svg2.append("path")
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

function plot_sol(svg,x0,y0){
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
sol2 = plot_sol(svg2,x0,y0)





var Nt = 5;
var T = xmax;


function forward_euler(x0,y0){
  var DT = (T-x0) / Nt ;
  var t = linspace(x0,T,Nt+1);
  var y_e = new Array(Nt);
  y_e[0] = y0;
  euler = svg2.append('g');

  for(i=0; i<Nt;i++){
    y_e[i+1] = y_e[i] + DT*(y_e[i]*(1-y_e[i]));
    euler.append("path")
         .datum([{x: t[i],       y: y_e[i]},
                 {x: t[i+1],       y: y_e[i+1]}])
         .attr("stroke", "red")
         .attr("stroke-width", 1.5)
         .attr("d", d3.line()
           .x(function(d) { return x(d.x) })
           .y(function(d) { return y(d.y) })
            )
    euler.append("circle")
          .attr("cx",x(t[i+1]))
          .attr("cy",y(y_e[i+1]))
          .attr("r",3)
          .attr("fill","red")
          .attr("stroke","black");

  }
  return euler
}

euler = forward_euler(x0,y0);

var drag2 = d3.drag().on("drag", dragmove2);



function dragmove2(d) {
  if ((x.invert(d3.event.x)<0.)||(x.invert(d3.event.x)>xmax)){return}
  if ((y.invert(d3.event.y)<0.)||(y.invert(d3.event.y)>1.)){return}
  x0 = x.invert(d3.event.x);
  y0 = y.invert(d3.event.y);
  sol2.remove();
  sol2 = plot_sol(svg2,x0,y0);
  d3.select(this)
      .attr("cx",x(x0))
      .attr("cy",y(y0));
  euler.remove();
  euler = forward_euler(x0,y0);
};

svg2.append("circle")
     .attr("cx",x(x0))
     .attr("cy",y(y0))
     .attr("r",6)
     .attr("opacity",1)
     .attr("fill","white")
     .attr("stroke","black")
     .attr("cursor","move")
     .call(drag2);
