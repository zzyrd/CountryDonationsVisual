function vis1(data, div) {
  const margin = {top: 40, right: 10, bottom: 40, left: 80};

  const visWidth = 300 - margin.left - margin.right;
  const visHeight = 200 - margin.top - margin.bottom;
  
    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  const svg = div.selectAll("uniqueChart")
                .data(data)
                .enter()
                .append("svg")
                  .attr("width", visWidth + margin.left + margin.right)
                  .attr("height", visHeight + margin.top + margin.bottom)
  const g = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  // Add titles
  g.append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(d=>d.countryName)
    .style("fill", 'black' )

  // color for received and donated categories
  const color = d3.scaleOrdinal()
                  .domain(['received', 'donated'])
                  .range(d3.schemeCategory10)
  // set legend
  g.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", `translate(${visWidth-60},0)`)
      .attr("font-size", "12px")
      .attr("opacity", 0.85);

  const legendOrdinal = d3.legendColor()
                          .shapeWidth(10)
                          .shapeHeight(3)
                          .cells(10)
                          .orient("vertical")
                          .scale(color) 

  svg.select(".legendOrdinal")
      .call(legendOrdinal);

  // compute useful information
  function getAmounts(data){
          const temp = data.map(d=>d.money.map(v=>v.details.map(x=>({amount:x.amount}) )))
          return temp.map(d=>d.flat()).flat() 
  }
  function getYears(data){
          const temp = data.map(d=>d.money.map(v=>v.details.map(x=>({year:x.year}) )))
          return temp.map(d=>d.flat()).flat()

  }
  const Amounts = getAmounts(data)
  const Years = getYears(data)
  const AmountsExtent = d3.extent(Amounts, d=>d.amount)
  const YearsExtent = d3.extent(Years, d=>d.year)

   // format number
  const siFormat = d3.format(".2s")
  const formatNum = (num)=>{ return siFormat(num).replace("G","B") }


  // scale x  
  const x = d3.scaleTime()
                .domain(YearsExtent.map(d=>new Date(d.toString())))
                .range([0, visWidth]);
  // scale y. since our money are very large number, use log scale would be beneficial to visualize
  const y = d3.scaleLog()
              .base(10)
              .domain(AmountsExtent).nice() 
              .range([visHeight, 0]);

  // create x and y axis
  const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%Y'))
  const yAxis = d3.axisLeft(y).ticks(8).tickFormat(formatNum)

  g.append('g')
    .attr('transform', `translate(0,${visHeight})`)
    .call(xAxis)
    .call(g => g.selectAll('.domain').remove());

  g.append('g')
    .call(yAxis)
    .call(g => g.selectAll('.domain').remove())
    .append('text')
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'black')
      .attr('x', -80)
      .attr('y', visHeight/2)
      .text('Money($)');
  
  // define line
  const line = d3.line()
                  .x(d => x(new Date(d.year.toString())))
                  .y(d => y(d.amount))

//  Draw the line with received data
  g.append('path')
      .datum(d => {
        cur_data = d.money.find(v=>v.type === 'received')
        return cur_data ? cur_data.details : [{year: YearsExtent[0], amount: AmountsExtent[0]}]        
      })
      .attr('fill', 'none')
      .attr('stroke',color('received'))
      .attr('stroke-width', 1.5)
      .attr('d', line);
// Draw the line with donated data
  g.append('path')
      .datum(d => {
        cur_data = d.money.find(v=>v.type === 'donated')
        return cur_data ? cur_data.details : [{year: YearsExtent[0], amount: AmountsExtent[0]}]
      })
      .attr('fill', 'none')
      .attr('stroke',color('donated'))
      .attr('stroke-width', 1.5)
      .attr('d', line);

// console.log(data)
}
