let margin = { top: 10, right: 0, bottom: 25, left: 35 };
let width = 800 - margin.left - margin.right;
let height = 625 - margin.top - margin.bottom;

const data = [
  { name: "Alice", math: 37, science: 62, language: 54 },
  { name: "Billy", math: null, science: 34, language: 5 },
  { name: "Cindy", math: 86, science: 48, language: null },
  { name: "David", math: 144, science: null, language: 65 },
  { name: "Emily", math: 59, science: 73, language: 29 }
];

let svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(responsivefy)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

let yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
const yAxis = svg.append("g").call(d3.axisLeft(yScale));

let xScale = d3
  .scaleBand()
  .padding(0.2)
  .domain(data.map(d => d.name))
  .range([0, width]);
let xAxis = d3.axisBottom(xScale);

svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

function render(subject = "math") {
  const t = d3.transition().duration(500);
  const update = svg
    .selectAll("rect")
    .data(data.filter(d => d[subject]), d => d.name);
  const exit = update
    .exit()
    .transition(t)
    .attr("y", height)
    .attr("height", 0)
    .remove();

  yScale.domain([0, d3.max(data, d => d[subject])]);
  yAxis.transition(t).delay(500).call(d3.axisLeft(yScale));

  update
    .transition(t)
    .delay(500)
    .attr("y", d => yScale(d[subject]))
    .attr("height", d => height - yScale(d[subject]));

  update
    .enter()
    .append("rect")
    .attr("y", height)
    .attr("height", 0)
    .attr("x", d => xScale(d.name))
    .attr("width", () => xScale.bandwidth())
    .style("fill", "cornflowerblue")
    .transition(t)
    .delay(exit.size() ? 1000 : 0)
    .attr("y", d => yScale(d[subject]))
    .attr("height", d => height - yScale(d[subject]));
}

render();

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
