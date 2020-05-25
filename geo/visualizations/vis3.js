function vis3(data, div) {
  const margin = {top: 30, right: 20, bottom: 100, left: 100};

  const visWidth = 1600 - margin.left - margin.right;
  const visHeight = 800 - margin.top - margin.bottom;

  const svg = div.append('svg')
                  .attr('width', visWidth + margin.left + margin.right)
                  .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // get top_5 purpose of disbursement
  const purpose_names = Object.keys(data[0]).filter(d=>d !=="" && d !=="country" && d !== "latitude" && d !== "longitude")

  // set legend
  const ordinal = d3.scaleOrdinal()
                            .domain(purpose_names)
                            .range(d3.schemeTableau10)
  svg.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", `translate(${visWidth - 120},40)`)
      .attr("opacity", 0.85);

  const legendOrdinal = d3.legendColor()
                          .shapeWidth(20)
                          .cells(10)
                          .orient("vertical")
                          .scale(ordinal) 
    
  svg.select(".legendOrdinal")
      .call(legendOrdinal);

 // add title  
 g.append("text")
 .attr("x", visWidth / 2)
 .attr("y", -margin.top + 10)
 .attr("text-anchor", "middle")
 .attr("dominant-baseline", "hanging")
 .attr("font-family", "sans-serif")
 .attr("font-size", "16px")
 .text("Percentage of 5 top disbursement purposes over countries");
  
  // scale longitude on x
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d=>d.longitude)).nice() // log(0) is -inf. we set minimum value to 1, which return 0 as result
    .range([0, visWidth]);
  
  // scale latitude on y
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d=>d.latitude)).nice()  // log(0) is -inf. we set minimum value to 1, which return 0 as result
    .range([visHeight, 0]);

  // create and add axes
  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)

  g.append("g")
    .attr("transform", `translate(0, ${visHeight})`)
    .call(xAxis)
    .call(g => g.selectAll(".domain").remove())
    .append("text")
    .attr("x", visWidth / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("font-size",13)
    .text("Longitude");
  g.append("g")
    .call(yAxis)
    .call(g => g.selectAll(".domain").remove())
    .append("text")
    .attr("x", -40)
    .attr("y", visHeight/2)
    .attr("fill", "black")
    .attr("dominant-baseline", "middle")
    .attr("font-size",13)
    .text("Latitude");

// draw grid
const grid = g.append("g")
              .attr("class", "grid");
lightgray = "#dcdcdc"
grid.append("g")
    .selectAll("line")
    .data(y.ticks())
    .join("line")
    .attr("stroke", lightgray)
    .attr("x1", 0)
    .attr("x2", visWidth)
    .attr("y1", d => 0.5 + y(d))
    .attr("y2", d => 0.5 + y(d))
    .attr("opacity", 0.4);

grid.append("g")
    .selectAll("line")
    .data(x.ticks())
    .join("line")
    .attr("stroke", lightgray)
    .attr("x1", d => 0.5 + x(d))
    .attr("x2", d => 0.5 + x(d))
    .attr("y1", d => 0)
    .attr("y2", d => visHeight)
    .attr("opacity", 0.4);


newData = data.map(d=>({
  country:d.country,
  latitude: d.latitude,
  longitude: d.longitude,
  moneyPurposes:purpose_names.map(x=>({name:x,count:d[x]}))
}));
// create the pie and area generators
// console.log(newData)
const pie = d3.pie()
.value(d => d.count);

const arc_1 = d3.arc()
                .innerRadius(0)
                .outerRadius(9);
const arc_2 = d3.arc()
                .innerRadius(0)
                .outerRadius(30);

const color = d3.scaleOrdinal()
                .domain(purpose_names)
                .range(d3.schemeTableau10)

const pieGroups = g.selectAll('.pieGroup')
                    .data(newData)
                    .join('g')
                    .attr('class', 'pieGroup')
                    .attr('transform', d => `translate(${x(d.longitude)},${y(d.latitude)})`) 
                    .on("mouseover", function(d, i){
                      // make pie bigger
                      d3.select(this)
                        .selectAll('path')
                        .attr('d', d => arc_2(d))
                        .attr('fill', d => color(d.data.name))
                      // append text
                      g.append("text")
                        .datum(d)
                        .attr("id", 'country' + i)
                        .attr("x", d => x(d.longitude) - 50)
                        .attr("y", d => y(d.latitude) + 60)
                        .attr("fill", "black")
                        .attr("opacity", 0.7)
                        .text(d=>d.country)
                    })
                    .on("mouseout", function(d, i){
                      // change it back
                      d3.select(this)
                        .selectAll('path')
                        .attr('d', d => arc_1(d))
                        .attr('fill', d => color(d.data.name))
                        .attr("opacity", 0.85)
                      // remove text
                      d3.select("#" + 'country' + i).remove()
                  
                    });
                  

pieGroups.selectAll('path')
  .data(d => pie(d.moneyPurposes))
  .join('path')
  .attr('d', d => arc_1(d))
  .attr('fill', d => color(d.data.name))
  .attr("opacity", 0.85)




}
