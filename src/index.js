import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

//Mock data
const data = [
    {title:"Doctor Strange", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 2, likes: 4, superlikes: 2}},
    {title:"Doctor Weird", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 1, likes: 6, superlikes: 1}},
    {title:"Doctor Not Strange oh god no", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 2, likes: 3, superlikes: 0}},
    {title:"Doctor Not Weird", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 5, likes: 1, superlikes: 1}},
    {title:"Haa haa", img:"http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: {dislikes: 5, likes: 1, superlikes: 1}}
  ]

//used to "emulate" network
function downloadState() {
  return data
}

//Stacked Bar Chart
class LikeChart extends React.Component {
  constructor(props){
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
  }

  componentDidMount() {
    let size = this.props.data.length
    const data = this.props.data
    data.sort(this._sortLikes);
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      };
    var textSpace = 100;
    var width = window.innerWidth - margin.left - margin.right;
    var height = window.innerHeight*(3/4) - margin.top - margin.bottom;

    var svg = d3.select(".wrapper").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("align", "center")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width*(2/3)]);
    var y = d3.scaleBand().range([height, 0]);

    var xAxis = d3.axisTop(x).ticks(10);
    var yAxis = d3.axisLeft(y);

    x.domain([0, d3.max(data, function(d) { return d.likes + d.dislikes + d.superlikes; })]);
    y.domain(data.map(function(d) { return d.label; }))
      .paddingInner(0.1)
      .paddingOuter(0.5);

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .attr("transform", "translate(" + width*(1/3) + "," + 0 + ")");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("transform", "translate(" + width*(1/3) + "," + 0 + ")");

    this.insert(svg, data, width, x, y)
    this.setState({svg: svg});
  }

  componentDidUpdate() {
      const data = this.props.data
      data.sort(this._sortLikes);
      var margin = {
          top: 20,
          right: 20,
          bottom: 30,
          left: 40
        };
      let svg = this.state.svg
      var width = window.innerWidth - margin.left - margin.right;
      var height = window.innerHeight*(3/4) - margin.top - margin.bottom;
      var x = d3.scaleLinear().range([0, width*(2/3)]);
      var y = d3.scaleBand().range([height, 0]);

      x.domain([0, d3.max(data, function(d) { return d.likes + d.dislikes + d.superlikes; })]);
      y.domain(data.map(function(d) { return d.label; })).paddingInner(0.1).paddingOuter(0.5);

      var xAxis = d3.axisTop(x).ticks(10);
      var yAxis = d3.axisLeft(y);

      svg.select('.x.axis').transition().duration(300).call(xAxis);
      svg.select(".y.axis").transition().duration(300).call(yAxis);

      var bars = svg.selectAll(".bar").data(data)
      this.insert(svg, data, width, x, y);
      this.updateGraph(svg, data, width, x, y);
  }

  insert(svg, data, width, x, y) {
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.dislikes); })
        .attr("transform", "translate(" + width*(1/3) + "," + 0 + ")")
        .attr("fill", "#f44336")

    svg.selectAll(".bar2")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", function(d) { return x(d.dislikes); })
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.likes); })
        .attr("fill", "#4caf50")
        .attr("transform", "translate(" + width*(1/3) + "," + 0 + ")");

    svg.selectAll(".bar3")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar3")
        .attr("x", function(d) { return x(d.dislikes) + x(d.likes); })
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.superlikes); })
        .attr("fill", "#ffc107")
        .attr("transform", "translate(" + width*(1/3) + "," + 0 + ")");

  }

  updateGraph(svg, data, width, x, y) {
    svg.selectAll(".bar")
        .data(data)
        .transition()
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.dislikes); })

    svg.selectAll(".bar2")
        .data(data)
        .transition()
        .attr("x", function(d) { return x(d.dislikes); })
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.likes); })

    svg.selectAll(".bar3")
        .data(data)
        .transition()
        .attr("x", function(d) { return x(d.dislikes) + x(d.likes); })
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.superlikes); })
  }

  _sortLikes(a, b) {
    return (a.likes + 2*a.superlikes - a.dislikes) - (b.likes + 2*b.superlikes - b.dislikes)
  }

  _sortGraph(a, b) {
    return d3.ascending((a.likes + 2*a.superlikes - a.dislikes), (b.likes + 2*b.superlikes - b.dislikes));
  }

  render() {
    return (
      <div className="container">
        <div className="wrapper" style={{textAlign:'center'}}>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: []
    }
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    let state = downloadState();
    this.setState({items: state});
  }

  _updateState(data) {
    this.setState({items: data});
  }

  onClick() {
    let state = this.state.items;
    state[0].votes.likes += 1;
    this.setState({items: state});
  }

  render() {
      let rdata = this.state.items.map((item) => {return {label: item.title, dislikes:item.votes.dislikes, likes: item.votes.likes, superlikes: item.votes.superlikes}});
      return <div><LikeChart data={rdata} /><button type="button" onClick={this.onClick}>Increase</button></div>
  }
}


ReactDOM.render(
  <App />, document.getElementById('target')
);
