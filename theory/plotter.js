// import cos from Math;
var max_w = 600;
var max_h = 400;
var margin = {top: 10, right: 30, bottom: 30, left: 60};
var width = max_w - margin.left - margin.right;
var height = max_h - margin.top - margin.bottom;
var minN = 2;
var maxN = 50;

const { PI, sin, cos, ceil, abs }  = Math


var x = d3.scaleLinear()
        .domain([0,1])
        .range([ 0, width ]);

var y = d3.scaleLinear()
          .domain([0,1])
          .range([ height, 0 ]);

function linspace(x0,xf,N){
  var delta = (xf - x0)/ (N-1) ;
  return  d3.range(N).map(function(i){return x0+i*delta;});
}



function graph( svg, xy, x0, xf){

      var area = svg.append("g");

      area.append("path")
            .datum([{x:x0,y:0}, ...xy, {x:xf,y:0}])
            .attr("fill", "steelblue")
            .attr("opacity",0.5)
            .attr("stroke", "none")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .x(function(d) { return x(d.x) })
              .y(function(d) { return y(d.y) })
             );
      area.append("path")
            .datum(xy)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
              .x(function(d) { return x(d.x) })
              .y(function(d) { return y(d.y) })
            );
    return area
}

function f(x){
  return 0.5*sin(6*PI*x)+0.5;
  // return x**2;
}

function I_exact(a,b){
  return 0.5*(b-a-(1/(6*PI)*(cos(6*PI*b)-cos(6*PI*a))));
}

function l_sums(f,a,b,N){
  var x = linspace(a,b,N+1);
  var s = 0. ;
  var i;
  for(i=0; i<N; i++){
    s = s + (x[i+1]-x[i])*f(x[i]);
  }
  return s;
}
function r_sums(f,a,b,N){
  var x = linspace(a,b,N+1);
  var s = 0. ;
  var i;
  for(i=0; i<N; i++){
    s = s + (x[i+1]-x[i])*f(x[i+1]);
  }
  return s;
}
function t_sums(f,a,b,N){
  var x = linspace(a,b,N+1);
  var s = 0. ;
  var i;
  for(i=0; i<N; i++){
    s = s + 0.5*(x[i+1]-x[i])*(f(x[i])+f(x[i+1]));
  }
  return s;
}
function s_sums(f,a,b,N){
  var x = linspace(a,b,N+1);
  var s = 0. ;
  var i;
  for(i=1; i<N; i+=2){
    s = s + 1./6.*(x[i+1]-x[i-1])*(f(x[i-1])+4*f(x[i])+f(x[i+1]));
  }
  return s;
}
function gen_xy(f,x0,xf,N){
  var x_points = linspace(x0,xf,N+1);
  return x_points.map(function(x) {return { x: x,y: f(x)};});
}

var TriSymb = d3.symbol().type(d3.symbolTriangle);

function plot_bins_L(svg, Nbins, f, x0,xf){
    var bin_w_px = (x(xf) - x(x0))/Nbins;
    var bin_w = (xf - x0)/Nbins;
    var x_bins = linspace(x0,xf,Nbins+1);
    var i;
    var bins = svg.append("g");
    for (i = 0; i < Nbins; i++) {
      bins.append("rect")
         .attr("fill","red")
         .attr("opacity",0.6)
         .attr("stroke","black")
         .attr("x", x(x_bins[i]))
         .attr("y", y(f(x_bins[i])))
         .attr("width", bin_w_px)
         .attr("height", y(0)-y(f(x_bins[i])));
    }
    return bins;
}

function plot_bins_R(svg, Nbins, f, x0,xf){
    var bin_w_px = (x(xf) - x(x0))/Nbins;
    var bin_w = (xf - x0)/Nbins;
    var x_bins = linspace(x0,xf,Nbins+1);
    var i;
    var bins = svg.append("g");
    for (i = 0; i < Nbins; i++) {
      bins.append("rect")
         .attr("fill","red")
         .attr("opacity",0.6)
         .attr("stroke","black")
         .attr("x", x(x_bins[i]))
         .attr("y", y(f(x_bins[i+1])))
         .attr("width", bin_w_px)
         .attr("height", y(0)-y(f(x_bins[i+1])));
    }
    return bins;
}


function plot_bins_T(svg, Nbins, f, x0,xf){
    var bin_w_px = (x(xf) - x(x0))/Nbins;
    var bin_w = (xf - x0)/Nbins;
    var x_bins = linspace(x0,xf,Nbins+1);
    var i;
    var bins = svg.append('g');
    for (i = 0; i < Nbins; i++) {
      bins.append("path")
         .datum([
         {x: x_bins[i],       y: 0},
         {x: x_bins[i],       y: f(x_bins[i])},
         {x: x_bins[i]+bin_w, y: f(x_bins[i]+bin_w)},
         {x: x_bins[i]+bin_w, y: 0}
         ])
         .attr("fill", "red")
         .attr("stroke", "black")
         .attr("opacity",0.6)
         .attr("stroke-width", 1.5)
         .attr("d", d3.line()
           .x(function(d) { return x(d.x) })
           .y(function(d) { return y(d.y) })
            )
    }
    return bins;
}

