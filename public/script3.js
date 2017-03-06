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

d3.json("./data.json", (err, data) => {
  let yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.expectancy))
    .range([height, 0])
    .nice();
  let yAxis = d3.axisLeft(yScale);

  svg.call(yAxis);

  let xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.cost))
    .range([0, width])
    .nice();

  let xAxis = d3.axisBottom(xScale).ticks(5);

  svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

  let rScale = d3
    .scaleSqrt()
    .domain([0, d3.max(data, d => d.population)])
    .range([0, 40]);

  const circles = svg
    .selectAll("ball")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "ball")
    .attr("transform", d => {
      return `translate(${xScale(d.cost)}, ${yScale(d.expectancy)})`;
    });

  circles
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", d => rScale(d.population))
    .style("fill", "steelblue")
    .style("fill-opacity", 0.5);

  circles
    .append("text")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text(d => d.code);
});

svg
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.subject))
  .attr("y", d => yScale(d.score))
  .attr("width", () => xScale.bandwidth())
  .attr("height", d => height - yScale(d.score))
  .style("fill", "cornflowerblue");

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
