function vis2(data,top10Purposes,div) {
  const margin = {top: 30, right: 20, bottom: 100, left: 120};

  const visWidth = 1100- margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = div.append('svg')
                  .attr('width', visWidth + margin.left + margin.right)
                  .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);


const stackedExpand = d3.stack()
                        .keys(top10Purposes)
                        .offset(d3.stackOffsetExpand)(data)

// const stackedExpand  = d3.stack()
//                         .keys(top10Purposes)(data)


const color = d3.scaleOrdinal()
                  .domain(top10Purposes)
                  .range(d3.schemeTableau10)

 // set legend
 svg.append("g")
 .attr("class", "legendOrdinal")
 .attr("transform", `translate(${visWidth-125},0)`)
 .attr("font-size", "12px")
 .attr("opacity", 0.85);

const legendOrdinal = d3.legendColor()
                     .shapeWidth(10)
                     .shapeHeight(10)
                     .cells(10)
                     .orient("vertical")
                     .scale(color) 

svg.select(".legendOrdinal")
 .call(legendOrdinal);


// compute useful information
// const maxTotalAmount = d3.max(data, d => d.total)
const YearsExtent = d3.extent(data, d => d.year)

// format number
const siFormat = d3.format(".2s")
const formatNum = (num)=>{ return siFormat(num).replace("G","B") }

const x = d3.scaleTime()
            .domain(YearsExtent.map(d=>new Date(d.toString())))
            .range([0, visWidth-250]);

 const y = d3.scaleLinear()
              .domain([0,1]).nice()  
              .range([visHeight, 0]);

const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%Y'))
const yAxis = d3.axisLeft(y).ticks(7).tickFormat(d3.format('.0%'))

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
    .attr('x', -120)
    .attr('y', visHeight/2)
    .text('Percentage of Money($)');

const area = d3.area()
                .x(d=>x(new Date(d.data.year.toString())))
                .y1(d => y(d[1]))
                .y0(d => y(d[0]));

g.selectAll('.series')
    .data(stackedExpand)
    .join('g')
      .attr('fill', d => color(d.key))
      .attr('class', 'series')
    .append('path')
      .datum(d => d)
      .attr('d', area);

}
