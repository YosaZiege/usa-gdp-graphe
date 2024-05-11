let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const req = new XMLHttpRequest();

let data;
let values = [];

let yScale;
let xScale;
let yAxis;
let xAxis;

let width = 800;
let height = 600;
let padding = 40;
let svg = d3.select('svg');

const drawCanvas = () => {
    svg.attr('width', width)
       .attr('height', height);
};

const generateScales = () => {
    yScale = d3.scaleLinear()
               .domain([0, d3.max(values, (d) => d[1])])
               .range([height - padding, padding]);
    
    xScale = d3.scaleTime()
               .domain([new Date(values[0][0]), new Date(values[values.length - 1][0])])
               .range([padding, width - padding]);
};

const generateAxes = () => {
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
};

const drawBars = () => {
    let tooltip = d3.select('body')
                    .append('div')
                    .attr("id", "tooltip")
                    .style('visibility','hidden')

    svg.selectAll("rect")
       .data(values)
       .enter()
       .append('rect')
       .attr("class","bar")
       .attr("data-date" , (d) => d[0])
       .attr("data-gdp" , (d) => d[1])
       .attr('y', (d) => yScale(d[1]))
       .attr('x', (d) => xScale(new Date(d[0])))
       .attr('width', (width - 2 * padding) / values.length)
       .attr('height', (d) => height - padding - yScale(d[1]))
       
       .on('mouseover' , (d) => {
        tooltip.transition()
                .style('visibility' , 'visible')
               
            tooltip.text(d[0])
                   .attr('data-date' , d[0])
       })
       .on('mouseout', (d) => {
            tooltip.transition()
                   .style('visibility' , "hidden")
       })

    svg.append('g')
       .attr('id' ,"x-axis")
       .attr('transform', "translate(0, " + (height - padding) + ")")
       .call(xAxis);

    svg.append('g')
       .attr('id' ,"y-axis")
       .attr('transform', "translate(" + padding + ", 0)")
       .call(yAxis);
};

req.open('GET', url, true);
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    drawCanvas();
    generateScales();
    generateAxes();
    drawBars();    
};
req.send();
