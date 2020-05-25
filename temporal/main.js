// Load the datasets and call the functions to make the visualizations

Promise.all([
  d3.json('data/visual_data_1.json',d3.autoType),
  d3.json('data/visual_data_2.json',d3.autoType),
  d3.json('data/Top10Purposes.json',d3.autoType)
]).then(([data1,data2,top10Purposes]) => {
  vis1(data1, d3.select('#vis1'));
  vis2(data2,top10Purposes,d3.select('#vis2'));
  // vis3(data3, d3.select('#vis3'));
});
