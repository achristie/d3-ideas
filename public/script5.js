let margin = { top: 10, right: 0, bottom: 25, left: 35 };
let width = 800 - margin.left - margin.right;
let height = 625 - margin.top - margin.bottom;

let svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(responsivefy)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("./data4.json", (err, data) => {
  var parseTime = d3.timeParse("%Y/%m/%d");

  data.forEach(company => {
    company.values.forEach(d => {
      d.date = parseTime(d.date);
      d.close = +d.close;
    });
  });

  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(data, d => d3.min(d.values, d => d.date)),
      d3.max(data, d => d3.max(d.values, d => d.date))
    ])
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, d => d3.min(d.values, d => d.close)),
      d3.max(data, d => d3.max(d.values, d => d.close))
    ])
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(yScale));

  const area = d3
    .area()
    .x(d => xScale(d.date))
    .y0(yScale(yScale.domain()[0]))
    .y1(d => yScale(d.close));

  svg
    .selectAll(".area")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "area")
    .attr("d", d => area(d.values))
    .style("stroke", (d, i) => ["#FF9900", "#3369E8"][i])
    .style("stroke-width", 2)
    .style("fill", (d, i) => ["#FF9900", "#3369E8"][i])
    .style("fill-opacity", 0.5);
});

function responsivefy(svg) {
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

  d3.select(window).on("resize." + container.attr("id"), resize);

  function resize() {
    const targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}
