// import cos from Math;
const { PI, sin, cos, ceil, abs, sqrt }  = Math

var max_w = 600;
var max_h = 400;
var margin = {top: 60, right: 30, bottom: 30, left: 60};
var width = max_w - margin.left - margin.right;
var height = max_h - margin.top - margin.bottom;
var minN = 2;
var maxN = 50;

var x_min = 0;
var x_max = 1;

var y_min = -0.5;
var y_max = 0.5;


var x = d3.scaleLinear()
        .domain([x_min,x_max])
        .range([ 0, width ]);

var y = d3.scaleLinear()
          .domain([y_min, y_max])
          .range([ height, 0 ]);

        
var label = "test"

var svg = d3.select('#'+label).append("svg")
   .attr("width", max_w)
   .attr("height", max_h)
   .append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
  .attr("transform", "translate(0," + height/2 + ")")
  .call(d3.axisBottom(x));


svg.append("g")
 .call(d3.axisLeft(y));

svg.append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 0 - margin.left)
 .attr("x",0 - (height / 2))
 .attr("dy", "1em")
 .style("text-anchor", "middle")
 .text("y");


 


function linspace(x0,xf,N){
    var delta = (xf - x0)/ (N-1) ;
    return  d3.range(N).map(function(i){return x0+i*delta;});
}


function bisection(a,b,N,f){
    let x_med = new Array(N);
    let y_med = new Array(N);
    let x_A = new Array(N);
    let x_B = new Array(N);
    x_A[0] = a;
    x_B[0] = b;    
    x_med[0] = (x_A[0]+x_B[0])/2 ; 
    y_med[0] = f(x_med[0]) ;
    for( let i=1; i < N; i++){
        if( y_med[i-1]*f(x_A[i-1]) > 0 ){
            x_A[i] = x_med[i-1] ;
            x_B[i] = x_B[i-1];
        } else{
            x_B[i] = x_med[i-1] ;
            x_A[i] = x_A[i-1];
        }
        x_med[i] = (x_A[i]+x_B[i])/2 ;
        y_med[i] = f(x_med[i]) ;
    }
    return { x_m: x_med, y_m: y_med, a: x_A, b: x_B }
}

function f(x){
    return x*x - 0.5 ;
}

var N = 4 ; 
var x_A = 0. ;
var f_A = f(x_A);
var x_B = 1. ; 
var f_B = f(x_B);
var sol = sqrt(0.5);


var x_i = linspace(x_min, x_max,100);



// The graph
svg.append('g')
    .append("path")
    .datum(x_i)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(function(d) { return x(d) })
      .y(function(d) { return y(f(d)) })
      )
svg.append("text")
    .attr("x",x(0.1))
    .attr("y",y(-0.4))
    .text("y = f(x)")

var hs = Array(N);
hs = [0.5, 0.4, 0.3, 0.2];
hs = [0.4, 0.3, 0.2, 0.1];
// The approximations
function plot_approx(svg, x_A, x_B, N){
    let approximations =  svg.append('g').attr("id","approx");
    var points = bisection(x_A,x_B,N,f); 
    for( let i = 0; i < N; i++){
        if (points.y_m[i]>0){
            approximations.append("circle")
            .attr("cx",x(points.x_m[i]))
            .attr("cy",y(points.y_m[i]))
            .attr("r",3)
            .attr("fill","red")
            .attr("stroke","black");
        }else{
            approximations.append("circle")
            .attr("cx",x(points.x_m[i]))
            .attr("cy",y(points.y_m[i]))
            .attr("r",3)
            .attr("fill","blue")
            .attr("stroke","black");
        }
        approximations.append("line")
                        .attr("x1", x(points.x_m[i]))
                        .attr("y1", y(0))
                        .attr("x2", x(points.x_m[i]))
                        .attr("y2", y(points.y_m[i]))
                        .attr("stroke-width", 1)
                        .attr("stroke", "black")
                        .style("stroke-dasharray", ("3, 3"));
        approximations.append("text")
                        .attr("x",x(points.x_m[i]))
                        .attr("y",y(0.05))
                        .style("font-size","0.9em")
                        .text("x")
                        .append("tspan")
                        .attr("dy","0.5em")
                        .attr("dx","0.1em")
                        .style("font-size","0.7em")
                        .text(i.toString());
        approximations.append("line")
                        .attr("x1", x(points.a[i]))
                        .attr("y1", y(hs[i]))
                        .attr("x2", x(points.b[i]))
                        .attr("y2", y(hs[i]))
                        .attr("stroke-width", 1)
                        .attr("stroke", "black")
                        .style("stroke-dasharray", ("3, 3"));
        approximations.append("line")
                        .attr("x1", x(points.x_m[i]))
                        .attr("y1", y(0))
                        .attr("x2", x(points.x_m[i]))
                        .attr("y2", y(hs[i]))
                        .attr("stroke-width", 1)
                        .attr("stroke", "black")
                        .style("stroke-dasharray", ("3, 3"));
        approximations.append("text")
                        .attr("x",x(points.x_m[i]))
                        .attr("y",y(hs[i]+0.05))
                        .style("font-size","0.9em")
                        .text("I")
                        .append("tspan")
                        .attr("dy","0.5em")
                        .attr("dx","0.1em")
                        .style("font-size","0.7em")
                        .text(i.toString());
    }
}

