'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Mock data
var data = [{ title: "Doctor Strange", img: "http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: { dislikes: 2, likes: 4, superlikes: 2 } }, { title: "Doctor Weird", img: "http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: { dislikes: 1, likes: 6, superlikes: 1 } }, { title: "Doctor Not Strange oh god no", img: "http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: { dislikes: 2, likes: 3, superlikes: 0 } }, { title: "Doctor Not Weird", img: "http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: { dislikes: 5, likes: 1, superlikes: 1 } }, { title: "Haa haa", img: "http://media.finnkino.fi/1012/Event_11199/portrait_medium/DoctorStrange_1080.jpg", votes: { dislikes: 5, likes: 1, superlikes: 1 } }];

//used to "emulate" network
function downloadState() {
  return data;
}

//Stacked Bar Chart

var LikeChart = function (_React$Component) {
  _inherits(LikeChart, _React$Component);

  function LikeChart(props) {
    _classCallCheck(this, LikeChart);

    var _this = _possibleConstructorReturn(this, (LikeChart.__proto__ || Object.getPrototypeOf(LikeChart)).call(this, props));

    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.componentDidUpdate = _this.componentDidUpdate.bind(_this);
    return _this;
  }

  _createClass(LikeChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var size = this.props.data.length;
      var data = this.props.data;
      data.sort(this._sortLikes);
      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      };
      var textSpace = 100;
      var width = window.innerWidth - margin.left - margin.right;
      var height = window.innerHeight * (3 / 4) - margin.top - margin.bottom;

      var svg = d3.select(".wrapper").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).attr("align", "center").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleLinear().range([0, width * (2 / 3)]);
      var y = d3.scaleBand().range([height, 0]);

      var xAxis = d3.axisTop(x).ticks(10);
      var yAxis = d3.axisLeft(y);

      x.domain([0, d3.max(data, function (d) {
        return d.likes + d.dislikes + d.superlikes;
      })]);
      y.domain(data.map(function (d) {
        return d.label;
      })).paddingInner(0.1).paddingOuter(0.5);

      svg.append("g").attr("class", "x axis").call(xAxis).attr("transform", "translate(" + width * (1 / 3) + "," + 0 + ")");

      svg.append("g").attr("class", "y axis").call(yAxis).attr("transform", "translate(" + width * (1 / 3) + "," + 0 + ")");

      this.insert(svg, data, width, x, y);
      this.setState({ svg: svg });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var data = this.props.data;
      data.sort(this._sortLikes);
      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      };
      var svg = this.state.svg;
      var width = window.innerWidth - margin.left - margin.right;
      var height = window.innerHeight * (3 / 4) - margin.top - margin.bottom;
      var x = d3.scaleLinear().range([0, width * (2 / 3)]);
      var y = d3.scaleBand().range([height, 0]);

      x.domain([0, d3.max(data, function (d) {
        return d.likes + d.dislikes + d.superlikes;
      })]);
      y.domain(data.map(function (d) {
        return d.label;
      })).paddingInner(0.1).paddingOuter(0.5);

      var xAxis = d3.axisTop(x).ticks(10);
      var yAxis = d3.axisLeft(y);

      svg.select('.x.axis').transition().duration(300).call(xAxis);
      svg.select(".y.axis").transition().duration(300).call(yAxis);

      var bars = svg.selectAll(".bar").data(data);
      this.insert(svg, data, width, x, y);
      this.updateGraph(svg, data, width, x, y);
    }
  }, {
    key: 'insert',
    value: function insert(svg, data, width, x, y) {
      svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", 0).attr("height", y.bandwidth()).attr("y", function (d) {
        return y(d.label);
      }).attr("width", function (d) {
        return x(d.dislikes);
      }).attr("transform", "translate(" + width * (1 / 3) + "," + 0 + ")").attr("fill", "#f44336");

      svg.selectAll(".bar2").data(data).enter().append("rect").attr("class", "bar2").attr("x", function (d) {
        return x(d.dislikes);
      }).attr("height", y.bandwidth()).attr("y", function (d) {
        return y(d.label);
      }).attr("width", function (d) {
        return x(d.likes);
      }).attr("fill", "#4caf50").attr("transform", "translate(" + width * (1 / 3) + "," + 0 + ")");

      svg.selectAll(".bar3").data(data).enter().append("rect").attr("class", "bar3").attr("x", function (d) {
        return x(d.dislikes) + x(d.likes);
      }).attr("height", y.bandwidth()).attr("y", function (d) {
        return y(d.label);
      }).attr("width", function (d) {
        return x(d.superlikes);
      }).attr("fill", "#ffc107").attr("transform", "translate(" + width * (1 / 3) + "," + 0 + ")");
    }
  }, {
    key: 'updateGraph',
    value: function updateGraph(svg, data, width, x, y) {
      svg.selectAll(".bar").data(data).transition().attr("height", y.bandwidth()).attr("y", function (d) {
        return y(d.label);
      }).attr("width", function (d) {
        return x(d.dislikes);
      });

      svg.selectAll(".bar2").data(data).transition().attr("x", function (d) {
        return x(d.dislikes);
      }).attr("y", function (d) {
        return y(d.label);
      }).attr("width", function (d) {
        return x(d.likes);
      });

      svg.selectAll(".bar3").data(data).transition().attr("x", function (d) {
        return x(d.dislikes) + x(d.likes);
      }).attr("height", y.bandwidth()).attr("y", function (d) {
        return y(d.label);
      }).attr("width", function (d) {
        return x(d.superlikes);
      });
    }
  }, {
    key: '_sortLikes',
    value: function _sortLikes(a, b) {
      return a.likes + 2 * a.superlikes - a.dislikes - (b.likes + 2 * b.superlikes - b.dislikes);
    }
  }, {
    key: '_sortGraph',
    value: function _sortGraph(a, b) {
      return d3.ascending(a.likes + 2 * a.superlikes - a.dislikes, b.likes + 2 * b.superlikes - b.dislikes);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement('div', { className: 'wrapper', style: { textAlign: 'center' } })
      );
    }
  }]);

  return LikeChart;
}(_react2.default.Component);

var App = function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App() {
    _classCallCheck(this, App);

    var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this2.state = {
      items: []
    };
    _this2.onClick = _this2.onClick.bind(_this2);
    return _this2;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var state = downloadState();
      this.setState({ items: state });
    }
  }, {
    key: '_updateState',
    value: function _updateState(data) {
      this.setState({ items: data });
    }
  }, {
    key: 'onClick',
    value: function onClick() {
      var state = this.state.items;
      state[0].votes.likes += 1;
      this.setState({ items: state });
    }
  }, {
    key: 'render',
    value: function render() {
      var rdata = this.state.items.map(function (item) {
        return { label: item.title, dislikes: item.votes.dislikes, likes: item.votes.likes, superlikes: item.votes.superlikes };
      });
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(LikeChart, { data: rdata }),
        _react2.default.createElement(
          'button',
          { type: 'button', onClick: this.onClick },
          'Increase'
        )
      );
    }
  }]);

  return App;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('target'));
