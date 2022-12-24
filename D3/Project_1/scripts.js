// Helpers
const roundDecimals = noOfDecimals => value => 
  Math.round(value * (10 ** noOfDecimals)) / (10 ** noOfDecimals)
const roundTo2Decimals = roundDecimals(2)
// Closure to prevent leakage of global variables
;(async ({
    selectorForRoot,
    d3,
    URL, 
    width, 
    height, 
    margin : { top, left, right, bottom },
    padding,
    spacing : spaceBetweenBars
  })=>{
  const response = await fetch(URL);
  const data = (await response.json()).data;
  const root = d3.select(selectorForRoot);
  width = width - left - right 
  height = height - top - bottom 
  // Chart Element
  const chart = root
    .append('svg')
    .attr('width', width)
    .attr('height',height)
  // ToolTip Element
  const tooltip = root
    .append('div')
    .attr('id','tooltip')
    .style('visibility','hidden')
    .style('text-align','center')
    .text('tooltip')
  // Title
  chart
    .append('text')
    .attr('id','title')
    .attr('x',width / 2 - 50)
    .attr('y',padding)
    .text('USA GDP Bar Chart')
  // Values
  const xValues = data.map(value => new Date(value[0]))
  const yValues = data.map(value => value[1])
  // Ranges
  const xRange = [ padding, width - padding ]
  const yRange = [ 0, height - ( 2 * padding ) ]
  // X Scale
  const xScale = d3.scaleLinear()
    .domain([ 0, xValues.length - 1 ])
    .range(xRange)
  // Y Scale
  const yScale = d3.scaleLinear()
    .domain([0,d3.max(yValues)])
    .range(yRange)
  // Scale for Axes
  const xAxisScale = d3.scaleTime()
    .domain([d3.min(xValues),d3.max(xValues)])
    .range(xRange)
  const yAxisScale = d3.scaleLinear()
    .domain([0,d3.max(yValues)])
    .range([height - padding, padding])
  // Position Axes
  const xAxis = d3.axisBottom(xAxisScale)
  const yAxis = d3.axisLeft(yAxisScale)
  // Append Axes
  chart.append('g')
    .call(xAxis)
    .attr('id','x-axis')
    .style('transform', `translate(${padding}px,${(height - padding)}px)`)
  chart.append('g')
    .call(yAxis)
    .attr('id','y-axis')
    .style('transform', `translate(${(2*padding)}px,0px)`)
  // Add Bars
  chart.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class','bar')
    .attr('width', width / xValues.length)
    .attr('data-date', item => item[0])
    .attr('data-gdp', item => item[1])
    .attr('height', item => yScale(item[1]))
    .attr('x', (item,index) => xScale(index) + padding)
    .attr('y', item => (height - padding) - yScale(item[1]))
    .attr('fill','dodgerblue')
    .on('mouseover', (event,item) =>{
      tooltip
        .transition()
        .style('visibility','visible')
        .text(item[0])
      document
        .getElementById('tooltip')
        .setAttribute('data-date',item[0])
    })
    .on('mouseout',event =>{
      tooltip.transition()
        .style('visibility','hidden')
    })
})({
  selectorForRoot : '#chart',
  d3 : d3,
  URL : 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  width : 600,
  height : 500,
  margin : {
    top : 50,
    left : 50,
    right : 50,
    bottom : 50
  },
  padding : 20,
  spacing : 0
});

