function vis1(info_data, data, div) {
  const margin = {top: 70, right: 10, bottom: 40, left: 220};

  const visWidth = 1100 - margin.left - margin.right;
  
  // get useful data information
  const donors = info_data.donors
  const recipients = info_data.recipients
  
  // color
  const color = d3.scaleSequential(d3.interpolateOranges)
                  .domain(d3.extent(data, d=>d.amount))

  // legend
  d3.select('#vis1_legend')
    .append(() => continuousLegend(color, 600, 70));

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

  // add description for x-axis  
  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -70)
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
  g.selectAll('rect')
    .data(data)
    .join('rect')
      .attr('x', d => x(d.donor))
      .attr('y', d => y(d.recipient))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d=>color(d.amount))


}

// Define legend. Contributed by Daniel Kerrigan
function continuousLegend(color, width, height) {
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height);
  
  // margin set up
 
  const margin = {top: 20, bottom: 0, left: 220, right: 20};
  
  const w = width - margin.left - margin.right;  
  const h = height - margin.top - margin.bottom - 40;
  
  const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
  
  // create a canvas element to draw the legend
  
  const canvas = document.createElement('canvas');
  
  canvas.width = w;
  canvas.height = h;
  
  const context = canvas.getContext("2d");

  for (let i = 0; i < w; ++i) {
    context.fillStyle = color.interpolator()(i / w);
    context.fillRect(i, 0, 100, h);
  }

  // add canvas to SVG as an image
  g.append('svg:image')
      .attr('href', canvas.toDataURL())
  
  // set up the axis
  // format number
  const siFormat = d3.format(".2s")
  const formatNum = (num)=>{ return siFormat(num).replace("G","B") }
  
  // create scale for tick marks
  const domain = color.domain();
  // sequential scales have domain length 2
  // diverging scales have domain length 3
  const range = domain.length === 2 ?
        [0, w] :
        [0, w/2, w];
  const scale = d3.scaleLinear()
      .domain(domain)
      .range(range);
  
  // create and add axis
  const axis = d3.axisBottom(scale)
      .ticks(7)
      .tickFormat(formatNum);
  g.append('g')
      .attr('transform', `translate(0, ${h})`)
      .call(axis)
      .call(g => g.select('.domain').remove());

 // add title  
  g.append("text")
  .attr("x", width / 2 - 90)
  .attr("y", margin.top-35)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")
  .attr("font-family", "sans-serif")
  .attr("font-size", "14px")
  .text("Commitment Amount through donations");


  return svg.node();
}