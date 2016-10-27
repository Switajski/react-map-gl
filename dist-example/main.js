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
      routeCounter: 0
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

      // TODO: temporary code to test second color with route requested
      (0, _request2.default)('http://localhost/api/reports/route?_dc=1477399518102&deviceId=1&type=%25&from=2016-10-14T12%3A14%3A00.000Z&to=2016-10-14T18%3A00%3A00.000Z', function (error, response, body) {
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
      var client = new WebSocket(protocol + '//gps-tracker.switajski.de/api/socket');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2V4YW1wbGUvbWFpbi5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25XaW5kb3dSZXNpemUiLCJzdGF0ZSIsIndpZHRoIiwiaW5uZXJXaWR0aCIsInJvdXRlIiwidHJhbnNmb3JtIiwicm91dGVDb3VudGVyIiwic2V0U3RhdGUiLCJtZSIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsInJlc3BvbnNlIiwiYm9keSIsInN0YXR1c0NvZGUiLCJmdXR1cmVTdGF0ZSIsInB1c2giLCJjcmVhdGVDb29yZGluYXRlcyIsIkpTT04iLCJwYXJzZSIsImJpbmQiLCJjb25uZWN0VG9XZWJzb2NrZXQiLCJmaXJzdCIsInByb3RvY29sIiwibG9jYXRpb24iLCJjbGllbnQiLCJXZWJTb2NrZXQiLCJvbmVycm9yIiwib25vcGVuIiwib25jbG9zZSIsIm9ubWVzc2FnZSIsImUiLCJkYXRhIiwicG9zaXRpb25zIiwiZXZlbnRzIiwiaSIsImxlbmd0aCIsInAiLCJhZGRQb2ludFRvMm5kUm91dGUiLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsInRyYW5zZm9ybWVkIiwibWFwIiwiYzEiLCJjb29yZGluYXRlcyIsInBvaW50IiwiZnV0dXJlUm91dGUiLCJsaXZlUm91dGVJbmRleCIsInVuZGVmaW5lZCIsImMyIiwibGl2ZVJvdXRlIiwiY29tbW9uIiwiaGVpZ2h0Iiwic3R5bGUiLCJmbG9hdCIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwicmVhY3RDb250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJyZW5kZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzJCQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBR0E7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RDs7Ozs7a0JBbEhrQlAsRzs7O0FBcUhyQixJQUFNMkQsaUJBQWlCLG1CQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQXZCO0FBQ0EsbUJBQVM1QyxJQUFULENBQWM2QyxXQUFkLENBQTBCRixjQUExQjtBQUNBLG1CQUFTRyxNQUFULENBQWdCLDhCQUFDLEdBQUQsT0FBaEIsRUFBd0JILGNBQXhCIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCBST1VURVMgZnJvbSAnLi9kYXRhL3RyYWNjYXIuanNvbic7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcblxuXG5pbXBvcnQgUm91dGVFeGFtcGxlIGZyb20gJy4vZXhhbXBsZXMvcm91dGUucmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vbldpbmRvd1Jlc2l6ZSk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHJvdXRlOiB0aGlzLnRyYW5zZm9ybShST1VURVMpLFxuICAgICAgcm91dGVDb3VudGVyOiAwXG4gICAgfTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25XaW5kb3dSZXNpemUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7d2lkdGg6IHdpbmRvdy5pbm5lcldpZHRofSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgIGNvbnN0IG1lID0gdGhpcztcbiAgICBjb25zb2xlLmxvZyhcIm1vdW50ZWRcIik7XG5cbiAgICAvLyBUT0RPOiB0ZW1wb3JhcnkgY29kZSB0byB0ZXN0IHNlY29uZCBjb2xvciB3aXRoIHJvdXRlIHJlcXVlc3RlZFxuICAgIHJlcXVlc3QoJ2h0dHA6Ly9sb2NhbGhvc3QvYXBpL3JlcG9ydHMvcm91dGU/X2RjPTE0NzczOTk1MTgxMDImZGV2aWNlSWQ9MSZ0eXBlPSUyNSZmcm9tPTIwMTYtMTAtMTRUMTIlM0ExNCUzQTAwLjAwMFomdG89MjAxNi0xMC0xNFQxOCUzQTAwJTNBMDAuMDAwWicsXG4gICAgICBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgIGlmICghZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSAyMDApIHtcbiAgICAgICAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBub3QgcmVwbGFjZSB0aGUgUk9VVEUsIGJ1dCBhZGQgYSBzZWNvbmQgb25lXG4gICAgICAgICAgdmFyIGZ1dHVyZVN0YXRlID0gdGhpcy5zdGF0ZS5yb3V0ZTtcbiAgICAgICAgICBmdXR1cmVTdGF0ZS5wdXNoKHRoaXMuY3JlYXRlQ29vcmRpbmF0ZXMoSlNPTi5wYXJzZShib2R5KSkpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3JvdXRlIDogZnV0dXJlU3RhdGV9KTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyb3V0ZUNvdW50ZXI6IHRoaXMuc3RhdGUucm91dGVDb3VudGVyICsgMX0pO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIC8vIFRPRE86IGVuZCAtIGRlY29tbWVudCBuZXh0IGxpbmVcblxuICAgIHRoaXMuY29ubmVjdFRvV2Vic29ja2V0KCk7XG4gIH1cblxuICBjb25uZWN0VG9XZWJzb2NrZXQoZmlyc3QgPSB0cnVlKXtcbiAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICBjb25zdCBwcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnd3NzOicgOiAnd3M6JztcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgV2ViU29ja2V0KHByb3RvY29sICsgJy8vZ3BzLXRyYWNrZXIuc3dpdGFqc2tpLmRlL2FwaS9zb2NrZXQnKTtcblxuICAgIGNsaWVudC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBFcnJvcicpO1xuICAgIH07XG5cbiAgICBjbGllbnQub25vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnV2ViU29ja2V0IENsaWVudCBDb25uZWN0ZWQnKTtcbiAgICB9O1xuXG4gICAgY2xpZW50Lm9uY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDbGllbnQgQ2xvc2VkJyk7XG4gICAgICBtZS5jb25uZWN0VG9XZWJzb2NrZXQoZmFsc2UpO1xuICAgIH07XG5cbiAgICBjbGllbnQub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQ6ICdcIiArIGUuZGF0YSArIFwiJ1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG5cbiAgICAgIGlmIChkYXRhLnBvc2l0aW9ucyAmJiAhZGF0YS5ldmVudHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBwID0gZGF0YS5wb3NpdGlvbnNbaV07XG4gICAgICAgICAgbWUuYWRkUG9pbnRUbzJuZFJvdXRlKFtwLmxvbmdpdHVkZSwgcC5sYXRpdHVkZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHRyYW5zZm9ybShkYXRhKXtcbiAgICByZXR1cm4gW3RoaXMuY3JlYXRlQ29vcmRpbmF0ZXMoZGF0YSldO1xuICB9XG5cbiAgY3JlYXRlQ29vcmRpbmF0ZXMoZGF0YSl7XG4gICAgY29uc3QgdHJhbnNmb3JtZWQgPSBkYXRhLm1hcCgocm91dGUpID0+IHtcbiAgICAgIHJldHVybiBbcm91dGUubG9uZ2l0dWRlLCByb3V0ZS5sYXRpdHVkZV07XG4gICAgfSk7XG4gICAgY29uc3QgYzEgPSB7fTtcbiAgICBjMS5jb29yZGluYXRlcyA9IHRyYW5zZm9ybWVkO1xuICAgIHJldHVybiBjMTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnQgYXJyYXk6IFtsb25naXR1ZGUsIGxhdGl0dWRlXVxuICAgICAqL1xuICBhZGRQb2ludFRvMm5kUm91dGUocG9pbnQpe1xuICAgIGNvbnN0IGZ1dHVyZVJvdXRlID0gdGhpcy5zdGF0ZS5yb3V0ZTtcbiAgICBpZiAodGhpcy5zdGF0ZS5saXZlUm91dGVJbmRleCA9PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bGl2ZVJvdXRlSW5kZXg6IHRoaXMuc3RhdGUucm91dGUubGVuZ3RofSk7XG4gICAgICBjb25zdCBjMiA9IHt9O1xuICAgICAgYzIuY29vcmRpbmF0ZXMgPSBbXTtcbiAgICAgIGMyLmNvb3JkaW5hdGVzLnB1c2gocG9pbnQpO1xuICAgICAgZnV0dXJlUm91dGUucHVzaChjMik7XG4gICAgfVxuICAgIHZhciBsaXZlUm91dGUgPSBmdXR1cmVSb3V0ZVt0aGlzLnN0YXRlLmxpdmVSb3V0ZUluZGV4XTtcbiAgICBsaXZlUm91dGUuY29vcmRpbmF0ZXMucHVzaChwb2ludCk7XG4gICAgY29uc29sZS5sb2coZnV0dXJlUm91dGUpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3JvdXRlOiBmdXR1cmVSb3V0ZX0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGNvbW1vbiA9IHtcbiAgICAgIHdpZHRoOiA4MDAsXG4gICAgICBoZWlnaHQ6IDgwMCxcbiAgICAgIHN0eWxlOiB7ZmxvYXQ6ICdsZWZ0J30sXG4gICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogJ3BrLmV5SjFJam9pYzNkcGRHZ2lMQ0poSWpvaVkybDFaekJyZGpSb01EQTFZek16Y0hKMGRUWjRPR1ZvTlNKOS5lV3I4VWdpSlg3NHEweWFPbVZWbFVnJ1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxSb3V0ZUV4YW1wbGUgeyAuLi5jb21tb24gfSByb3V0ZT17dGhpcy5zdGF0ZS5yb3V0ZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgcmVhY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVhY3RDb250YWluZXIpO1xuUmVhY3RET00ucmVuZGVyKDxBcHAvPiwgcmVhY3RDb250YWluZXIpO1xuIl19