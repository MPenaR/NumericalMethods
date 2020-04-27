
var max_w = 600;
var max_h = 400;
var margin = {top: 10, right: 30, bottom: 30, left: 60};
var width = max_w - margin.left - margin.right;
var height = max_h - margin.top - margin.bottom;
var minN = 2;
var maxN = 50;
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
function plot_bins_L(cont, Nbins, f, x0,xf){
    var bin_w_px = (x(xf) - x(x0))/Nbins;
    var bin_w = (xf - x0)/Nbins;
    var x_bins = linspace(x0,xf,Nbins+1);
    var i;
    for (i = 0; i < Nbins; i++) {
      cont.append("rect")
         .attr("fill","red")
         .attr("opacity",0.6)
         .attr("stroke","black")
         .attr("x", x(x_bins[i]))
         .attr("y", y(f(x_bins[i])))
         .attr("width", bin_w_px)
         .attr("height", y(0)-y(f(x_bins[i])));
    }
}
function graph( svg, xy, x0, xf){

      area = svg.append("g");

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
}

function f(x){
  return x**2;
}
var label = 'plot_L';

var x_a = 0.2;
var x_b = 0.8;
var N = 100;

function gen_xy(f,x0,xf,N){
  var x_points = linspace(x0,xf,N+1);
  return x_points.map(function(x) {return { x: x,y: f(x)};});
}

var svgL = d3.select('#'+label)
            .append("svg")
              .attr("width", max_w)
              .attr("height", max_h)
            .append("g")
              .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

svgL.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

svgL.append("g")
   .call(d3.axisLeft(y));

xy = gen_xy(f,0.,1.,N);
svgL.append("path")
      .datum(xy)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
      );
xy = gen_xy(f,x_a,x_b,N);
graph(svgL, xy, x_a, x_b);
var Nbins = 10 ;
plot_bins_L(svgL,Nbins, f, x_a,x_b)

var sliderStep = d3
  .sliderBottom()
  .min(minN)
  .max(maxN)
  .width(200)
  .ticks(4)
  .step(1)
  .default(10)
  .on('onchange', val => {
    //d3.select('#text_L').text(texto_L(val));
    Nbins = val;
    svgL.selectAll("rect").remove();
    plot_bins_L(svgL,val,f,x_a,x_b);
    });
svgL.append('g')
   .attr('transform','translate(50,10)')
   .call(sliderStep);


var drag_left = d3.drag().on("drag", dragTri_L);
var drag_right = d3.drag().on("drag", dragTri_R);



// function dragmove_L(d) {
//   if ((x.invert(d3.event.x)<0.)||(x.invert(d3.event.x)>x_b)){return}
//   x_a = x.invert(d3.event.x);
//   xy = gen_xy(f,x_a,x_b,N);
//   area.selectAll("path").remove();
//   graph(svgL, xy, x_a, x_b);
//   svgL.selectAll("rect").remove();
//   plot_bins_L(svgL,10, f, x_a,x_b);
//   d3.select(this).attr("cx",x(x_a));
// };
//
// function dragmove_R(d) {
//   if ((x.invert(d3.event.x)<x_a)||(x.invert(d3.event.x)>1.)){return}
//   x_b = x.invert(d3.event.x);
//   xy = gen_xy(f,x_a,x_b,N);
//   area.selectAll("path").remove();
//   graph(svgL, xy, x_a, x_b);
//   svgL.selectAll("rect").remove();
//   plot_bins_L(svgL,10, f, x_a,x_b);
//   d3.select(this).attr("cx",x(x_b));
// };


// svgL.append("circle")
//       .attr("cx",x(x_a))
//       .attr("cy",y(0))
//       .attr("r",6)
//       .attr("fill","white")
//       .attr("stroke","black")
//       .attr("cursor","ew-resize")
//       .call(drag_left);
// svgL.append("text")
    // .attr("x",x(x_a))
    // .attr("y",y(0))
    // .text()


function dragTri_L(d) {
  if ((x.invert(d3.event.x)<0.)||(x.invert(d3.event.x)>x_b)){return}
  x_a = x.invert(d3.event.x);
  xy = gen_xy(f,x_a,x_b,N);
  area.selectAll("path").remove();
  graph(svgL, xy, x_a, x_b);
  svgL.selectAll("rect").remove();
  plot_bins_L(svgL,Nbins, f, x_a,x_b);
  TriL.attr("transform", "translate(" + x(x_a) + ","+y(-0.02)+")");
};
function dragTri_R(d) {
  if ((x.invert(d3.event.x)<x_a)||(x.invert(d3.event.x)>1.)){return}
  x_b = x.invert(d3.event.x);
  xy = gen_xy(f,x_a,x_b,N);
  area.selectAll("path").remove();
  graph(svgL, xy, x_a, x_b);
  svgL.selectAll("rect").remove();
  plot_bins_L(svgL,Nbins, f, x_a,x_b);
  TriR.attr("transform", "translate(" + x(x_b) + ","+y(-0.02)+")");
};

var TriSymb = d3.symbol().type(d3.symbolTriangle);

var TriL = svgL.append("path")
      .attr("d", TriSymb)
      .attr("fill", "white")
      .attr("stroke", "black")
      // .attr("opacity",0.5)
      .attr("transform", "translate(" + x(0.2) + ","+y(-0.02)+")")
      .attr("cursor","ew-resize")
      .call(drag_left);

var TriR = svgL.append("path")
      .attr("d", TriSymb)
      .attr("fill", "white")
      .attr("stroke", "black")
      // .attr("opacity",0.5)
      .attr("transform", "translate(" + x(0.8) + ","+y(-0.02)+")")
      .attr("cursor","ew-resize")
      .call(drag_right);


// svgL.append("circle")
//       .attr("cx",x(x_b))
//       .attr("cy",y(0))
//       .attr("r",6)
//       .attr("fill","white")
//       .attr("stroke","black")
//       .attr("cursor","ew-resize")
//       .call(drag_right);



// function formula_L(N,a,b){
//   return `$$\\frac{${b}-${a}}{${N}}\\sum_{i=1}^{${N}}f\\left(x_{i-1}\\right)$$`
// }
