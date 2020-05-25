function vis2(info_data, data, div) {
  const margin = {top: 90, right: 10, bottom: 40, left: 220};

  const visWidth = 1200 - margin.left - margin.right;
  
  // get useful data information
  const donors = info_data.donors
  const recipients = info_data.recipients
  const purposes = info_data.purposes
 
  // color
  const color = d3.scaleOrdinal()
                  .domain(purposes)
                  .range(d3.schemeTableau10)


  const x = d3.scaleBand()
              .domain(donors)
              .range([0, visWidth])
              .padding(0.05);

  const visHeight =  x.step() * recipients.length;

  const svg = div.append('svg')
                  .attr('width', visWidth + margin.left + margin.right)
                  .attr('height', visHeight + margin.top + margin.bottom);
  const g = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const y = d3.scaleBand()
              .domain(recipients)
              .range([0, visHeight])
              .padding(0.05)

  // set legend
  svg.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", `translate(0,0)`)
      .attr("font-size", "12px")
      .attr("opacity", 0.9);

  const legendOrdinal = d3.legendColor()
                    .shapeWidth(10)
                    .shapeHeight(10)
                    .cells(10)
                    .orient("vertical")
                    .scale(color) 

  svg.select(".legendOrdinal")
  .call(legendOrdinal);
  

  // add description for x-axis  
  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -80)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .text("Top 20 Donors");

  
  const xAxis = d3.axisTop(x).tickPadding(5)
  const yAxis = d3.axisLeft(y).tickPadding(5)
  g.append('g')
    .call(xAxis)
    .call(g => g.selectAll('.domain').remove())
    .selectAll("text")  
    .style("text-anchor", "start")
    .attr("font-size", "12px")
    .attr("dx", "0")
    .attr("dy", "0")
    .attr("transform", "rotate(-40)")

  g.append('g')
    .call(yAxis)
    .call(g => g.selectAll('.domain').remove())
    .attr("font-size", "12px")
    .append('text')
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'black')
    .attr("font-size", "20px")
    .attr('x', -220)
    .attr('y', visHeight/2)
    .text('Top 10 Recipients');

  // squares
  const pieGroups = g.selectAll('.pieGroup')
                  .data(data)
                  .join('g')
                  .attr('class', 'pieGroup')
                  .attr('transform', d => `translate(${x(d.donor)+x.bandwidth()/2},${y(d.recipient)+y.bandwidth()/2})`) 
 

  const pie = d3.pie()
                .value(d=>d.count)

  const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(20)

  pieGroups.selectAll('path')
       .data(d=>pie(d.purposes))
       .join('path')
       .attr('d', d=>arc(d))
       .attr('fill', d=> color(d.data.purpose))
       .attr('opacity', 0.9)
  

}
