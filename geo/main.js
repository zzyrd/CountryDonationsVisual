// Load the datasets and call the functions to make the visualizations

Promise.all([
  d3.csv('data/visual_data_1.csv', d3.autoType),
  d3.csv('data/visual_data_2.csv',d3.autoType),
  d3.csv('data/visual_data_3.csv',d3.autoType)
]).then(([data1,data2, data3]) => {
  vis1(data1, d3.select('#vis1'));
  vis2(data2, d3.select('#vis2'));
  vis3(data3, d3.select('#vis3'));
});
