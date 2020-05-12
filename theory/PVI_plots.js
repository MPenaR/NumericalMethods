const{PI, atan2, exp} = Math;

var max_w =800;
var max_h = 400;
var margin = {top: 65, right: 30, bottom: 30, left: 60};
var width = max_w - margin.left - margin.right;
var height = max_h - margin.top - margin.bottom;
var xmax = 5;
var x = d3.scaleLinear()
        .domain([0,xmax])
        .range([ 0, width ]);

var y = d3.scaleLinear()
          .domain([0,1])
          .range([ height, 0 ]);

function linspace(x0,xf,N){
    var delta = (xf - x0)/ (N-1) ;
    return  d3.range(N).map(function(i){return x0+i*delta;});
}

function exp_grow(y,r){
  return r*y;
}

function exponential(x,A,r){
  return {x:x, y:A*exp(r*x)};
}

function solution(x0,y0,r,x){
  return {x: x, y: y0*exp(r*(x-x0))};
  // return {x: x, y: (Math.exp(x-x0))/(Math.exp(x-x0)+1./y0-1)};
}

function forward_euler(svg, f, r, x0,y0,Nt){
  var DT = (T-x0) / Nt ;
  var t = linspace(x0,T,Nt+1);
  var y_e = new Array(Nt);
  y_e[0] = y0;
  euler = svg.append('g');

  for(i=0; i<Nt;i++){
    y_e[i+1] = y_e[i] + DT*f(y_e[i],r);
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



function quiver(svg,Nx,Ny,f,r){
  var x_coords = linspace(0,xmax,Nx);
  var y_coords = linspace(0,1,Ny);
  var X = new Array(Ny);
  var Y = new Array(Ny);
  var Vx = new Array(Ny);
  var Vy = new Array(Ny);
  var tails = svg.append("g");
  var heads = svg.append("g");
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
      Vy[i][j] = lambda*f(Y[i][j], r);
      angle = atan2(Vy[i][j],Vx[i][j]);
      angle = -2*angle*180./PI + 90;
      tails.append("path")
          .attr("d", "M" + x(0) + " " + y(0) + " L" + x(Vx[i][j]) + " " + y(Vy[i][j]))
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("transform", "translate(" + (x(X[i][j]) - x(0)) + "," + (y(Y[i][j]) - y(0)) + ")");
      heads.append("path")
          .attr("d", TriSymb)
          .attr("fill", "black")
          .attr("stroke", "black")
          .attr("transform", "translate(" + x(X[i][j]+Vx[i][j]) + ","+y(Y[i][j]+Vy[i][j])+") rotate("+angle+") scale(0.3)" );
      }
  }
return {tails:tails, heads:heads};
}

function plot_vector_field(plot, Nx, Ny, f){
  var svg = d3.select("#"+plot)
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
                            (y(0)+30) + ")")
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
      .text("N(t)");

  var r = 0.5;

  var arrows = quiver(svg,Nx,Ny,f,r);
  var minR = -1.;
  var maxR = 1.;
  var sliderStep = d3
    .sliderBottom()
    .min(minR)
    .max(maxR)
    .width(200)
    .ticks(4)
    .step(0.05)
    .default(r)
    .on('onchange', val => {
      r = val;
      arrows["heads"].remove("g");
      arrows["tails"].remove("g");
      arrows = quiver(svg,Nx,Ny,f,r);
      });
  svg.append('g')
     .attr('transform','translate(20,-45)')
     .call(sliderStep);
  svg.append("text").text("r").attr('transform','translate(120,-50)');
  return svg;
};

var lambda = 0.08;

function plot_general_solution_vec(plot, Nx, Ny, vf, f_sol){
  var svg = d3.select("#"+plot)
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
                            (y(0)+30) + ")")
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
      .text("N(t)");

  var r = 0.5;
  var A = 0.5;

  var arrows = quiver(svg,Nx,Ny,vf,r);

  function plot_sol(r,A,f){
    var xy = linspace(0.,xmax,N).map(x=>f(x,A,r));
    var sol = svg.append("path")
          .datum(xy)
          .attr("fill", "none")
          .attr("stroke","steelblue")
          .attr("stroke-width",2.5)
          .attr("d", d3.line()
            .x(function(d) { return x(d.x) })
            .y(function(d) { return y(d.y) })
           );
     return sol;
  }
  var sol = plot_sol(r,A,f_sol);
   var minR = -1.;
   var maxR = 1.;
   var sliderR = d3
     .sliderBottom()
     .min(minR)
     .max(maxR)
     .width(200)
     .ticks(4)
     .step(0.05)
     .default(r)
     .on('onchange', val => {
       r = val;
       arrows["heads"].remove("g");
       arrows["tails"].remove("g");
       sol.remove("path");
       arrows = quiver(svg,Nx,Ny,vf,r);
       sol = plot_sol(r,A,f_sol);
       });
   svg.append('g')
      .attr('transform','translate(20,-45)')
      .call(sliderR);
   svg.append("text").text("r").attr('transform','translate(120,-50)');
   var minA = 0.;
   var maxA = 1.;
   var sliderA = d3
     .sliderBottom()
     .min(minA)
     .max(maxA)
     .width(200)
     .ticks(4)
     .step(0.05)
     .default(A)
     .on('onchange', val => {
       A = val;
       arrows["heads"].remove("g");
       arrows["tails"].remove("g");
       sol.remove("path");
       arrows = quiver(svg,Nx,Ny,vf,r);
       sol = plot_sol(r,A,f_sol);
       });
   var offset = 400;
   svg.append('g')
      .attr('transform','translate('+(offset+20)+',-45)')
      .call(sliderA);
   svg.append("text").text("A").attr('transform','translate('+(offset+120)+',-50)');
}


