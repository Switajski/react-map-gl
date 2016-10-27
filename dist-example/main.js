'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _traccar = require('./data/traccar.json');

var _traccar2 = _interopRequireDefault(_traccar);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _route = require('./examples/route.react');

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var App = (_class = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _window2.default.addEventListener('resize', _this._onWindowResize);
    _this.state = {
      width: _window2.default.innerWidth,
      route: _this.transform(_traccar2.default),
      routeCounter: 0,
      server: 'gps-tracker.switajski.de'
    };
    return _this;
  }

  _createClass(App, [{
    key: '_onWindowResize',
    value: function _onWindowResize() {
      this.setState({ width: _window2.default.innerWidth });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var me = this;
      console.log("mounted");

      var options = {
        url: 'http://' + this.state.server + '/api/reports/route?_dc=1477399518102&deviceId=1&type=%25&from=2016-10-14T12%3A14%3A00.000Z&to=2016-10-14T18%3A00%3A00.000Z',
        headers: {
          'Accept': 'application/json'
        }
      };

      // TODO: temporary code to test second color with route requested
      (0, _request2.default)(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // TODO: this should not replace the ROUTE, but add a second one
          var futureState = this.state.route;
          futureState.push(this.createCoordinates(JSON.parse(body)));
          this.setState({ route: futureState });
          this.setState({ routeCounter: this.state.routeCounter + 1 });
        }
      }.bind(this));
      // TODO: end - decomment next line

      this.connectToWebsocket();
    }
  }, {
    key: 'connectToWebsocket',
    value: function connectToWebsocket() {
      var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var me = this;

      var protocol = _window2.default.location.protocol === 'https:' ? 'wss:' : 'ws:';
      var client = new WebSocket(protocol + '//' + this.state.server + '/api/socket');

      client.onerror = function () {
        console.log('Connection Error');
      };

      client.onopen = function () {
        console.log('WebSocket Client Connected');
      };

      client.onclose = function () {
        console.log('Client Closed');
        me.connectToWebsocket(false);
      };

      client.onmessage = function (e) {
        if (typeof e.data === 'string') {
          console.log("Received: '" + e.data + "'");
        }
        var data = JSON.parse(e.data);

        if (data.positions && !data.events) {
          for (var i = 0; i < data.positions.length; i++) {
            var p = data.positions[i];
            me.addPointTo2ndRoute([p.longitude, p.latitude]);
          }
        }
      };
    }
  }, {
    key: 'transform',
    value: function transform(data) {
      return [this.createCoordinates(data)];
    }
  }, {
    key: 'createCoordinates',
    value: function createCoordinates(data) {
      var transformed = data.map(function (route) {
        return [route.longitude, route.latitude];
      });
      var c1 = {};
      c1.coordinates = transformed;
      return c1;
    }

    /**
     *
     * @param point array: [longitude, latitude]
       */

  }, {
    key: 'addPointTo2ndRoute',
    value: function addPointTo2ndRoute(point) {
      var futureRoute = this.state.route;
      if (this.state.liveRouteIndex == undefined) {
        this.setState({ liveRouteIndex: this.state.route.length });
        var c2 = {};
        c2.coordinates = [];
        c2.coordinates.push(point);
        futureRoute.push(c2);
      }
      var liveRoute = futureRoute[this.state.liveRouteIndex];
      liveRoute.coordinates.push(point);
      console.log(futureRoute);
      this.setState({ route: futureRoute });
    }
  }, {
    key: 'render',
    value: function render() {
      var common = {
        width: 800,
        height: 800,
        style: { float: 'left' },
        mapboxApiAccessToken: 'pk.eyJ1Ijoic3dpdGgiLCJhIjoiY2l1ZzBrdjRoMDA1YzMzcHJ0dTZ4OGVoNSJ9.eWr8UgiJX74q0yaOmVVlUg'
      };
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_route2.default, _extends({}, common, { route: this.state.route }))
      );
    }
  }]);

  return App;
}(_react.Component), (_applyDecoratedDescriptor(_class.prototype, '_onWindowResize', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onWindowResize'), _class.prototype)), _class);
exports.default = App;


var reactContainer = _document2.default.createElement('div');
_document2.default.body.appendChild(reactContainer);
_reactDom2.default.render(_react2.default.createElement(App, null), reactContainer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2V4YW1wbGUvbWFpbi5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25XaW5kb3dSZXNpemUiLCJzdGF0ZSIsIndpZHRoIiwiaW5uZXJXaWR0aCIsInJvdXRlIiwidHJhbnNmb3JtIiwicm91dGVDb3VudGVyIiwic2VydmVyIiwic2V0U3RhdGUiLCJtZSIsImNvbnNvbGUiLCJsb2ciLCJvcHRpb25zIiwidXJsIiwiaGVhZGVycyIsImVycm9yIiwicmVzcG9uc2UiLCJib2R5Iiwic3RhdHVzQ29kZSIsImZ1dHVyZVN0YXRlIiwicHVzaCIsImNyZWF0ZUNvb3JkaW5hdGVzIiwiSlNPTiIsInBhcnNlIiwiYmluZCIsImNvbm5lY3RUb1dlYnNvY2tldCIsImZpcnN0IiwicHJvdG9jb2wiLCJsb2NhdGlvbiIsImNsaWVudCIsIldlYlNvY2tldCIsIm9uZXJyb3IiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25tZXNzYWdlIiwiZSIsImRhdGEiLCJwb3NpdGlvbnMiLCJldmVudHMiLCJpIiwibGVuZ3RoIiwicCIsImFkZFBvaW50VG8ybmRSb3V0ZSIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwidHJhbnNmb3JtZWQiLCJtYXAiLCJjMSIsImNvb3JkaW5hdGVzIiwicG9pbnQiLCJmdXR1cmVSb3V0ZSIsImxpdmVSb3V0ZUluZGV4IiwidW5kZWZpbmVkIiwiYzIiLCJsaXZlUm91dGUiLCJjb21tb24iLCJoZWlnaHQiLCJzdHlsZSIsImZsb2F0IiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJyZWFjdENvbnRhaW5lciIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsInJlbmRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MkJBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FB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O0FBQ0Q7Ozs2QkFFUTtBQUNQLFVBQU1LLFNBQVM7QUFDYnJELGVBQU8sR0FETTtBQUVic0QsZ0JBQVEsR0FGSztBQUdiQyxlQUFPLEVBQUNDLE9BQU8sTUFBUixFQUhNO0FBSWJDLDhCQUFzQjtBQUpULE9BQWY7QUFNQSxhQUNFO0FBQUE7QUFBQTtBQUNFLG9FQUFtQkosTUFBbkIsSUFBNEIsT0FBTyxLQUFLdEQsS0FBTCxDQUFXRyxLQUE5QztBQURGLE9BREY7QUFLRDs7Ozs7a0JBMUhrQlAsRzs7O0FBNkhyQixJQUFNK0QsaUJBQWlCLG1CQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQXZCO0FBQ0EsbUJBQVM1QyxJQUFULENBQWM2QyxXQUFkLENBQTBCRixjQUExQjtBQUNBLG1CQUFTRyxNQUFULENBQWdCLDhCQUFDLEdBQUQsT0FBaEIsRUFBd0JILGNBQXhCIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCBST1VURVMgZnJvbSAnLi9kYXRhL3RyYWNjYXIuanNvbic7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcblxuXG5pbXBvcnQgUm91dGVFeGFtcGxlIGZyb20gJy4vZXhhbXBsZXMvcm91dGUucmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vbldpbmRvd1Jlc2l6ZSk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHJvdXRlOiB0aGlzLnRyYW5zZm9ybShST1VURVMpLFxuICAgICAgcm91dGVDb3VudGVyOiAwLFxuICAgICAgc2VydmVyOiAnZ3BzLXRyYWNrZXIuc3dpdGFqc2tpLmRlJ1xuICAgIH07XG4gIH1cblxuICBAYXV0b2JpbmQgX29uV2luZG93UmVzaXplKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3dpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICBjb25zdCBtZSA9IHRoaXM7XG4gICAgY29uc29sZS5sb2coXCJtb3VudGVkXCIpO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIHVybDogJ2h0dHA6Ly8nICsgdGhpcy5zdGF0ZS5zZXJ2ZXIgKyAnL2FwaS9yZXBvcnRzL3JvdXRlP19kYz0xNDc3Mzk5NTE4MTAyJmRldmljZUlkPTEmdHlwZT0lMjUmZnJvbT0yMDE2LTEwLTE0VDEyJTNBMTQlM0EwMC4wMDBaJnRvPTIwMTYtMTAtMTRUMTglM0EwMCUzQTAwLjAwMFonLFxuICAgICAgaGVhZGVycyA6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUT0RPOiB0ZW1wb3JhcnkgY29kZSB0byB0ZXN0IHNlY29uZCBjb2xvciB3aXRoIHJvdXRlIHJlcXVlc3RlZFxuICAgIHJlcXVlc3Qob3B0aW9ucyAsXG4gICAgICBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgIGlmICghZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSAyMDApIHtcbiAgICAgICAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBub3QgcmVwbGFjZSB0aGUgUk9VVEUsIGJ1dCBhZGQgYSBzZWNvbmQgb25lXG4gICAgICAgICAgdmFyIGZ1dHVyZVN0YXRlID0gdGhpcy5zdGF0ZS5yb3V0ZTtcbiAgICAgICAgICBmdXR1cmVTdGF0ZS5wdXNoKHRoaXMuY3JlYXRlQ29vcmRpbmF0ZXMoSlNPTi5wYXJzZShib2R5KSkpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3JvdXRlIDogZnV0dXJlU3RhdGV9KTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyb3V0ZUNvdW50ZXI6IHRoaXMuc3RhdGUucm91dGVDb3VudGVyICsgMX0pO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIC8vIFRPRE86IGVuZCAtIGRlY29tbWVudCBuZXh0IGxpbmVcblxuICAgIHRoaXMuY29ubmVjdFRvV2Vic29ja2V0KCk7XG4gIH1cblxuICBjb25uZWN0VG9XZWJzb2NrZXQoZmlyc3QgPSB0cnVlKXtcbiAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICBjb25zdCBwcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnd3NzOicgOiAnd3M6JztcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgV2ViU29ja2V0KHByb3RvY29sICsgJy8vJyArIHRoaXMuc3RhdGUuc2VydmVyICsgJy9hcGkvc29ja2V0Jyk7XG5cbiAgICBjbGllbnQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gRXJyb3InKTtcbiAgICB9O1xuXG4gICAgY2xpZW50Lm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coJ1dlYlNvY2tldCBDbGllbnQgQ29ubmVjdGVkJyk7XG4gICAgfTtcblxuICAgIGNsaWVudC5vbmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnQ2xpZW50IENsb3NlZCcpO1xuICAgICAgbWUuY29ubmVjdFRvV2Vic29ja2V0KGZhbHNlKTtcbiAgICB9O1xuXG4gICAgY2xpZW50Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICh0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkOiAnXCIgKyBlLmRhdGEgKyBcIidcIik7XG4gICAgICB9XG4gICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuXG4gICAgICBpZiAoZGF0YS5wb3NpdGlvbnMgJiYgIWRhdGEuZXZlbnRzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5wb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgcCA9IGRhdGEucG9zaXRpb25zW2ldO1xuICAgICAgICAgIG1lLmFkZFBvaW50VG8ybmRSb3V0ZShbcC5sb25naXR1ZGUsIHAubGF0aXR1ZGVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB0cmFuc2Zvcm0oZGF0YSl7XG4gICAgcmV0dXJuIFt0aGlzLmNyZWF0ZUNvb3JkaW5hdGVzKGRhdGEpXTtcbiAgfVxuXG4gIGNyZWF0ZUNvb3JkaW5hdGVzKGRhdGEpe1xuICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gZGF0YS5tYXAoKHJvdXRlKSA9PiB7XG4gICAgICByZXR1cm4gW3JvdXRlLmxvbmdpdHVkZSwgcm91dGUubGF0aXR1ZGVdO1xuICAgIH0pO1xuICAgIGNvbnN0IGMxID0ge307XG4gICAgYzEuY29vcmRpbmF0ZXMgPSB0cmFuc2Zvcm1lZDtcbiAgICByZXR1cm4gYzE7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHBvaW50IGFycmF5OiBbbG9uZ2l0dWRlLCBsYXRpdHVkZV1cbiAgICAgKi9cbiAgYWRkUG9pbnRUbzJuZFJvdXRlKHBvaW50KXtcbiAgICBjb25zdCBmdXR1cmVSb3V0ZSA9IHRoaXMuc3RhdGUucm91dGU7XG4gICAgaWYgKHRoaXMuc3RhdGUubGl2ZVJvdXRlSW5kZXggPT0gdW5kZWZpbmVkKXtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2xpdmVSb3V0ZUluZGV4OiB0aGlzLnN0YXRlLnJvdXRlLmxlbmd0aH0pO1xuICAgICAgY29uc3QgYzIgPSB7fTtcbiAgICAgIGMyLmNvb3JkaW5hdGVzID0gW107XG4gICAgICBjMi5jb29yZGluYXRlcy5wdXNoKHBvaW50KTtcbiAgICAgIGZ1dHVyZVJvdXRlLnB1c2goYzIpO1xuICAgIH1cbiAgICB2YXIgbGl2ZVJvdXRlID0gZnV0dXJlUm91dGVbdGhpcy5zdGF0ZS5saXZlUm91dGVJbmRleF07XG4gICAgbGl2ZVJvdXRlLmNvb3JkaW5hdGVzLnB1c2gocG9pbnQpO1xuICAgIGNvbnNvbGUubG9nKGZ1dHVyZVJvdXRlKTtcbiAgICB0aGlzLnNldFN0YXRlKHtyb3V0ZTogZnV0dXJlUm91dGV9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjb21tb24gPSB7XG4gICAgICB3aWR0aDogODAwLFxuICAgICAgaGVpZ2h0OiA4MDAsXG4gICAgICBzdHlsZToge2Zsb2F0OiAnbGVmdCd9LFxuICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW46ICdway5leUoxSWpvaWMzZHBkR2dpTENKaElqb2lZMmwxWnpCcmRqUm9NREExWXpNemNISjBkVFo0T0dWb05TSjkuZVdyOFVnaUpYNzRxMHlhT21WVmxVZydcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8Um91dGVFeGFtcGxlIHsgLi4uY29tbW9uIH0gcm91dGU9e3RoaXMuc3RhdGUucm91dGV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IHJlYWN0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlYWN0Q29udGFpbmVyKTtcblJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIHJlYWN0Q29udGFpbmVyKTtcbiJdfQ==