# CountryDonationsVisual

This is a course project containing three mini projects, which address different aspects of data visualization. By using D3 library, I built visualizations out of a given dataset: country donations over year. As the change of focus on the data, the visualization also changes in order to answer issues effectively.  



# CS6313 Information Visualization

By Prof Enrico Bertini

# How to use

 1. Download project folder
 2. Run it over localhost to see the visualization

## Mini project 1: geolocation


**Visualization 1:**

I decided to use scatterplot as my visualization implementation. Each dot encodes a country, x-axis encodes money received by other countries, y-axis encodes who’s donating the money. Since the money data is very large, I used d3.scaleLog to scale the larger number smoothly. Otherwise, I’ll end up with very long axis for both x and y.

I didn’t use color to encode categorical value: Country. The reason is that there are about 47 countries in this graph, it’s hard to distinguish one another. And it’s hard to show text directly over each dot because some of them are impacted together and text will overlap. Therefore, I used tooltips to show more information without distracting by any other factors. When mouse is hovering the dot, it enlarged and show country name for that dot. Here the text and enlarged dot are encoding the country name and its position relate to x-axis and y-axis.


**Visualization 2:**

First of all, I make the visualization large because countries in Europe are so closed to each other. It’s hard to distinguish them in the map unless making the map bigger. I didn’t use world map instead of longitude and latitude to encode country position. I found this is easy to draw my visualization and the shape of countries doesn’t matter to this problem, only about its geographical location, which is encoded by longitude(x-axis) and latitude (y-axis).

Each country is encoded by a pie chart, which contains only two categories: received and donated. Therefore, we can see how a countries distributed in terms of received money and donated money. We encoded the geological by Latitude and Longitude, the pie position in this graph is based on geolocation in the real world. Therefore we can see neighboring countries.

Same tooltips tricks applied here.(A much bigger pie and country name shown if mouse hovers)


**Visualization 3:**

Same idea as Visualization 2. Instead, the pie contains 5 top most frequent purposes of disbursements.

Same tooltips tricks applied here to show detailed information about each pie. (larger pie and country name.)

## Mini project 2: temporal


**Visualization 1:**

I created multiple groups of line chart for each countries. The question is focusing on a country’s donated money and received money over years, and we need to list all countries. Clearly, line chart is best to show the changes over time. However, if we fit all countries into one chart, that’s difficult to distinguish all the lines. By instinct, multiple line charts would be a better solution, where each chart is represent a country. Two different lines are on the chart where one is encoding donated money and another on is encoding received money.

Advantage: It’s clear to show the changes of donate vs received over time for each country.
Disadvantage: It takes much more space to fit in all the charts.



**Visualization 2:**

Firstly, I sorted out the top 10 purposes in terms of total amount of disbursement. Since we don’t need the unspecified purpose, which if included will be the 10th. We need to first remove unspecified purpose and get the top 10 purposes. 

Base on it, we generate our data for a stacked Area chart. The reason is that a stacked Area can show how different purposes distributed over a specific time.  And if we make the y-axis as percentage, we can know the distribution very easily.

Advantage: clearly show the purpose distribution clearly for a given time period. And we also preserve the ‘change of time’ properties if we used area chart for temporal data.
Disadvantage: 10 different colors encode 10 different purposes. It gets harder to distinguish each category when number of colors become larger. Especially when area is so small.

## Mini project 3: network

**Visualization 1:**

I used Matrix to represent relationships between donors and recipients. Each cell encodes a total amount of donations from a donor country to a recipient country. Color intensity encodes how much the donations is. If the cell contains no color, it indicates that no donations occurred in both countries.

From the chart, we can say United States, Japan, Germany, and United Kingdom are the major donors. India and Thailand are the major recipients. Japan donated to India the most amount of money.


**Visualization 2:**

For this task, instead of amount of donations, we focus on 5 top purposes with respect to the relationships between two countries. The idea is simple: converting each single cell to a pie chart. By the pie chart, we can tell how much percentage of one purpose a donor used to donate the money to the recipient.

For France, all the donations contain the social/welfare services. In fact, this purpose appears in a lot of places.

For Korea, Italy, Switzerland, and Australia donated money only for Higher education purpose.
For Saudi Arabia, this country didn’t donate to any top 10 recipients.


**Visualization 3:**

Same idea as Visualization 1. In addition, we added time to explain our data. User interaction is a good way to encode time.

A button encode the functionality of time change.
