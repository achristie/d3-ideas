const data = [
  { name: "Andrew", score: 90 },
  { name: "Brian", score: 81 },
  { name: "Casey", score: 87 },
  { name: "Donna", score: 85 },
  { name: "Eugene", score: 96 }
];

let bar = d3
  .select(".chart")
  .append("svg")
  .attr("width", 225)
  .attr("height", 300)
  .selectAll("rect")
  .data(data)
  .enter()
  .append("g")
  .attr("transform", (d, i) => "translate(0, " + i * 33 + ")");

function scaleBar(selection, scale) {
  selection.style("transform", "scaleX(" + scale + ")");
}

function fade(selection, opacity) {
  selection.style("fill-opacity", opacity);
}

function setFill(selection, fill) {
  selection.style("fill", fill);
}

bar
  .append("rect")
  .style("width", d => d.score)
  .attr("class", "bar")
  .on("mouseover", function(d, i, elements) {
    d3.select(this).call(scaleBar, 2);
    d3.select(this).call(setFill, "blue");
    d3.selectAll(elements).filter(":not(:hover)").call(fade, 0.5);
  })
  .on("mouseout", function(d, i, elements) {
    d3.select(this).call(scaleBar, 1);
    d3.select(this).call(setFill, "indianred");
    d3.selectAll(elements).call(fade, 1);
  })
  .on("click", () => console.log("hi"));

bar.append("text").attr("y", 20).text(d => d.name);
