function vis1(data, div) {
  const margin = {top: 40, right: 10, bottom: 40, left: 100};

  const visWidth = 900 - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = div.append('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // add title  
  g.append("text")
  .attr("x", visWidth / 2)
  .attr("y", -margin.top + 10)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")
  .attr("font-family", "sans-serif")
  .attr("font-size", "16px")
  .text("Countries");

  // format number
  const siFormat = d3.format(".2s")
  const formatNum = (num)=>{ return num === 1 ? siFormat(0) : siFormat(num).replace("G","B") }
  // create log scales
  maxReceivedValue = d3.max(data, d=>d.received)
  const x = d3.scaleLog()
              .base(10)
              .domain([1,maxReceivedValue]).nice() // log(0) is -inf. we set minimum value to 1, which return 0 as result
              .range([0, visWidth])

  maxDonatedValue = d3.max(data, d=>d.donated)
  const y = d3.scaleLog()
              .base(10)
              .domain([1,maxDonatedValue]).nice()  // log(0) is -inf. we set minimum value to 1, which return 0 as result
              .range([visHeight, 0]);


  // create and add axes
  const xAxis = d3.axisBottom(x)
                  .tickFormat(formatNum);
  const yAxis = d3.axisLeft(y)
                  .tickFormat(formatNum);

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
    .text("Received Money in U.S. dollars");
  g.append("g")
    .call(yAxis)
    .call(g => g.selectAll(".domain").remove())
    .append("text")
    .attr("x", 90)
    .attr("y", -20)
    .attr("fill", "black")
    .attr("dominant-baseline", "middle")
    .attr("font-size",13)
    .text("Donated Money in U.S. dollars");


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

  // draw points and hover effect
  g.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => (d.received === 0 ? x(1) : x(d.received)) )
      .attr("cy", d => (d.donated === 0 ? y(1) : y(d.donated)) )
      .attr("fill", '#ac3973')
      .attr("r", 5)
      .attr("opacity", 0.7)
      .on("mouseover", function(d, i){
        // change color and circle size
        d3.select(this).transition().duration(100).attr('r', 7).attr("fill", 'orange')
        // append text
        g.append("text")
          .datum(d)
          .attr("id", 'country' + i)
          .attr("x", d => (d.received === 0 ? x(1)-30 : x(d.received) - 60) )
          .attr("y", d => (d.donated === 0 ? y(1)-13 : y(d.donated) - 10 ) )
          .attr("fill", "black")
          .attr("opacity", 0.7)
          .text(d=>d.country + " (" + formatNum(d.received) + ", " + formatNum(d.donated) + ")")

      })
      .on("mouseout", function(d, i){
        // change it back
        d3.select(this).transition().duration(100).attr('r', 4).attr("fill", '#ac3973')
        // remove text
        d3.select("#" + 'country' + i).remove()

      });



}