function plot_pvi(plot, Nx, Ny, vf, f_sol){
  var svg = d3.select("#"+plot)
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
                            (y(0)+30) + ")")
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
      .text("N(t)");

  var r = 0.5;
  var x0 = 0.75;
  var y0 = 0.55;

  var arrows = quiver(svg,Nx,Ny,vf,r);

  function plot_sol(x0,y0,r,f_sol){
    var xy = linspace(x0,xmax,N).map(x=>f_sol(x0,y0,r,x));
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
                      .style("font-weight","bold")
                      .attr("x",x(x0))
                      .attr("y",y(0.))
                      .attr("dy","1em");
    var labely = svg.append("text")
                      .html("N&#x2080")
                      .style("font-weight","bold")
                      .attr("x",x(0))
                      .attr("dx","-1.5em")
                      .attr("y",y(y0));
    return { sol: sol, aux: [aux_x, aux_y], labels: [ labelx, labely]}
  }
   var graph = plot_sol(x0,y0,r,f_sol);
   var minR = -1.;
   var maxR = 1.;
   var sliderR = d3
     .sliderBottom()
     .min(minR)
     .max(maxR)
     .width(200)
     .ticks(4)
     .step(0.05)
     .default(r)
     .on('onchange', val => {
       r = val;
       arrows["heads"].remove("g");
       arrows["tails"].remove("g");
       graph["sol"].remove("path");
       graph["aux"][0].remove();
       graph["aux"][1].remove();
       graph["labels"][0].remove();
       graph["labels"][1].remove();
       arrows = quiver(svg,Nx,Ny,vf,r);
       graph = plot_sol(x0,y0,r,f_sol);
       });
   svg.append('g')
      .attr('transform','translate(20,-45)')
      .call(sliderR);
   svg.append("text").text("r").attr('transform','translate(120,-50)');


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
    graph = plot_sol(x0,y0,r,f_sol);
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
        .call(drag1);

}

function plot_method(plot, Nx, Ny, vf, f_sol, method){
  var svg = d3.select("#"+plot)
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
                            (y(0)+30) + ")")
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
      .text("N(t)");

  var r = 0.5;
  var x0 = 0.75;
  var y0 = 0.55;

  var arrows = quiver(svg,Nx,Ny,vf,r);

  function plot_sol(x0,y0,r,f_sol){
    var xy = linspace(x0,xmax,N).map(x=>f_sol(x0,y0,r,x));
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
                      .style("font-weight","bold")
                      .attr("x",x(x0))
                      .attr("y",y(0.))
                      .attr("dy","1em");
    var labely = svg.append("text")
                      .html("N&#x2080")
                      .style("font-weight","bold")
                      .attr("x",x(0))
                      .attr("dx","-1.5em")
                      .attr("y",y(y0));
    return { sol: sol, aux: [aux_x, aux_y], labels: [ labelx, labely]}
  }
   var Nt = 20;
   var graph = plot_sol(x0,y0,r,f_sol);
   var euler = method(svg, vf, r, x0,y0,Nt);


   var minR = -2.;
   var maxR = 1.;
   var sliderR = d3
     .sliderBottom()
     .min(minR)
     .max(maxR)
     .width(200)
     .ticks(4)
     .step(0.05)
     .default(r)
     .on('onchange', val => {
       r = val;
       arrows["heads"].remove("g");
       arrows["tails"].remove("g");
       graph["sol"].remove("path");
       graph["aux"][0].remove();
       graph["aux"][1].remove();
       graph["labels"][0].remove();
       graph["labels"][1].remove();
       euler.remove();
       arrows = quiver(svg,Nx,Ny,vf,r);
       graph = plot_sol(x0,y0,r,f_sol);
       euler = method(svg, vf, r, x0,y0,Nt);
       });
   svg.append('g')
      .attr('transform','translate(20,-45)')
      .call(sliderR);
   svg.append("text").text("r").attr('transform','translate(120,-50)');


   var minNt = 1;
   var maxNt = 50;
   var sliderNt = d3
     .sliderBottom()
     .min(minNt)
     .max(maxNt)
     .width(200)
     .ticks(4)
     .step(1)
     .default(Nt)
     .on('onchange', val => {
       Nt = val;
       euler.remove();
       euler = method(svg, vf, r, x0,y0,Nt);
       });
   var offset = 400;
   svg.append('g')
      .attr('transform','translate('+(offset+20)+',-45)')
      .call(sliderNt);
   svg.append("text").text("N").attr('transform','translate('+(offset+120)+',-50)');



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
    euler.remove();
    graph = plot_sol(x0,y0,r,f_sol);
    euler = method(svg, vf, r, x0,y0,Nt);
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
        .call(drag1);

}

var Nf = 15 ;
var Nx = 2*Nf ;
var Ny = Nf ;

var N = 100;


var T = xmax;





plot_vector_field("vec_plot", Nx, Ny,exp_grow);
plot_general_solution_vec("gen_sol_plot", Nx, Ny,exp_grow,exponential);
plot_pvi("pvi_plot", Nx, Ny,exp_grow, solution);
plot_method("feuler", Nx, Ny,exp_grow, solution, forward_euler);
// plot_method("beuler", Nx, Ny,exp_grow, solution);
