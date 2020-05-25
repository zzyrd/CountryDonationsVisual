// Load the datasets and call the functions to make the visualizations

Promise.all([
  d3.json('data/useful_info.json'),
  d3.csv('data/visual_1_data.csv',d3.autoType),
  d3.json('data/visual_2_data.json'),
  d3.json('data/visual_3_time_data.json')
]).then(([info_data,data1,data2,data3]) => {
  vis1(info_data, data1, d3.select('#vis1'));
  vis2(info_data, data2, d3.select('#vis2'));
  vis3(info_data, data3, d3.select('#vis3'));
});