function plot_bins_S(svg, Nbins, f, x0,xf, N=100){
    var bin_w_px = (x(xf) - x(x0))/Nbins;
    var bin_w = (xf - x0)/Nbins;
    var x_bins = linspace(x0,xf,Nbins+1);
    var i;
    var bins = svg.append('g');
    for (i = 1; i < Nbins; i=i+2) {
      function par(x){
        return { x: x,
                 y: f(x_bins[i]) +
               (f(x_bins[i+1])-f(x_bins[i-1]))/(2*bin_w)*(x-x_bins[i]) +
               (f(x_bins[i-1])-2*f(x_bins[i])+f(x_bins[i+1]))/(2*bin_w**2)*(x-x_bins[i])**2
             }
      }
      var Ns = ceil(N/Nbins);
      var x_par_0 = x_bins[i-1];
      var x_par_f = x_bins[i+1];
      var x_par = linspace(x_par_0,x_par_f,Ns+1);
      var par_points = x_par.map(par);
      bins.append("path")
         .datum([
         {x: x_bins[i-1],       y: 0},
         ...par_points,
         {x: x_bins[i+1], y: 0}
         ])
         .attr("fill", "red")
         .attr("stroke", "black")
         .attr("opacity",0.6)
         .attr("stroke-width", 1.5)
         .attr("d", d3.line()
           .x(function(d) { return x(d.x) })
           .y(function(d) { return y(d.y) })
            )
      bins.append("path")
          .datum([{x:x_bins[i],y:0},{x:x_bins[i],y:f(x_bins[i])}])
          .attr("stroke", "black")
          .attr("fill","none")
          .attr("opacity",0.6)
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .x(function(d) { return x(d.x) })
            .y(function(d) { return y(d.y) })
            )

    }
    return bins
}


function int_plot(label, plot_bins, Nstep=1, numI=l_sums){

  var x_a = 0.3;
  var x_b = 0.8;
  var N = 100;

  var svg = d3.select('#'+label)
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
       .text("x")

  svg.append("g")
     .call(d3.axisLeft(y));

 svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x",0 - (height / 2))
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("y");

  var xy = gen_xy(f,0.,1.,N);
  svg.append("path")
        .datum(xy)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.x) })
          .y(function(d) { return y(d.y) })
        );
  xy = gen_xy(f,x_a,x_b,N);
  var area = graph(svg, xy, x_a, x_b);
  var Nbins = 10 ;
  var bins = plot_bins(svg,Nbins, f, x_a,x_b);

  // function add_text(N){
  //   svg.text
  // }
  var x_text = 300;
  function plot_data(svg,a,b,N){
    var I = I_exact(x_a,x_b);
    var I_h = numI(f,x_a,x_b,N);
    var e_h = abs(I-I_h);
    var texts = svg.append("g")
    var h = (x_b-x_a)/N;
    texts.append("text").text("N").attr('transform','translate(130,1)');
    texts.append("text").text("I = "+I.toPrecision(3)).attr('transform','translate('+x_text+',1)');
    texts.append("text").text("I_h = "+I_h.toPrecision(3)).attr('transform','translate('+x_text+',21)');
    texts.append("text").text("h = "+h.toExponential(2)).attr('transform','translate('+x_text+',41)');
    texts.append("text").text("e_h = "+e_h.toExponential(2)).attr('transform','translate('+x_text+',61)');
    return texts;
  }
  var texts = plot_data(svg, x_a,x_b,Nbins);

  var sliderStep = d3
    .sliderBottom()
    .min(minN)
    .max(maxN)
    .width(200)
    .ticks(4)
    .step(Nstep)
    .default(10)
    .on('onchange', val => {
      Nbins = val;
      bins.remove("g");
      bins = plot_bins(svg,val,f,x_a,x_b);
      texts.remove("g");
      texts = plot_data(svg, x_a,x_b,Nbins);
      });
  svg.append('g')
     .attr('transform','translate(50,10)')
     .call(sliderStep);

  function dragTri_L(d) {
       if ((x.invert(d3.event.x)<0.)||(x.invert(d3.event.x)>x_b)){return}
       x_a = x.invert(d3.event.x);
       xy = gen_xy(f,x_a,x_b,N);
       area.remove("g");
       area = graph(svg, xy, x_a, x_b);
       bins.remove("g");
       bins = plot_bins(svg,Nbins, f, x_a,x_b);
       texts.remove("g");
       texts = plot_data(svg, x_a,x_b,Nbins);
       TriL.attr("transform", "translate(" + x(x_a) + ","+y(-0.02)+")");
  };


  var drag_left = d3.drag().on("drag", dragTri_L);

  var TriL = svg.append("path")
           .attr("d", TriSymb)
           .attr("fill", "white")
           .attr("stroke", "black")
           .attr("transform", "translate(" + x(x_a) + ","+y(-0.02)+")")
           .attr("cursor","ew-resize")
           .call(drag_left);


   function dragTri_R(d) {
     if ((x.invert(d3.event.x)<x_a)||(x.invert(d3.event.x)>1.)){return}
     x_b = x.invert(d3.event.x);
     xy = gen_xy(f,x_a,x_b,N);
     area.remove("g");
     area = graph(svg, xy, x_a, x_b);
     bins.remove("g");
     bins = plot_bins(svg,Nbins, f, x_a,x_b);
     texts.remove("g");
     texts = plot_data(svg, x_a,x_b,Nbins);
     TriR.attr("transform", "translate(" + x(x_b) + ","+y(-0.02)+")");
   };


  var drag_right = d3.drag().on("drag", dragTri_R);

  var TriR = svg.append("path")
        .attr("d", TriSymb)
        .attr("fill", "white")
        .attr("stroke", "black")
        // .attr("opacity",0.5)
        .attr("transform", "translate(" + x(0.8) + ","+y(-0.02)+")")
        .attr("cursor","ew-resize")
        .call(drag_right);
}


int_plot('plot_L',plot_bins_L,1,l_sums);
int_plot('plot_R',plot_bins_R,1,r_sums);
int_plot('plot_T',plot_bins_T,1,t_sums);
int_plot('plot_S',plot_bins_S,2,s_sums);