plot_approx(svg, x_A, x_B, N)

/*
 // The approximations
approximations =  svg.append('g'); 
for( let i = 0; i < N; i++){
    approximations.append("circle")
                    .attr("cx",x(points.x[i]))
                    .attr("cy",y(points.y[i]))
                    .attr("r",3)
                    .attr("fill","red")
                    .attr("stroke","black");
    approximations.append("line")
                    .attr("x1", x(points.x[i]))
                    .attr("y1", y(0))
                    .attr("x2", x(points.x[i]))
                    .attr("y2", y(points.y[i]))
                    .attr("stroke-width", 1)
                    .attr("stroke", "black")
                    .style("stroke-dasharray", ("3, 3"));
}
*/


/*
for( let i = 0; i < N; i++){
    svg.append("line")
        .attr("x1", x(points.x[i]))
        .attr("y1", y(0))
        .attr("x2", x(points.x[i]))
        .attr("y2", y(points.y[i]))
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .style("stroke-dasharray", ("3, 3"));
}
*/

var drag_A = d3.drag().on("drag", dragmove_A);
var drag_B = d3.drag().on("drag", dragmove_B);



// x_A
var g_A = svg.append("g");
if(f_A>0){
    g_A.append("circle")
    .attr("cx",x(x_A))
    .attr("cy",y(0))
    .attr("r",5)
    .attr("fill","red")
    .attr("stroke","black");
}else{
    g_A.append("circle")
    .attr("cx",x(x_A))
    .attr("cy",y(0))
    .attr("r",5)
    .attr("fill","blue")
    .attr("stroke","black");
}

g_A.append("text")
    .attr("x",x(x_A))
    .attr("y",y(0-0.1))
    .style("font-size","0.9em")
    .text("a");


g_A.call(drag_A);



// x_B   

var g_B = svg.append("g");
if( f_B > 0 ){
    g_B.append("circle")
    .attr("cx",x(x_B))
    .attr("cy",y(0))
    .attr("r",5)
    .attr("fill","red")
    .attr("stroke","black");
}else{
    g_B.append("circle")
    .attr("cx",x(x_B))
    .attr("cy",y(0))
    .attr("r",5)
    .attr("fill","blue")
    .attr("stroke","black");
}

g_B.append("text")
    .attr("x",x(x_B))
    .attr("y",y(0-0.1))
    .style("font-size","0.9em")
    .text("b");

g_B.call(drag_B);

function dragmove_A(d){
    if ((x.invert(d3.event.x)<x_min)||(x.invert(d3.event.x)>sol)){return}
    x_A = x.invert(d3.event.x);
    d3.select(this).select("circle")
        .attr("cx",x(x_A));
    d3.select(this).select("text")
        .attr("x",x(x_A));
    d3.select("#approx").remove();
    plot_approx(svg, x_A, x_B, N);
    };

function dragmove_B(d){
    if ((x.invert(d3.event.x)<sol)||(x.invert(d3.event.x)>x_max)){return}
    x_B = x.invert(d3.event.x);
    d3.select(this).select("circle")
        .attr("cx",x(x_B));
    d3.select(this).select("text")
        .attr("x",x(x_B));
    
    d3.select("#approx").remove();
    plot_approx(svg, x_A, x_B, N);
    };