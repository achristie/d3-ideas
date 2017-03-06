d3
  .select("#block")
  .transition()
  .duration(500)
  .delay(750)
  .ease(d3.easeCubicOut)
  .style("width", "400px")
  .transition()
  .duration(500)
  .ease(d3.easeCubicOut)
  .style("height", "600px")
  .transition()
  .duration(500)
  .ease(d3.easeQuadOut)
  .style("background-color", "purple");

const t = d3.transition().delay(1000).duration(1000);

d3.selectAll(".block").transition(t).style();
