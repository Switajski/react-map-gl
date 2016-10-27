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

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _d3Scale = require('d3-scale');

var _d3Color = require('d3-color');

var _dist = require('../../dist');

var _dist2 = _interopRequireDefault(_dist);

var _alphaify = require('../../dist/utils/alphaify');

var _alphaify2 = _interopRequireDefault(_alphaify);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

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

var windowAlert = _window2.default.alert;

function round(x, n) {
  var tenN = Math.pow(10, n);
  return Math.round(x * tenN) / tenN;
}

var color = (0, _d3Scale.scaleOrdinal)(_d3Scale.schemeCategory10);

var PROP_TYPES = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  route: _react.PropTypes.array.isRequired
};

var RouteOverlayExample = (_class = function (_Component) {
  _inherits(RouteOverlayExample, _Component);

  function RouteOverlayExample(props) {
    _classCallCheck(this, RouteOverlayExample);

    var _this = _possibleConstructorReturn(this, (RouteOverlayExample.__proto__ || Object.getPrototypeOf(RouteOverlayExample)).call(this, props));

    _this.state = {
      viewport: {
        latitude: 49.46887666666667,
        longitude: 11.103226666666666,
        //latitude: 37.7736092599127,
        //longitude: -122.42312591099463,
        zoom: 12.011557070552028,
        startDragLngLat: null,
        isDragging: false
      }
    };
    return _this;
  }

  _createClass(RouteOverlayExample, [{
    key: '_onChangeViewport',
    value: function _onChangeViewport(viewport) {
      if (this.props.onChangeViewport) {
        return this.props.onChangeViewport(viewport);
      }
      this.setState({ viewport: viewport });
    }
  }, {
    key: '_renderRoute',
    value: function _renderRoute(points, index) {
      return _react2.default.createElement(
        'g',
        { style: { pointerEvents: 'click', cursor: 'pointer' } },
        _react2.default.createElement(
          'g',
          {
            style: { pointerEvents: 'visibleStroke' },
            onClick: function onClick() {
              return windowAlert('route ' + index);
            } },
          _react2.default.createElement('path', {
            style: {
              fill: 'none',
              stroke: (0, _alphaify2.default)(color(index), 0.7),
              strokeWidth: 6
            },
            d: 'M' + points.join('L') })
        )
      );
    }
  }, {
    key: '_redrawSVGOverlay',
    value: function _redrawSVGOverlay(_ref) {
      var _this2 = this;

      var project = _ref.project;

      return _react2.default.createElement(
        'g',
        null,
        this.props.route.map(function (route, index) {
          var points = route.coordinates.map(project).map(function (p) {
            return [round(p[0], 1), round(p[1], 1)];
          });
          return _react2.default.createElement(
            'g',
            { key: index },
            _this2._renderRoute(points, index)
          );
        })
      );
    }
  }, {
    key: '_redrawCanvasOverlay',
    value: function _redrawCanvasOverlay(_ref2) {
      var ctx = _ref2.ctx,
          width = _ref2.width,
          height = _ref2.height,
          project = _ref2.project;

      ctx.clearRect(0, 0, width, height);
      this.props.route.map(function (route, index) {
        return route.coordinates.map(project).forEach(function (p, i) {
          var point = [round(p[0], 1), round(p[1], 1)];
          ctx.fillStyle = (0, _d3Color.rgb)(color(index)).brighter(1).toString();
          ctx.beginPath();
          ctx.arc(point[0], point[1], 2, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var viewport = _extends({}, this.state.viewport, this.props);
      return _react2.default.createElement(
        _dist2.default,
        _extends({}, viewport, { onChangeViewport: this._onChangeViewport }),
        _react2.default.createElement(_dist.SVGOverlay, _extends({}, viewport, { redraw: this._redrawSVGOverlay })),
        ',',
        _react2.default.createElement(_dist.CanvasOverlay, _extends({}, viewport, { redraw: this._redrawCanvasOverlay }))
      );
    }
  }]);

  return RouteOverlayExample;
}(_react.Component), (_applyDecoratedDescriptor(_class.prototype, '_onChangeViewport', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onChangeViewport'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_redrawSVGOverlay', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_redrawSVGOverlay'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_redrawCanvasOverlay', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_redrawCanvasOverlay'), _class.prototype)), _class);
exports.default = RouteOverlayExample;


RouteOverlayExample.propTypes = PROP_TYPES;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2V4YW1wbGUvZXhhbXBsZXMvcm91dGUucmVhY3QuanMiXSwibmFtZXMiOlsid2luZG93QWxlcnQiLCJhbGVydCIsInJvdW5kIiwieCIsIm4iLCJ0ZW5OIiwiTWF0aCIsInBvdyIsImNvbG9yIiwiUFJPUF9UWVBFUyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsInJvdXRlIiwiYXJyYXkiLCJSb3V0ZU92ZXJsYXlFeGFtcGxlIiwicHJvcHMiLCJzdGF0ZSIsInZpZXdwb3J0IiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJ6b29tIiwic3RhcnREcmFnTG5nTGF0IiwiaXNEcmFnZ2luZyIsIm9uQ2hhbmdlVmlld3BvcnQiLCJzZXRTdGF0ZSIsInBvaW50cyIsImluZGV4IiwicG9pbnRlckV2ZW50cyIsImN1cnNvciIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsImpvaW4iLCJwcm9qZWN0IiwibWFwIiwiY29vcmRpbmF0ZXMiLCJwIiwiX3JlbmRlclJvdXRlIiwiY3R4IiwiY2xlYXJSZWN0IiwiZm9yRWFjaCIsImkiLCJwb2ludCIsImZpbGxTdHlsZSIsImJyaWdodGVyIiwidG9TdHJpbmciLCJiZWdpblBhdGgiLCJhcmMiLCJQSSIsIl9vbkNoYW5nZVZpZXdwb3J0IiwiX3JlZHJhd1NWR092ZXJsYXkiLCJfcmVkcmF3Q2FudmFzT3ZlcmxheSIsInByb3BUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7MkJBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVRBLElBQU1BLGNBQWMsaUJBQU9DLEtBQTNCOztBQVdBLFNBQVNDLEtBQVQs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QUF0QixFQUErQk8sT0FBL0IsQ0FBdUMsVUFBQ0osQ0FBRCxFQUFJSyxDQUFKLEVBQVU7QUFDL0MsY0FBTUMsUUFBUSxDQUFDMUMsTUFBTW9DLEVBQUUsQ0FBRixDQUFOLEVBQVksQ0FBWixDQUFELEVBQWlCcEMsTUFBTW9DLEVBQUUsQ0FBRixDQUFOLEVBQVksQ0FBWixDQUFqQixDQUFkO0FBQ0FFLGNBQUlLLFNBQUosR0FBZ0Isa0JBQUlyQyxNQUFNb0IsS0FBTixDQUFKLEVBQWtCa0IsUUFBbEIsQ0FBMkIsQ0FBM0IsRUFBOEJDLFFBQTlCLEVBQWhCO0FBQ0FQLGNBQUlRLFNBQUo7QUFDQVIsY0FBSVMsR0FBSixDQUFRTCxNQUFNLENBQU4sQ0FBUixFQUFrQkEsTUFBTSxDQUFOLENBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDdEMsS0FBSzRDLEVBQUwsR0FBVSxDQUE1QztBQUNBVixjQUFJVCxJQUFKO0FBQ0QsU0FORCxDQURtQjtBQUFBLE9BQXJCO0FBU0Q7Ozs2QkFFUTtBQUNQLFVBQU1aLHdCQUNELEtBQUtELEtBQUwsQ0FBV0MsUUFEVixFQUVELEtBQUtGLEtBRkosQ0FBTjtBQUlBLGFBQ0U7QUFBQTtBQUFBLHFCQUFZRSxRQUFaLElBQXVCLGtCQUFtQixLQUFLZ0MsaUJBQS9DO0FBQ0UscUVBQWlCaEMsUUFBakIsSUFBNEIsUUFBUyxLQUFLaUMsaUJBQTFDLElBREY7QUFBQTtBQUVFLHdFQUFvQmpDLFFBQXBCLElBQStCLFFBQVMsS0FBS2tDLG9CQUE3QztBQUZGLE9BREY7QUFNRDs7Ozs7a0JBcEZrQnJDLG1COzs7QUF1RnJCQSxvQkFBb0JzQyxTQUFwQixHQUFnQzdDLFVBQWhDIiwiZmlsZSI6InJvdXRlLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmNvbnN0IHdpbmRvd0FsZXJ0ID0gd2luZG93LmFsZXJ0O1xuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5pbXBvcnQge3NjYWxlT3JkaW5hbCwgc2NoZW1lQ2F0ZWdvcnkxMH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHtyZ2J9IGZyb20gJ2QzLWNvbG9yJztcblxuaW1wb3J0IE1hcEdMLCB7U1ZHT3ZlcmxheSwgQ2FudmFzT3ZlcmxheX0gZnJvbSAnLi4vLi4vZGlzdCc7XG5pbXBvcnQgYWxwaGFpZnkgZnJvbSAnLi4vLi4vZGlzdC91dGlscy9hbHBoYWlmeSc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcblxuZnVuY3Rpb24gcm91bmQoeCwgbikge1xuICBjb25zdCB0ZW5OID0gTWF0aC5wb3coMTAsIG4pO1xuICByZXR1cm4gTWF0aC5yb3VuZCh4ICogdGVuTikgLyB0ZW5OO1xufVxuXG5jb25zdCBjb2xvciA9IHNjYWxlT3JkaW5hbChzY2hlbWVDYXRlZ29yeTEwKTtcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHJvdXRlOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm91dGVPdmVybGF5RXhhbXBsZSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHZpZXdwb3J0OiB7XG4gICAgICAgIGxhdGl0dWRlOiA0OS40Njg4NzY2NjY2NjY2NyxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMS4xMDMyMjY2NjY2NjY2NjYsXG4gICAgICAgIC8vbGF0aXR1ZGU6IDM3Ljc3MzYwOTI1OTkxMjcsXG4gICAgICAgIC8vbG9uZ2l0dWRlOiAtMTIyLjQyMzEyNTkxMDk5NDYzLFxuICAgICAgICB6b29tOiAxMi4wMTE1NTcwNzA1NTIwMjgsXG4gICAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogbnVsbCxcbiAgICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25DaGFuZ2VWaWV3cG9ydCh2aWV3cG9ydCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQodmlld3BvcnQpO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHt2aWV3cG9ydH0pO1xuICB9XG5cbiAgX3JlbmRlclJvdXRlKHBvaW50cywgaW5kZXgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGcgc3R5bGU9eyB7cG9pbnRlckV2ZW50czogJ2NsaWNrJywgY3Vyc29yOiAncG9pbnRlcid9IH0+XG4gICAgICAgIDxnXG4gICAgICAgICAgc3R5bGU9eyB7cG9pbnRlckV2ZW50czogJ3Zpc2libGVTdHJva2UnfSB9XG4gICAgICAgICAgb25DbGljaz17ICgpID0+IHdpbmRvd0FsZXJ0KGByb3V0ZSAke2luZGV4fWApIH0+XG4gICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgICAgICAgIHN0cm9rZTogYWxwaGFpZnkoY29sb3IoaW5kZXgpLCAwLjcpLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogNlxuICAgICAgICAgICAgfSB9XG4gICAgICAgICAgICBkPXsgYE0ke3BvaW50cy5qb2luKCdMJyl9YCB9Lz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9nPlxuICAgICk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX3JlZHJhd1NWR092ZXJsYXkoe3Byb2plY3R9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxnPlxuICAgICAge1xuICAgICAgICB0aGlzLnByb3BzLnJvdXRlLm1hcCgocm91dGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgcG9pbnRzID0gcm91dGUuY29vcmRpbmF0ZXMubWFwKHByb2plY3QpLm1hcChcbiAgICAgICAgICAgIHAgPT4gW3JvdW5kKHBbMF0sIDEpLCByb3VuZChwWzFdLCAxKV1cbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiA8ZyBrZXk9eyBpbmRleCB9PnsgdGhpcy5fcmVuZGVyUm91dGUocG9pbnRzLCBpbmRleCkgfTwvZz47XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfcmVkcmF3Q2FudmFzT3ZlcmxheSh7Y3R4LCB3aWR0aCwgaGVpZ2h0LCBwcm9qZWN0fSkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5wcm9wcy5yb3V0ZS5tYXAoKHJvdXRlLCBpbmRleCkgPT5cbiAgICAgIHJvdXRlLmNvb3JkaW5hdGVzLm1hcChwcm9qZWN0KS5mb3JFYWNoKChwLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvaW50ID0gW3JvdW5kKHBbMF0sIDEpLCByb3VuZChwWzFdLCAxKV07XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSByZ2IoY29sb3IoaW5kZXgpKS5icmlnaHRlcigxKS50b1N0cmluZygpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMocG9pbnRbMF0sIHBvaW50WzFdLCAyLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgdmlld3BvcnQgPSB7XG4gICAgICAuLi50aGlzLnN0YXRlLnZpZXdwb3J0LFxuICAgICAgLi4udGhpcy5wcm9wc1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXBHTCB7IC4uLnZpZXdwb3J0IH0gb25DaGFuZ2VWaWV3cG9ydD17IHRoaXMuX29uQ2hhbmdlVmlld3BvcnQgfT5cbiAgICAgICAgPFNWR092ZXJsYXkgeyAuLi52aWV3cG9ydCB9IHJlZHJhdz17IHRoaXMuX3JlZHJhd1NWR092ZXJsYXkgfS8+LFxuICAgICAgICA8Q2FudmFzT3ZlcmxheSB7IC4uLnZpZXdwb3J0IH0gcmVkcmF3PXsgdGhpcy5fcmVkcmF3Q2FudmFzT3ZlcmxheSB9Lz5cbiAgICAgIDwvTWFwR0w+XG4gICAgKTtcbiAgfVxufVxuXG5Sb3V0ZU92ZXJsYXlFeGFtcGxlLnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG4iXX0=