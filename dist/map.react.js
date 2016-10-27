'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _desc, _value, _class2; // Copyright (c) 2015 Uber Technologies, Inc.

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

//import assert from 'assert';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _mapboxGl = require('mapbox-gl');

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

var _d3Selection = require('d3-selection');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _mapInteractions = require('./map-interactions.react');

var _mapInteractions2 = _interopRequireDefault(_mapInteractions);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _styleUtils = require('./utils/style-utils');

var _diffStyles2 = require('./utils/diff-styles');

var _diffStyles3 = _interopRequireDefault(_diffStyles2);

var _transform = require('./utils/transform');

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

function noop() {}

// Note: Max pitch is a hard coded value (not a named constant) in transform.js
var MAX_PITCH = 60;
var PITCH_MOUSE_THRESHOLD = 20;
var PITCH_ACCEL = 1.2;

var PROP_TYPES = {
  /**
    * The latitude of the center of the map.
    */
  latitude: _react.PropTypes.number.isRequired,
  /**
    * The longitude of the center of the map.
    */
  longitude: _react.PropTypes.number.isRequired,
  /**
    * The tile zoom level of the map.
    */
  zoom: _react.PropTypes.number.isRequired,
  /**
    * The Mapbox style the component should use. Can either be a string url
    * or a MapboxGL style Immutable.Map object.
    */
  mapStyle: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.instanceOf(_immutable2.default.Map)]),
  /**
    * The Mapbox API access token to provide to mapbox-gl-js. This is required
    * when using Mapbox provided vector tiles and styles.
    */
  mapboxApiAccessToken: _react.PropTypes.string,
  /**
    * `onChangeViewport` callback is fired when the user interacted with the
    * map. The object passed to the callback contains `latitude`,
    * `longitude` and `zoom` and additional state information.
    */
  onChangeViewport: _react.PropTypes.func,
  /**
    * The width of the map.
    */
  width: _react.PropTypes.number.isRequired,
  /**
    * The height of the map.
    */
  height: _react.PropTypes.number.isRequired,
  /**
    * Is the component currently being dragged. This is used to show/hide the
    * drag cursor. Also used as an optimization in some overlays by preventing
    * rendering while dragging.
    */
  isDragging: _react.PropTypes.bool,
  /**
    * Required to calculate the mouse projection after the first click event
    * during dragging. Where the map is depends on where you first clicked on
    * the map.
    */
  startDragLngLat: _react.PropTypes.array,
  /**
    * Called when a feature is hovered over. Uses Mapbox's
    * queryRenderedFeatures API to find features under the pointer:
    * https://www.mapbox.com/mapbox-gl-js/api/#Map#queryRenderedFeatures
    * To query only some of the layers, set the `interactive` property in the
    * layer style to `true`. See Mapbox's style spec
    * https://www.mapbox.com/mapbox-gl-style-spec/#layer-interactive
    * If no interactive layers are found (e.g. using Mapbox's default styles),
    * will fall back to query all layers.
    * @callback
    * @param {array} features - The array of features the mouse is over.
    */
  onHoverFeatures: _react.PropTypes.func,
  /**
    * Defaults to TRUE
    * Set to false to enable onHoverFeatures to be called regardless if
    * there is an actual feature at x, y. This is useful to emulate
    * "mouse-out" behaviors on features.
    */
  ignoreEmptyFeatures: _react.PropTypes.bool,

  /**
    * Show attribution control or not.
    */
  attributionControl: _react.PropTypes.bool,

  /**
    * Called when a feature is clicked on. Uses Mapbox's
    * queryRenderedFeatures API to find features under the pointer:
    * https://www.mapbox.com/mapbox-gl-js/api/#Map#queryRenderedFeatures
    * To query only some of the layers, set the `interactive` property in the
    * layer style to `true`. See Mapbox's style spec
    * https://www.mapbox.com/mapbox-gl-style-spec/#layer-interactive
    * If no interactive layers are found (e.g. using Mapbox's default styles),
    * will fall back to query all layers.
    */
  onClickFeatures: _react.PropTypes.func,

  /**
    * Radius to detect features around a clicked point. Defaults to 15.
    */
  clickRadius: _react.PropTypes.number,

  /**
    * Passed to Mapbox Map constructor which passes it to the canvas context.
    * This is unseful when you want to export the canvas as a PNG.
    */
  preserveDrawingBuffer: _react.PropTypes.bool,

  /**
    * There are still known issues with style diffing. As a temporary stopgap,
    * add the option to prevent style diffing.
    */
  preventStyleDiffing: _react.PropTypes.bool,

  /**
    * Enables perspective control event handling (Command-rotate)
    */
  perspectiveEnabled: _react.PropTypes.bool,

  /**
    * Specify the bearing of the viewport
    */
  bearing: _react2.default.PropTypes.number,

  /**
    * Specify the pitch of the viewport
    */
  pitch: _react2.default.PropTypes.number,

  /**
    * Specify the altitude of the viewport camera
    * Unit: map heights, default 1.5
    * Non-public API, see https://github.com/mapbox/mapbox-gl-js/issues/1137
    */
  altitude: _react2.default.PropTypes.number
};

var DEFAULT_PROPS = {
  mapStyle: 'mapbox://styles/mapbox/satellite-v9',
  onChangeViewport: null,
  mapboxApiAccessToken: _config2.default.DEFAULTS.MAPBOX_API_ACCESS_TOKEN,
  preserveDrawingBuffer: false,
  attributionControl: true,
  ignoreEmptyFeatures: true,
  bearing: 0,
  pitch: 0,
  altitude: 1.5,
  clickRadius: 15
};

var MapGL = (0, _pureRenderDecorator2.default)(_class = (_class2 = function (_Component) {
  _inherits(MapGL, _Component);

  _createClass(MapGL, null, [{
    key: 'supported',
    value: function supported() {
      return _mapboxGl2.default.supported();
    }
  }]);

  function MapGL(props) {
    _classCallCheck(this, MapGL);

    var _this = _possibleConstructorReturn(this, (MapGL.__proto__ || Object.getPrototypeOf(MapGL)).call(this, props));

    _this.state = {
      isSupported: _mapboxGl2.default.supported(),
      isDragging: false,
      isHovering: false,
      startDragLngLat: null,
      startBearing: null,
      startPitch: null
    };
    _this._queryParams = {};
    _mapboxGl2.default.accessToken = props.mapboxApiAccessToken;

    if (!_this.state.isSupported) {
      _this.componentDidMount = noop;
      _this.componentWillReceiveProps = noop;
      _this.componentDidUpdate = noop;
    }
    return _this;
  }

  _createClass(MapGL, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var mapStyle = _immutable2.default.Map.isMap(this.props.mapStyle) ? this.props.mapStyle.toJS() : this.props.mapStyle;
      var map = new _mapboxGl2.default.Map({
        container: this.refs.mapboxMap,
        center: [this.props.longitude, this.props.latitude],
        zoom: this.props.zoom,
        pitch: this.props.pitch,
        bearing: this.props.bearing,
        style: mapStyle,
        interactive: false,
        preserveDrawingBuffer: this.props.preserveDrawingBuffer
        // TODO?
        // attributionControl: this.props.attributionControl
      });

      (0, _d3Selection.select)(map.getCanvas()).style('outline', 'none');

      this._map = map;
      this._updateMapViewport({}, this.props);
      this._callOnChangeViewport(map.transform);
      this._updateQueryParams(mapStyle);
    }

    // New props are comin' round the corner!

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this._updateStateFromProps(this.props, newProps);
      this._updateMapViewport(this.props, newProps);
      this._updateMapStyle(this.props, newProps);
      // Save width/height so that we can check them in componentDidUpdate
      this.setState({
        width: this.props.width,
        height: this.props.height
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // map.resize() reads size from DOM, we need to call after render
      this._updateMapSize(this.state, this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._map) {
        this._map.remove();
      }
    }
  }, {
    key: '_cursor',
    value: function _cursor() {
      var isInteractive = this.props.onChangeViewport || this.props.onClickFeature || this.props.onHoverFeatures;
      if (isInteractive) {
        return this.props.isDragging ? _config2.default.CURSOR.GRABBING : this.state.isHovering ? _config2.default.CURSOR.POINTER : _config2.default.CURSOR.GRAB;
      }
      return 'inherit';
    }
  }, {
    key: '_getMap',
    value: function _getMap() {
      return this._map;
    }
  }, {
    key: '_updateStateFromProps',
    value: function _updateStateFromProps(oldProps, newProps) {
      _mapboxGl2.default.accessToken = newProps.mapboxApiAccessToken;
      var startDragLngLat = newProps.startDragLngLat;

      this.setState({
        startDragLngLat: startDragLngLat && startDragLngLat.slice()
      });
    }
  }, {
    key: '_updateSource',
    value: function _updateSource(map, update) {
      var newSource = update.source.toJS();
      if (newSource.type === 'geojson') {
        var oldSource = map.getSource(update.id);
        if (oldSource.type === 'geojson') {
          // update data if no other GeoJSONSource options were changed
          var oldOpts = oldSource.workerOptions;
          if ((newSource.maxzoom === undefined || newSource.maxzoom === oldOpts.geojsonVtOptions.maxZoom) && (newSource.buffer === undefined || newSource.buffer === oldOpts.geojsonVtOptions.buffer) && (newSource.tolerance === undefined || newSource.tolerance === oldOpts.geojsonVtOptions.tolerance) && (newSource.cluster === undefined || newSource.cluster === oldOpts.cluster) && (newSource.clusterRadius === undefined || newSource.clusterRadius === oldOpts.superclusterOptions.radius) && (newSource.clusterMaxZoom === undefined || newSource.clusterMaxZoom === oldOpts.superclusterOptions.maxZoom)) {
            oldSource.setData(newSource.data);
            return;
          }
        }
      }

      map.removeSource(update.id);
      map.addSource(update.id, newSource);
    }

    // Hover and click only query layers whose interactive property is true
    // If no interactivity is specified, query all layers

  }, {
    key: '_updateQueryParams',
    value: function _updateQueryParams(mapStyle) {
      var interactiveLayerIds = (0, _styleUtils.getInteractiveLayerIds)(mapStyle);
      this._queryParams = interactiveLayerIds.length === 0 ? {} : { layers: interactiveLayerIds };
    }

    // Individually update the maps source and layers that have changed if all
    // other style props haven't changed. This prevents flicking of the map when
    // styles only change sources or layers.
    /* eslint-disable max-statements, complexity */

  }, {
    key: '_setDiffStyle',
    value: function _setDiffStyle(prevStyle, nextStyle) {
      var prevKeysMap = prevStyle && styleKeysMap(prevStyle) || {};
      var nextKeysMap = styleKeysMap(nextStyle);
      function styleKeysMap(style) {
        return style.map(function () {
          return true;
        }).delete('layers').delete('sources').toJS();
      }
      function propsOtherThanLayersOrSourcesDiffer() {
        var prevKeysList = Object.keys(prevKeysMap);
        var nextKeysList = Object.keys(nextKeysMap);
        if (prevKeysList.length !== nextKeysList.length) {
          return true;
        }
        // `nextStyle` and `prevStyle` should not have the same set of props.
        if (nextKeysList.some(function (key) {
          return prevStyle.get(key) !== nextStyle.get(key);
        }
        // But the value of one of those props is different.
        )) {
          return true;
        }
        return false;
      }

      var map = this._getMap();

      if (!prevStyle || propsOtherThanLayersOrSourcesDiffer()) {
        map.setStyle(nextStyle.toJS());
        return;
      }

      var _diffStyles = (0, _diffStyles3.default)(prevStyle, nextStyle),
          sourcesDiff = _diffStyles.sourcesDiff,
          layersDiff = _diffStyles.layersDiff;

      // TODO: It's rather difficult to determine style diffing in the presence
      // of refs. For now, if any style update has a ref, fallback to no diffing.
      // We can come back to this case if there's a solid usecase.


      if (layersDiff.updates.some(function (node) {
        return node.layer.get('ref');
      })) {
        map.setStyle(nextStyle.toJS());
        return;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sourcesDiff.enter[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var enter = _step.value;

          map.addSource(enter.id, enter.source.toJS());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = sourcesDiff.update[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var update = _step2.value;

          this._updateSource(map, update);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = sourcesDiff.exit[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var exit = _step3.value;

          map.removeSource(exit.id);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = layersDiff.exiting[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _exit = _step4.value;

          if (map.style.getLayer(_exit.id)) {
            map.removeLayer(_exit.id);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = layersDiff.updates[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _update = _step5.value;

          if (!_update.enter) {
            // This is an old layer that needs to be updated. Remove the old layer
            // with the same id and add it back again.
            map.removeLayer(_update.id);
          }
          map.addLayer(_update.layer.toJS(), _update.before);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
    /* eslint-enable max-statements, complexity */

  }, {
    key: '_updateMapStyle',
    value: function _updateMapStyle(oldProps, newProps) {
      var mapStyle = newProps.mapStyle;
      var oldMapStyle = oldProps.mapStyle;
      if (mapStyle !== oldMapStyle) {
        if (_immutable2.default.Map.isMap(mapStyle)) {
          if (this.props.preventStyleDiffing) {
            this._getMap().setStyle(mapStyle.toJS());
          } else {
            this._setDiffStyle(oldMapStyle, mapStyle);
          }
        } else {
          this._getMap().setStyle(mapStyle);
        }
        this._updateQueryParams(mapStyle);
      }
    }
  }, {
    key: '_updateMapViewport',
    value: function _updateMapViewport(oldProps, newProps) {
      var viewportChanged = newProps.latitude !== oldProps.latitude || newProps.longitude !== oldProps.longitude || newProps.zoom !== oldProps.zoom || newProps.pitch !== oldProps.pitch || newProps.zoom !== oldProps.bearing || newProps.altitude !== oldProps.altitude;

      var map = this._getMap();

      if (viewportChanged) {
        map.jumpTo({
          center: [newProps.longitude, newProps.latitude],
          zoom: newProps.zoom,
          bearing: newProps.bearing,
          pitch: newProps.pitch
        });

        // TODO - jumpTo doesn't handle altitude
        if (newProps.altitude !== oldProps.altitude) {
          map.transform.altitude = newProps.altitude;
        }
      }
    }

    // Note: needs to be called after render (e.g. in componentDidUpdate)

  }, {
    key: '_updateMapSize',
    value: function _updateMapSize(oldProps, newProps) {
      var sizeChanged = oldProps.width !== newProps.width || oldProps.height !== newProps.height;

      if (sizeChanged) {
        var map = this._getMap();
        map.resize();
        this._callOnChangeViewport(map.transform);
      }
    }
  }, {
    key: '_calculateNewPitchAndBearing',
    value: function _calculateNewPitchAndBearing(_ref) {
      var pos = _ref.pos,
          startPos = _ref.startPos,
          startBearing = _ref.startBearing,
          startPitch = _ref.startPitch;

      var xDelta = pos.x - startPos.x;
      var bearing = startBearing + 180 * xDelta / this.props.width;

      var pitch = startPitch;
      var yDelta = pos.y - startPos.y;
      if (yDelta > 0) {
        // Dragging downwards, gradually decrease pitch
        if (Math.abs(this.props.height - startPos.y) > PITCH_MOUSE_THRESHOLD) {
          var scale = yDelta / (this.props.height - startPos.y);
          pitch = (1 - scale) * PITCH_ACCEL * startPitch;
        }
      } else if (yDelta < 0) {
        // Dragging upwards, gradually increase pitch
        if (startPos.y > PITCH_MOUSE_THRESHOLD) {
          // Move from 0 to 1 as we drag upwards
          var yScale = 1 - pos.y / startPos.y;
          // Gradually add until we hit max pitch
          pitch = startPitch + yScale * (MAX_PITCH - startPitch);
        }
      }

      // console.debug(startPitch, pitch);
      return {
        pitch: Math.max(Math.min(pitch, MAX_PITCH), 0),
        bearing: bearing
      };
    }

    // Helper to call props.onChangeViewport

  }, {
    key: '_callOnChangeViewport',
    value: function _callOnChangeViewport(transform) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.props.onChangeViewport) {
        this.props.onChangeViewport(_extends({
          latitude: transform.center.lat,
          longitude: (0, _transform.mod)(transform.center.lng + 180, 360) - 180,
          zoom: transform.zoom,
          pitch: transform.pitch,
          bearing: (0, _transform.mod)(transform.bearing + 180, 360) - 180,

          isDragging: this.props.isDragging,
          startDragLngLat: this.props.startDragLngLat,
          startBearing: this.props.startBearing,
          startPitch: this.props.startPitch

        }, opts));
      }
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(_ref2) {
      var pos = _ref2.pos;

      this._onMouseDown({ pos: pos });
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(_ref3) {
      var pos = _ref3.pos;

      var map = this._getMap();
      var lngLat = (0, _transform.unprojectFromTransform)(map.transform, pos);
      this._callOnChangeViewport(map.transform, {
        isDragging: true,
        startDragLngLat: [lngLat.lng, lngLat.lat],
        startBearing: map.transform.bearing,
        startPitch: map.transform.pitch
      });
    }
  }, {
    key: '_onTouchDrag',
    value: function _onTouchDrag(_ref4) {
      var pos = _ref4.pos;

      this._onMouseDrag({ pos: pos });
    }
  }, {
    key: '_onMouseDrag',
    value: function _onMouseDrag(_ref5) {
      var pos = _ref5.pos;

      if (!this.props.onChangeViewport) {
        return;
      }

      // take the start lnglat and put it where the mouse is down.
      //assert(this.props.startDragLngLat, '`startDragLngLat` prop is required ' +
      // 'for mouse drag behavior to calculate where to position the map.');

      var map = this._getMap();
      var transform = (0, _transform.cloneTransform)(map.transform);
      transform.setLocationAtPoint(this.props.startDragLngLat, pos);
      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onTouchRotate',
    value: function _onTouchRotate(_ref6) {
      var pos = _ref6.pos,
          startPos = _ref6.startPos;

      this._onMouseRotate({ pos: pos, startPos: startPos });
    }
  }, {
    key: '_onMouseRotate',
    value: function _onMouseRotate(_ref7) {
      var pos = _ref7.pos,
          startPos = _ref7.startPos;

      if (!this.props.onChangeViewport || !this.props.perspectiveEnabled) {
        return;
      }

      var _props = this.props,
          startBearing = _props.startBearing,
          startPitch = _props.startPitch;
      //assert(typeof startBearing === 'number',
      //  '`startBearing` prop is required for mouse rotate behavior');
      //assert(typeof startPitch === 'number',
      //  '`startPitch` prop is required for mouse rotate behavior');

      var map = this._getMap();

      var _calculateNewPitchAnd = this._calculateNewPitchAndBearing({
        pos: pos,
        startPos: startPos,
        startBearing: startBearing,
        startPitch: startPitch
      }),
          pitch = _calculateNewPitchAnd.pitch,
          bearing = _calculateNewPitchAnd.bearing;

      var transform = (0, _transform.cloneTransform)(map.transform);
      transform.bearing = bearing;
      transform.pitch = pitch;

      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(opt) {
      var map = this._getMap();
      var pos = opt.pos;
      if (!this.props.onHoverFeatures) {
        return;
      }
      var features = map.queryRenderedFeatures([pos.x, pos.y], this._queryParams);
      if (!features.length && this.props.ignoreEmptyFeatures) {
        return;
      }
      this.setState({ isHovering: features.length > 0 });
      this.props.onHoverFeatures(features);
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(opt) {
      this._onMouseUp(opt);
    }
  }, {
    key: '_onTouchTap',
    value: function _onTouchTap(opt) {
      this._onMouseClick(opt);
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(opt) {
      var map = this._getMap();
      this._callOnChangeViewport(map.transform, {
        isDragging: false,
        startDragLngLat: null,
        startBearing: null,
        startPitch: null
      });
    }
  }, {
    key: '_onMouseClick',
    value: function _onMouseClick(opt) {
      if (!this.props.onClickFeatures) {
        return;
      }

      var map = this._getMap();
      var pos = opt.pos;

      // Radius enables point features, like marker symbols, to be clicked.
      var size = this.props.clickRadius;
      var bbox = [[pos.x - size, pos.y - size], [pos.x + size, pos.y + size]];
      var features = map.queryRenderedFeatures(bbox, this._queryParams);
      if (!features.length && this.props.ignoreEmptyFeatures) {
        return;
      }
      this.props.onClickFeatures(features);
    }
  }, {
    key: '_onZoom',
    value: function _onZoom(_ref8) {
      var pos = _ref8.pos,
          scale = _ref8.scale;

      var map = this._getMap();
      var transform = (0, _transform.cloneTransform)(map.transform);
      var around = (0, _transform.unprojectFromTransform)(transform, pos);
      transform.zoom = transform.scaleZoom(map.transform.scale * scale);
      transform.setLocationAtPoint(around, pos);
      this._callOnChangeViewport(transform, {
        isDragging: true
      });
    }
  }, {
    key: '_onZoomEnd',
    value: function _onZoomEnd() {
      var map = this._getMap();
      this._callOnChangeViewport(map.transform, {
        isDragging: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          width = _props2.width,
          height = _props2.height,
          style = _props2.style;

      var mapStyle = _extends({}, style, {
        width: width,
        height: height,
        cursor: this._cursor()
      });

      var content = [_react2.default.createElement('div', { key: 'map', ref: 'mapboxMap',
        style: mapStyle, className: className }), _react2.default.createElement(
        'div',
        { key: 'overlays', className: 'overlays',
          style: { position: 'absolute', left: 0, top: 0 } },
        this.props.children
      )];

      if (this.state.isSupported && this.props.onChangeViewport) {
        content = _react2.default.createElement(
          _mapInteractions2.default,
          {
            onMouseDown: this._onMouseDown,
            onMouseDrag: this._onMouseDrag,
            onMouseRotate: this._onMouseRotate,
            onMouseUp: this._onMouseUp,
            onMouseMove: this._onMouseMove,
            onMouseClick: this._onMouseClick,
            onTouchStart: this._onTouchStart,
            onTouchDrag: this._onTouchDrag,
            onTouchRotate: this._onTouchRotate,
            onTouchEnd: this._onTouchEnd,
            onTouchTap: this._onTouchTap,
            onZoom: this._onZoom,
            onZoomEnd: this._onZoomEnd,
            width: this.props.width,
            height: this.props.height },
          content
        );
      }

      return _react2.default.createElement(
        'div',
        {
          style: _extends({}, this.props.style, {
            width: this.props.width,
            height: this.props.height,
            position: 'relative'
          }) },
        content
      );
    }
  }]);

  return MapGL;
}(_react.Component), (_applyDecoratedDescriptor(_class2.prototype, '_onTouchStart', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchStart'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseDown'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onTouchDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchDrag'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseDrag'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onTouchRotate', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchRotate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseRotate', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseRotate'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseMove'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onTouchEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchEnd'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onTouchTap', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onTouchTap'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseUp'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onMouseClick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onMouseClick'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onZoom', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onZoom'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, '_onZoomEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onZoomEnd'), _class2.prototype)), _class2)) || _class;

exports.default = MapGL;


MapGL.propTypes = PROP_TYPES;
MapGL.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAucmVhY3QuanMiXSwibmFtZXMiOlsibm9vcCIsIk1BWF9QSVRDSCIsIlBJVENIX01PVVNFX1RIUkVTSE9MRCIsIlBJVENIX0FDQ0VMIiwiUFJPUF9UWVBFUyIsImxhdGl0dWRlIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImxvbmdpdHVkZSIsInpvb20iLCJtYXBTdHlsZSIsIm9uZU9mVHlwZSIsInN0cmluZyIsImluc3RhbmNlT2YiLCJNYXAiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsIm9uQ2hhbmdlVmlld3BvcnQiLCJmdW5jIiwid2lkdGgiLCJoZWlnaHQiLCJpc0RyYWdnaW5nIiwiYm9vbCIsInN0YXJ0RHJhZ0xuZ0xhdCIsImFycmF5Iiwib25Ib3ZlckZlYXR1cmVzIiwiaWdub3JlRW1wdHlGZWF0dXJlcyIsImF0dHJpYnV0aW9uQ29udHJvbCIsIm9uQ2xpY2tGZWF0dXJlcyIsImNsaWNrUmFkaXVzIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwicHJldmVudFN0eWxlRGlmZmluZyIsInBlcnNwZWN0aXZlRW5hYmxlZCIsImJlYXJpbmciLCJQcm9wVHlwZXMiLCJwaXRjaCIsImFsdGl0dWRlIiwiREVGQVVMVF9QUk9QUyIsIkRFRkFVTFRTIiwiTUFQQk9YX0FQSV9BQ0NFU1NfVE9LRU4iLCJNYXBHTCIsInN1cHBvcnRlZCIsInByb3BzIiwic3RhdGUiLCJpc1N1cHBvcnRlZCIsImlzSG92ZXJpbmciLCJzdGFydEJlYXJpbmciLCJzdGFydFBpdGNoIiwiX3F1ZXJ5UGFyYW1zIiwiYWNjZXNzVG9rZW4iLCJjb21wb25lbnREaWRNb3VudCIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJjb21wb25lbnREaWRVcGRhdGUiLCJpc01hcCIsInRvSlMiLCJtYXAiLCJjb250YWluZXIiLCJyZWZzIiwibWFwYm94TWFwIiwiY2VudGVyIiwic3R5bGUiLCJpbnRlcmFjdGl2ZSIsImdldENhbnZhcyIsIl9tYXAiLCJfdXBkYXRlTWFwVmlld3BvcnQiLCJfY2FsbE9uQ2hhbmdlVmlld3BvcnQiLCJ0cmFuc2Zvcm0iLCJfdXBkYXRlUXVlcnlQYXJhbXMiLCJuZXdQcm9wcyIsIl91cGRhdGVTdGF0ZUZyb21Qcm9wcyIsIl91cGRhdGVNYXBTdHlsZSIsInNldFN0YXRlIiwiX3VwZGF0ZU1hcFNpemUiLCJyZW1vdmUiLCJpc0ludGVyYWN0aXZlIiwib25DbGlja0ZlYXR1cmUiLCJDVVJTT1IiLCJHUkFCQklORyIsIlBPSU5URVIiLCJHUkFCIiwib2xkUHJvcHMiLCJzbGljZSIsInVwZGF0ZSIsIm5ld1NvdXJjZSIsInNvdXJjZSIsInR5cGUiLCJvbGRTb3VyY2UiLCJnZXRTb3VyY2UiLCJpZCIsIm9sZE9wdHMiLCJ3b3JrZXJPcHRpb25zIiwibWF4em9vbSIsInVuZGVmaW5lZCIsImdlb2pzb25WdE9wdGlvbnMiLCJtYXhab29tIiwiYnVmZmVyIiwidG9sZXJhbmNlIiwiY2x1c3RlciIsImNsdXN0ZXJSYWRpdXMiLCJzdXBlcmNsdXN0ZXJPcHRpb25zIiwicmFkaXVzIiwiY2x1c3Rlck1heFpvb20iLCJzZXREYXRhIiwiZGF0YSIsInJlbW92ZVNvdXJjZSIsImFkZFNvdXJjZSIsImludGVyYWN0aXZlTGF5ZXJJZHMiLCJsZW5ndGgiLCJsYXllcnMiLCJwcmV2U3R5bGUiLCJuZXh0U3R5bGUiLCJwcmV2S2V5c01hcCIsInN0eWxlS2V5c01hcCIsIm5leHRLZXlzTWFwIiwiZGVsZXRlIiwicHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIiLCJwcmV2S2V5c0xpc3QiLCJPYmplY3QiLCJrZXlzIiwibmV4dEtleXNMaXN0Iiwic29tZSIsImdldCIsImtleSIsIl9nZXRNYXAiLCJzZXRTdHlsZSIsInNvdXJjZXNEaWZmIiwibGF5ZXJzRGlmZiIsInVwZGF0ZXMiLCJub2RlIiwibGF5ZXIiLCJlbnRlciIsIl91cGRhdGVTb3VyY2UiLCJleGl0IiwiZXhpdGluZyIsImdldExheWVyIiwicmVtb3ZlTGF5ZXIiLCJhZGRMYXllciIsImJlZm9yZSIsIm9sZE1hcFN0eWxlIiwiX3NldERpZmZTdHlsZSIsInZpZXdwb3J0Q2hhbmdlZCIsImp1bXBUbyIsInNpemVDaGFuZ2VkIiwicmVzaXplIiwicG9zIiwic3RhcnRQb3MiLCJ4RGVsdGEiLCJ4IiwieURlbHRhIiwieSIsIk1hdGgiLCJhYnMiLCJzY2FsZSIsInlTY2FsZSIsIm1heCIsIm1pbiIsIm9wdHMiLCJsYXQiLCJsbmciLCJfb25Nb3VzZURvd24iLCJsbmdMYXQiLCJfb25Nb3VzZURyYWciLCJzZXRMb2NhdGlvbkF0UG9pbnQiLCJfb25Nb3VzZVJvdGF0ZSIsIl9jYWxjdWxhdGVOZXdQaXRjaEFuZEJlYXJpbmciLCJvcHQiLCJmZWF0dXJlcyIsInF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyIsIl9vbk1vdXNlVXAiLCJfb25Nb3VzZUNsaWNrIiwic2l6ZSIsImJib3giLCJhcm91bmQiLCJzY2FsZVpvb20iLCJjbGFzc05hbWUiLCJjdXJzb3IiLCJfY3Vyc29yIiwiY29udGVudCIsInBvc2l0aW9uIiwibGVmdCIsInRvcCIsImNoaWxkcmVuIiwiX29uTW91c2VNb3ZlIiwiX29uVG91Y2hTdGFydCIsIl9vblRvdWNoRHJhZyIsIl9vblRvdWNoUm90YXRlIiwiX29uVG91Y2hFbmQiLCJfb25Ub3VjaFRhcCIsIl9vblpvb20iLCJfb25ab29tRW5kIiwicHJvcFR5cGVzIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztvQ0FBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFRQTs7QUFQQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVNBLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEI7QUFDQSxJQUFNQyxZQUFZ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QUFBO0FBQUE7QUFDRSx5QkFBZSxLQUFLbEIsWUFEdEI7QUFFRSx5QkFBZSxLQUFLRSxZQUZ0QjtBQUdFLDJCQUFpQixLQUFLRSxjQUh4QjtBQUlFLHVCQUFhLEtBQUtLLFVBSnBCO0FBS0UseUJBQWUsS0FBS2MsWUFMdEI7QUFNRSwwQkFBaUIsS0FBS2IsYUFOeEI7QUFPRSwwQkFBZ0IsS0FBS2MsYUFQdkI7QUFRRSx5QkFBZSxLQUFLQyxZQVJ0QjtBQVNFLDJCQUFpQixLQUFLQyxjQVR4QjtBQVVFLHdCQUFjLEtBQUtDLFdBVnJCO0FBV0Usd0JBQWUsS0FBS0MsV0FYdEI7QUFZRSxvQkFBVSxLQUFLQyxPQVpqQjtBQWFFLHVCQUFhLEtBQUtDLFVBYnBCO0FBY0UsbUJBQVMsS0FBS25KLEtBQUwsQ0FBV3ZCLEtBZHRCO0FBZUUsb0JBQVUsS0FBS3VCLEtBQUwsQ0FBV3RCLE1BZnZCO0FBaUJJNko7QUFqQkosU0FERjtBQXNCRDs7QUFFRCxhQUNFO0FBQUE7QUFBQTtBQUNFLDhCQUNLLEtBQUt2SSxLQUFMLENBQVdrQixLQURoQjtBQUVFekMsbUJBQU8sS0FBS3VCLEtBQUwsQ0FBV3ZCLEtBRnBCO0FBR0VDLG9CQUFRLEtBQUtzQixLQUFMLENBQVd0QixNQUhyQjtBQUlFOEosc0JBQVU7QUFKWixZQURGO0FBUUlEO0FBUkosT0FERjtBQWFEOzs7Ozs7a0JBeGZrQnpJLEs7OztBQTJmckJBLE1BQU1zSixTQUFOLEdBQWtCekwsVUFBbEI7QUFDQW1DLE1BQU11SixZQUFOLEdBQXFCMUosYUFBckIiLCJmaWxlIjoibWFwLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCBwdXJlUmVuZGVyIGZyb20gJ3B1cmUtcmVuZGVyLWRlY29yYXRvcic7XG5cbmltcG9ydCBtYXBib3hnbCBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IHtzZWxlY3R9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XG4vL2ltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcblxuaW1wb3J0IE1hcEludGVyYWN0aW9ucyBmcm9tICcuL21hcC1pbnRlcmFjdGlvbnMucmVhY3QnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbmltcG9ydCB7Z2V0SW50ZXJhY3RpdmVMYXllcklkc30gZnJvbSAnLi91dGlscy9zdHlsZS11dGlscyc7XG5pbXBvcnQgZGlmZlN0eWxlcyBmcm9tICcuL3V0aWxzL2RpZmYtc3R5bGVzJztcbmltcG9ydCB7bW9kLCB1bnByb2plY3RGcm9tVHJhbnNmb3JtLCBjbG9uZVRyYW5zZm9ybX0gZnJvbSAnLi91dGlscy90cmFuc2Zvcm0nO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuLy8gTm90ZTogTWF4IHBpdGNoIGlzIGEgaGFyZCBjb2RlZCB2YWx1ZSAobm90IGEgbmFtZWQgY29uc3RhbnQpIGluIHRyYW5zZm9ybS5qc1xuY29uc3QgTUFYX1BJVENIID0gNjA7XG5jb25zdCBQSVRDSF9NT1VTRV9USFJFU0hPTEQgPSAyMDtcbmNvbnN0IFBJVENIX0FDQ0VMID0gMS4yO1xuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICAvKipcbiAgICAqIFRoZSBsYXRpdHVkZSBvZiB0aGUgY2VudGVyIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgbGF0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgbG9uZ2l0dWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIG1hcC5cbiAgICAqL1xuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgLyoqXG4gICAgKiBUaGUgdGlsZSB6b29tIGxldmVsIG9mIHRoZSBtYXAuXG4gICAgKi9cbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAvKipcbiAgICAqIFRoZSBNYXBib3ggc3R5bGUgdGhlIGNvbXBvbmVudCBzaG91bGQgdXNlLiBDYW4gZWl0aGVyIGJlIGEgc3RyaW5nIHVybFxuICAgICogb3IgYSBNYXBib3hHTCBzdHlsZSBJbW11dGFibGUuTWFwIG9iamVjdC5cbiAgICAqL1xuICBtYXBTdHlsZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTWFwKVxuICBdKSxcbiAgLyoqXG4gICAgKiBUaGUgTWFwYm94IEFQSSBhY2Nlc3MgdG9rZW4gdG8gcHJvdmlkZSB0byBtYXBib3gtZ2wtanMuIFRoaXMgaXMgcmVxdWlyZWRcbiAgICAqIHdoZW4gdXNpbmcgTWFwYm94IHByb3ZpZGVkIHZlY3RvciB0aWxlcyBhbmQgc3R5bGVzLlxuICAgICovXG4gIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAvKipcbiAgICAqIGBvbkNoYW5nZVZpZXdwb3J0YCBjYWxsYmFjayBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIGludGVyYWN0ZWQgd2l0aCB0aGVcbiAgICAqIG1hcC4gVGhlIG9iamVjdCBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGNvbnRhaW5zIGBsYXRpdHVkZWAsXG4gICAgKiBgbG9uZ2l0dWRlYCBhbmQgYHpvb21gIGFuZCBhZGRpdGlvbmFsIHN0YXRlIGluZm9ybWF0aW9uLlxuICAgICovXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIFRoZSB3aWR0aCBvZiB0aGUgbWFwLlxuICAgICovXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogVGhlIGhlaWdodCBvZiB0aGUgbWFwLlxuICAgICovXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAvKipcbiAgICAqIElzIHRoZSBjb21wb25lbnQgY3VycmVudGx5IGJlaW5nIGRyYWdnZWQuIFRoaXMgaXMgdXNlZCB0byBzaG93L2hpZGUgdGhlXG4gICAgKiBkcmFnIGN1cnNvci4gQWxzbyB1c2VkIGFzIGFuIG9wdGltaXphdGlvbiBpbiBzb21lIG92ZXJsYXlzIGJ5IHByZXZlbnRpbmdcbiAgICAqIHJlbmRlcmluZyB3aGlsZSBkcmFnZ2luZy5cbiAgICAqL1xuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgLyoqXG4gICAgKiBSZXF1aXJlZCB0byBjYWxjdWxhdGUgdGhlIG1vdXNlIHByb2plY3Rpb24gYWZ0ZXIgdGhlIGZpcnN0IGNsaWNrIGV2ZW50XG4gICAgKiBkdXJpbmcgZHJhZ2dpbmcuIFdoZXJlIHRoZSBtYXAgaXMgZGVwZW5kcyBvbiB3aGVyZSB5b3UgZmlyc3QgY2xpY2tlZCBvblxuICAgICogdGhlIG1hcC5cbiAgICAqL1xuICBzdGFydERyYWdMbmdMYXQ6IFByb3BUeXBlcy5hcnJheSxcbiAgLyoqXG4gICAgKiBDYWxsZWQgd2hlbiBhIGZlYXR1cmUgaXMgaG92ZXJlZCBvdmVyLiBVc2VzIE1hcGJveCdzXG4gICAgKiBxdWVyeVJlbmRlcmVkRmVhdHVyZXMgQVBJIHRvIGZpbmQgZmVhdHVyZXMgdW5kZXIgdGhlIHBvaW50ZXI6XG4gICAgKiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1qcy9hcGkvI01hcCNxdWVyeVJlbmRlcmVkRmVhdHVyZXNcbiAgICAqIFRvIHF1ZXJ5IG9ubHkgc29tZSBvZiB0aGUgbGF5ZXJzLCBzZXQgdGhlIGBpbnRlcmFjdGl2ZWAgcHJvcGVydHkgaW4gdGhlXG4gICAgKiBsYXllciBzdHlsZSB0byBgdHJ1ZWAuIFNlZSBNYXBib3gncyBzdHlsZSBzcGVjXG4gICAgKiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1zdHlsZS1zcGVjLyNsYXllci1pbnRlcmFjdGl2ZVxuICAgICogSWYgbm8gaW50ZXJhY3RpdmUgbGF5ZXJzIGFyZSBmb3VuZCAoZS5nLiB1c2luZyBNYXBib3gncyBkZWZhdWx0IHN0eWxlcyksXG4gICAgKiB3aWxsIGZhbGwgYmFjayB0byBxdWVyeSBhbGwgbGF5ZXJzLlxuICAgICogQGNhbGxiYWNrXG4gICAgKiBAcGFyYW0ge2FycmF5fSBmZWF0dXJlcyAtIFRoZSBhcnJheSBvZiBmZWF0dXJlcyB0aGUgbW91c2UgaXMgb3Zlci5cbiAgICAqL1xuICBvbkhvdmVyRmVhdHVyZXM6IFByb3BUeXBlcy5mdW5jLFxuICAvKipcbiAgICAqIERlZmF1bHRzIHRvIFRSVUVcbiAgICAqIFNldCB0byBmYWxzZSB0byBlbmFibGUgb25Ib3ZlckZlYXR1cmVzIHRvIGJlIGNhbGxlZCByZWdhcmRsZXNzIGlmXG4gICAgKiB0aGVyZSBpcyBhbiBhY3R1YWwgZmVhdHVyZSBhdCB4LCB5LiBUaGlzIGlzIHVzZWZ1bCB0byBlbXVsYXRlXG4gICAgKiBcIm1vdXNlLW91dFwiIGJlaGF2aW9ycyBvbiBmZWF0dXJlcy5cbiAgICAqL1xuICBpZ25vcmVFbXB0eUZlYXR1cmVzOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFNob3cgYXR0cmlidXRpb24gY29udHJvbCBvciBub3QuXG4gICAgKi9cbiAgYXR0cmlidXRpb25Db250cm9sOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIENhbGxlZCB3aGVuIGEgZmVhdHVyZSBpcyBjbGlja2VkIG9uLiBVc2VzIE1hcGJveCdzXG4gICAgKiBxdWVyeVJlbmRlcmVkRmVhdHVyZXMgQVBJIHRvIGZpbmQgZmVhdHVyZXMgdW5kZXIgdGhlIHBvaW50ZXI6XG4gICAgKiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1qcy9hcGkvI01hcCNxdWVyeVJlbmRlcmVkRmVhdHVyZXNcbiAgICAqIFRvIHF1ZXJ5IG9ubHkgc29tZSBvZiB0aGUgbGF5ZXJzLCBzZXQgdGhlIGBpbnRlcmFjdGl2ZWAgcHJvcGVydHkgaW4gdGhlXG4gICAgKiBsYXllciBzdHlsZSB0byBgdHJ1ZWAuIFNlZSBNYXBib3gncyBzdHlsZSBzcGVjXG4gICAgKiBodHRwczovL3d3dy5tYXBib3guY29tL21hcGJveC1nbC1zdHlsZS1zcGVjLyNsYXllci1pbnRlcmFjdGl2ZVxuICAgICogSWYgbm8gaW50ZXJhY3RpdmUgbGF5ZXJzIGFyZSBmb3VuZCAoZS5nLiB1c2luZyBNYXBib3gncyBkZWZhdWx0IHN0eWxlcyksXG4gICAgKiB3aWxsIGZhbGwgYmFjayB0byBxdWVyeSBhbGwgbGF5ZXJzLlxuICAgICovXG4gIG9uQ2xpY2tGZWF0dXJlczogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAgKiBSYWRpdXMgdG8gZGV0ZWN0IGZlYXR1cmVzIGFyb3VuZCBhIGNsaWNrZWQgcG9pbnQuIERlZmF1bHRzIHRvIDE1LlxuICAgICovXG4gIGNsaWNrUmFkaXVzOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogUGFzc2VkIHRvIE1hcGJveCBNYXAgY29uc3RydWN0b3Igd2hpY2ggcGFzc2VzIGl0IHRvIHRoZSBjYW52YXMgY29udGV4dC5cbiAgICAqIFRoaXMgaXMgdW5zZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGV4cG9ydCB0aGUgY2FudmFzIGFzIGEgUE5HLlxuICAgICovXG4gIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAgKiBUaGVyZSBhcmUgc3RpbGwga25vd24gaXNzdWVzIHdpdGggc3R5bGUgZGlmZmluZy4gQXMgYSB0ZW1wb3Jhcnkgc3RvcGdhcCxcbiAgICAqIGFkZCB0aGUgb3B0aW9uIHRvIHByZXZlbnQgc3R5bGUgZGlmZmluZy5cbiAgICAqL1xuICBwcmV2ZW50U3R5bGVEaWZmaW5nOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIEVuYWJsZXMgcGVyc3BlY3RpdmUgY29udHJvbCBldmVudCBoYW5kbGluZyAoQ29tbWFuZC1yb3RhdGUpXG4gICAgKi9cbiAgcGVyc3BlY3RpdmVFbmFibGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIGJlYXJpbmcgb2YgdGhlIHZpZXdwb3J0XG4gICAgKi9cbiAgYmVhcmluZzogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICAqIFNwZWNpZnkgdGhlIHBpdGNoIG9mIHRoZSB2aWV3cG9ydFxuICAgICovXG4gIHBpdGNoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gIC8qKlxuICAgICogU3BlY2lmeSB0aGUgYWx0aXR1ZGUgb2YgdGhlIHZpZXdwb3J0IGNhbWVyYVxuICAgICogVW5pdDogbWFwIGhlaWdodHMsIGRlZmF1bHQgMS41XG4gICAgKiBOb24tcHVibGljIEFQSSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LWdsLWpzL2lzc3Vlcy8xMTM3XG4gICAgKi9cbiAgYWx0aXR1ZGU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG1hcFN0eWxlOiAnbWFwYm94Oi8vc3R5bGVzL21hcGJveC9zYXRlbGxpdGUtdjknLFxuICBvbkNoYW5nZVZpZXdwb3J0OiBudWxsLFxuICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogY29uZmlnLkRFRkFVTFRTLk1BUEJPWF9BUElfQUNDRVNTX1RPS0VOLFxuICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IGZhbHNlLFxuICBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUsXG4gIGlnbm9yZUVtcHR5RmVhdHVyZXM6IHRydWUsXG4gIGJlYXJpbmc6IDAsXG4gIHBpdGNoOiAwLFxuICBhbHRpdHVkZTogMS41LFxuICBjbGlja1JhZGl1czogMTVcbn07XG5cbkBwdXJlUmVuZGVyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBHTCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgc3RhdGljIHN1cHBvcnRlZCgpIHtcbiAgICByZXR1cm4gbWFwYm94Z2wuc3VwcG9ydGVkKCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNTdXBwb3J0ZWQ6IG1hcGJveGdsLnN1cHBvcnRlZCgpLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBpc0hvdmVyaW5nOiBmYWxzZSxcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogbnVsbCxcbiAgICAgIHN0YXJ0QmVhcmluZzogbnVsbCxcbiAgICAgIHN0YXJ0UGl0Y2g6IG51bGxcbiAgICB9O1xuICAgIHRoaXMuX3F1ZXJ5UGFyYW1zID0ge307XG4gICAgbWFwYm94Z2wuYWNjZXNzVG9rZW4gPSBwcm9wcy5tYXBib3hBcGlBY2Nlc3NUb2tlbjtcblxuICAgIGlmICghdGhpcy5zdGF0ZS5pc1N1cHBvcnRlZCkge1xuICAgICAgdGhpcy5jb21wb25lbnREaWRNb3VudCA9IG5vb3A7XG4gICAgICB0aGlzLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgPSBub29wO1xuICAgICAgdGhpcy5jb21wb25lbnREaWRVcGRhdGUgPSBub29wO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IG1hcFN0eWxlID0gSW1tdXRhYmxlLk1hcC5pc01hcCh0aGlzLnByb3BzLm1hcFN0eWxlKSA/XG4gICAgICB0aGlzLnByb3BzLm1hcFN0eWxlLnRvSlMoKSA6XG4gICAgICB0aGlzLnByb3BzLm1hcFN0eWxlO1xuICAgIGNvbnN0IG1hcCA9IG5ldyBtYXBib3hnbC5NYXAoe1xuICAgICAgY29udGFpbmVyOiB0aGlzLnJlZnMubWFwYm94TWFwLFxuICAgICAgY2VudGVyOiBbdGhpcy5wcm9wcy5sb25naXR1ZGUsIHRoaXMucHJvcHMubGF0aXR1ZGVdLFxuICAgICAgem9vbTogdGhpcy5wcm9wcy56b29tLFxuICAgICAgcGl0Y2g6IHRoaXMucHJvcHMucGl0Y2gsXG4gICAgICBiZWFyaW5nOiB0aGlzLnByb3BzLmJlYXJpbmcsXG4gICAgICBzdHlsZTogbWFwU3R5bGUsXG4gICAgICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gICAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRoaXMucHJvcHMucHJlc2VydmVEcmF3aW5nQnVmZmVyXG4gICAgICAvLyBUT0RPP1xuICAgICAgLy8gYXR0cmlidXRpb25Db250cm9sOiB0aGlzLnByb3BzLmF0dHJpYnV0aW9uQ29udHJvbFxuICAgIH0pO1xuXG4gICAgc2VsZWN0KG1hcC5nZXRDYW52YXMoKSkuc3R5bGUoJ291dGxpbmUnLCAnbm9uZScpO1xuXG4gICAgdGhpcy5fbWFwID0gbWFwO1xuICAgIHRoaXMuX3VwZGF0ZU1hcFZpZXdwb3J0KHt9LCB0aGlzLnByb3BzKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtKTtcbiAgICB0aGlzLl91cGRhdGVRdWVyeVBhcmFtcyhtYXBTdHlsZSk7XG4gIH1cblxuICAvLyBOZXcgcHJvcHMgYXJlIGNvbWluJyByb3VuZCB0aGUgY29ybmVyIVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgdGhpcy5fdXBkYXRlU3RhdGVGcm9tUHJvcHModGhpcy5wcm9wcywgbmV3UHJvcHMpO1xuICAgIHRoaXMuX3VwZGF0ZU1hcFZpZXdwb3J0KHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICB0aGlzLl91cGRhdGVNYXBTdHlsZSh0aGlzLnByb3BzLCBuZXdQcm9wcyk7XG4gICAgLy8gU2F2ZSB3aWR0aC9oZWlnaHQgc28gdGhhdCB3ZSBjYW4gY2hlY2sgdGhlbSBpbiBjb21wb25lbnREaWRVcGRhdGVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodFxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIC8vIG1hcC5yZXNpemUoKSByZWFkcyBzaXplIGZyb20gRE9NLCB3ZSBuZWVkIHRvIGNhbGwgYWZ0ZXIgcmVuZGVyXG4gICAgdGhpcy5fdXBkYXRlTWFwU2l6ZSh0aGlzLnN0YXRlLCB0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLl9tYXApIHtcbiAgICAgIHRoaXMuX21hcC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBfY3Vyc29yKCkge1xuICAgIGNvbnN0IGlzSW50ZXJhY3RpdmUgPVxuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0IHx8XG4gICAgICB0aGlzLnByb3BzLm9uQ2xpY2tGZWF0dXJlIHx8XG4gICAgICB0aGlzLnByb3BzLm9uSG92ZXJGZWF0dXJlcztcbiAgICBpZiAoaXNJbnRlcmFjdGl2ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuaXNEcmFnZ2luZyA/XG4gICAgICAgIGNvbmZpZy5DVVJTT1IuR1JBQkJJTkcgOlxuICAgICAgICAodGhpcy5zdGF0ZS5pc0hvdmVyaW5nID8gY29uZmlnLkNVUlNPUi5QT0lOVEVSIDogY29uZmlnLkNVUlNPUi5HUkFCKTtcbiAgICB9XG4gICAgcmV0dXJuICdpbmhlcml0JztcbiAgfVxuXG4gIF9nZXRNYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcDtcbiAgfVxuXG4gIF91cGRhdGVTdGF0ZUZyb21Qcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBtYXBib3hnbC5hY2Nlc3NUb2tlbiA9IG5ld1Byb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuO1xuICAgIGNvbnN0IHtzdGFydERyYWdMbmdMYXR9ID0gbmV3UHJvcHM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGFydERyYWdMbmdMYXQ6IHN0YXJ0RHJhZ0xuZ0xhdCAmJiBzdGFydERyYWdMbmdMYXQuc2xpY2UoKVxuICAgIH0pO1xuICB9XG5cbiAgX3VwZGF0ZVNvdXJjZShtYXAsIHVwZGF0ZSkge1xuICAgIGNvbnN0IG5ld1NvdXJjZSA9IHVwZGF0ZS5zb3VyY2UudG9KUygpO1xuICAgIGlmIChuZXdTb3VyY2UudHlwZSA9PT0gJ2dlb2pzb24nKSB7XG4gICAgICBjb25zdCBvbGRTb3VyY2UgPSBtYXAuZ2V0U291cmNlKHVwZGF0ZS5pZCk7XG4gICAgICBpZiAob2xkU291cmNlLnR5cGUgPT09ICdnZW9qc29uJykge1xuICAgICAgICAvLyB1cGRhdGUgZGF0YSBpZiBubyBvdGhlciBHZW9KU09OU291cmNlIG9wdGlvbnMgd2VyZSBjaGFuZ2VkXG4gICAgICAgIGNvbnN0IG9sZE9wdHMgPSBvbGRTb3VyY2Uud29ya2VyT3B0aW9ucztcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChuZXdTb3VyY2UubWF4em9vbSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBuZXdTb3VyY2UubWF4em9vbSA9PT0gb2xkT3B0cy5nZW9qc29uVnRPcHRpb25zLm1heFpvb20pICYmXG4gICAgICAgICAgKG5ld1NvdXJjZS5idWZmZXIgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgbmV3U291cmNlLmJ1ZmZlciA9PT0gb2xkT3B0cy5nZW9qc29uVnRPcHRpb25zLmJ1ZmZlcikgJiZcbiAgICAgICAgICAobmV3U291cmNlLnRvbGVyYW5jZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBuZXdTb3VyY2UudG9sZXJhbmNlID09PSBvbGRPcHRzLmdlb2pzb25WdE9wdGlvbnMudG9sZXJhbmNlKSAmJlxuICAgICAgICAgIChuZXdTb3VyY2UuY2x1c3RlciA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBuZXdTb3VyY2UuY2x1c3RlciA9PT0gb2xkT3B0cy5jbHVzdGVyKSAmJlxuICAgICAgICAgIChuZXdTb3VyY2UuY2x1c3RlclJhZGl1cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBuZXdTb3VyY2UuY2x1c3RlclJhZGl1cyA9PT0gb2xkT3B0cy5zdXBlcmNsdXN0ZXJPcHRpb25zLnJhZGl1cykgJiZcbiAgICAgICAgICAobmV3U291cmNlLmNsdXN0ZXJNYXhab29tID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIG5ld1NvdXJjZS5jbHVzdGVyTWF4Wm9vbSA9PT0gb2xkT3B0cy5zdXBlcmNsdXN0ZXJPcHRpb25zLm1heFpvb20pXG4gICAgICAgICkge1xuICAgICAgICAgIG9sZFNvdXJjZS5zZXREYXRhKG5ld1NvdXJjZS5kYXRhKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBtYXAucmVtb3ZlU291cmNlKHVwZGF0ZS5pZCk7XG4gICAgbWFwLmFkZFNvdXJjZSh1cGRhdGUuaWQsIG5ld1NvdXJjZSk7XG4gIH1cblxuICAvLyBIb3ZlciBhbmQgY2xpY2sgb25seSBxdWVyeSBsYXllcnMgd2hvc2UgaW50ZXJhY3RpdmUgcHJvcGVydHkgaXMgdHJ1ZVxuICAvLyBJZiBubyBpbnRlcmFjdGl2aXR5IGlzIHNwZWNpZmllZCwgcXVlcnkgYWxsIGxheWVyc1xuICBfdXBkYXRlUXVlcnlQYXJhbXMobWFwU3R5bGUpIHtcbiAgICBjb25zdCBpbnRlcmFjdGl2ZUxheWVySWRzID0gZ2V0SW50ZXJhY3RpdmVMYXllcklkcyhtYXBTdHlsZSk7XG4gICAgdGhpcy5fcXVlcnlQYXJhbXMgPSBpbnRlcmFjdGl2ZUxheWVySWRzLmxlbmd0aCA9PT0gMCA/IHt9IDpcbiAgICAgIHtsYXllcnM6IGludGVyYWN0aXZlTGF5ZXJJZHN9O1xuICB9XG5cbiAgLy8gSW5kaXZpZHVhbGx5IHVwZGF0ZSB0aGUgbWFwcyBzb3VyY2UgYW5kIGxheWVycyB0aGF0IGhhdmUgY2hhbmdlZCBpZiBhbGxcbiAgLy8gb3RoZXIgc3R5bGUgcHJvcHMgaGF2ZW4ndCBjaGFuZ2VkLiBUaGlzIHByZXZlbnRzIGZsaWNraW5nIG9mIHRoZSBtYXAgd2hlblxuICAvLyBzdHlsZXMgb25seSBjaGFuZ2Ugc291cmNlcyBvciBsYXllcnMuXG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzLCBjb21wbGV4aXR5ICovXG4gIF9zZXREaWZmU3R5bGUocHJldlN0eWxlLCBuZXh0U3R5bGUpIHtcbiAgICBjb25zdCBwcmV2S2V5c01hcCA9IHByZXZTdHlsZSAmJiBzdHlsZUtleXNNYXAocHJldlN0eWxlKSB8fCB7fTtcbiAgICBjb25zdCBuZXh0S2V5c01hcCA9IHN0eWxlS2V5c01hcChuZXh0U3R5bGUpO1xuICAgIGZ1bmN0aW9uIHN0eWxlS2V5c01hcChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlLm1hcCgoKSA9PiB0cnVlKS5kZWxldGUoJ2xheWVycycpLmRlbGV0ZSgnc291cmNlcycpLnRvSlMoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJvcHNPdGhlclRoYW5MYXllcnNPclNvdXJjZXNEaWZmZXIoKSB7XG4gICAgICBjb25zdCBwcmV2S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhwcmV2S2V5c01hcCk7XG4gICAgICBjb25zdCBuZXh0S2V5c0xpc3QgPSBPYmplY3Qua2V5cyhuZXh0S2V5c01hcCk7XG4gICAgICBpZiAocHJldktleXNMaXN0Lmxlbmd0aCAhPT0gbmV4dEtleXNMaXN0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGBuZXh0U3R5bGVgIGFuZCBgcHJldlN0eWxlYCBzaG91bGQgbm90IGhhdmUgdGhlIHNhbWUgc2V0IG9mIHByb3BzLlxuICAgICAgaWYgKG5leHRLZXlzTGlzdC5zb21lKFxuICAgICAgICBrZXkgPT4gcHJldlN0eWxlLmdldChrZXkpICE9PSBuZXh0U3R5bGUuZ2V0KGtleSlcbiAgICAgICAgLy8gQnV0IHRoZSB2YWx1ZSBvZiBvbmUgb2YgdGhvc2UgcHJvcHMgaXMgZGlmZmVyZW50LlxuICAgICAgKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcblxuICAgIGlmICghcHJldlN0eWxlIHx8IHByb3BzT3RoZXJUaGFuTGF5ZXJzT3JTb3VyY2VzRGlmZmVyKCkpIHtcbiAgICAgIG1hcC5zZXRTdHlsZShuZXh0U3R5bGUudG9KUygpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7c291cmNlc0RpZmYsIGxheWVyc0RpZmZ9ID0gZGlmZlN0eWxlcyhwcmV2U3R5bGUsIG5leHRTdHlsZSk7XG5cbiAgICAvLyBUT0RPOiBJdCdzIHJhdGhlciBkaWZmaWN1bHQgdG8gZGV0ZXJtaW5lIHN0eWxlIGRpZmZpbmcgaW4gdGhlIHByZXNlbmNlXG4gICAgLy8gb2YgcmVmcy4gRm9yIG5vdywgaWYgYW55IHN0eWxlIHVwZGF0ZSBoYXMgYSByZWYsIGZhbGxiYWNrIHRvIG5vIGRpZmZpbmcuXG4gICAgLy8gV2UgY2FuIGNvbWUgYmFjayB0byB0aGlzIGNhc2UgaWYgdGhlcmUncyBhIHNvbGlkIHVzZWNhc2UuXG4gICAgaWYgKGxheWVyc0RpZmYudXBkYXRlcy5zb21lKG5vZGUgPT4gbm9kZS5sYXllci5nZXQoJ3JlZicpKSkge1xuICAgICAgbWFwLnNldFN0eWxlKG5leHRTdHlsZS50b0pTKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZW50ZXIgb2Ygc291cmNlc0RpZmYuZW50ZXIpIHtcbiAgICAgIG1hcC5hZGRTb3VyY2UoZW50ZXIuaWQsIGVudGVyLnNvdXJjZS50b0pTKCkpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHVwZGF0ZSBvZiBzb3VyY2VzRGlmZi51cGRhdGUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVNvdXJjZShtYXAsIHVwZGF0ZSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZXhpdCBvZiBzb3VyY2VzRGlmZi5leGl0KSB7XG4gICAgICBtYXAucmVtb3ZlU291cmNlKGV4aXQuaWQpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGV4aXQgb2YgbGF5ZXJzRGlmZi5leGl0aW5nKSB7XG4gICAgICBpZiAobWFwLnN0eWxlLmdldExheWVyKGV4aXQuaWQpKSB7XG4gICAgICAgIG1hcC5yZW1vdmVMYXllcihleGl0LmlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCB1cGRhdGUgb2YgbGF5ZXJzRGlmZi51cGRhdGVzKSB7XG4gICAgICBpZiAoIXVwZGF0ZS5lbnRlcikge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIG9sZCBsYXllciB0aGF0IG5lZWRzIHRvIGJlIHVwZGF0ZWQuIFJlbW92ZSB0aGUgb2xkIGxheWVyXG4gICAgICAgIC8vIHdpdGggdGhlIHNhbWUgaWQgYW5kIGFkZCBpdCBiYWNrIGFnYWluLlxuICAgICAgICBtYXAucmVtb3ZlTGF5ZXIodXBkYXRlLmlkKTtcbiAgICAgIH1cbiAgICAgIG1hcC5hZGRMYXllcih1cGRhdGUubGF5ZXIudG9KUygpLCB1cGRhdGUuYmVmb3JlKTtcbiAgICB9XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cywgY29tcGxleGl0eSAqL1xuXG4gIF91cGRhdGVNYXBTdHlsZShvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBjb25zdCBtYXBTdHlsZSA9IG5ld1Byb3BzLm1hcFN0eWxlO1xuICAgIGNvbnN0IG9sZE1hcFN0eWxlID0gb2xkUHJvcHMubWFwU3R5bGU7XG4gICAgaWYgKG1hcFN0eWxlICE9PSBvbGRNYXBTdHlsZSkge1xuICAgICAgaWYgKEltbXV0YWJsZS5NYXAuaXNNYXAobWFwU3R5bGUpKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnByZXZlbnRTdHlsZURpZmZpbmcpIHtcbiAgICAgICAgICB0aGlzLl9nZXRNYXAoKS5zZXRTdHlsZShtYXBTdHlsZS50b0pTKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3NldERpZmZTdHlsZShvbGRNYXBTdHlsZSwgbWFwU3R5bGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9nZXRNYXAoKS5zZXRTdHlsZShtYXBTdHlsZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl91cGRhdGVRdWVyeVBhcmFtcyhtYXBTdHlsZSk7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZU1hcFZpZXdwb3J0KG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGNvbnN0IHZpZXdwb3J0Q2hhbmdlZCA9XG4gICAgICBuZXdQcm9wcy5sYXRpdHVkZSAhPT0gb2xkUHJvcHMubGF0aXR1ZGUgfHxcbiAgICAgIG5ld1Byb3BzLmxvbmdpdHVkZSAhPT0gb2xkUHJvcHMubG9uZ2l0dWRlIHx8XG4gICAgICBuZXdQcm9wcy56b29tICE9PSBvbGRQcm9wcy56b29tIHx8XG4gICAgICBuZXdQcm9wcy5waXRjaCAhPT0gb2xkUHJvcHMucGl0Y2ggfHxcbiAgICAgIG5ld1Byb3BzLnpvb20gIT09IG9sZFByb3BzLmJlYXJpbmcgfHxcbiAgICAgIG5ld1Byb3BzLmFsdGl0dWRlICE9PSBvbGRQcm9wcy5hbHRpdHVkZTtcblxuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuXG4gICAgaWYgKHZpZXdwb3J0Q2hhbmdlZCkge1xuICAgICAgbWFwLmp1bXBUbyh7XG4gICAgICAgIGNlbnRlcjogW25ld1Byb3BzLmxvbmdpdHVkZSwgbmV3UHJvcHMubGF0aXR1ZGVdLFxuICAgICAgICB6b29tOiBuZXdQcm9wcy56b29tLFxuICAgICAgICBiZWFyaW5nOiBuZXdQcm9wcy5iZWFyaW5nLFxuICAgICAgICBwaXRjaDogbmV3UHJvcHMucGl0Y2hcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUT0RPIC0ganVtcFRvIGRvZXNuJ3QgaGFuZGxlIGFsdGl0dWRlXG4gICAgICBpZiAobmV3UHJvcHMuYWx0aXR1ZGUgIT09IG9sZFByb3BzLmFsdGl0dWRlKSB7XG4gICAgICAgIG1hcC50cmFuc2Zvcm0uYWx0aXR1ZGUgPSBuZXdQcm9wcy5hbHRpdHVkZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBOb3RlOiBuZWVkcyB0byBiZSBjYWxsZWQgYWZ0ZXIgcmVuZGVyIChlLmcuIGluIGNvbXBvbmVudERpZFVwZGF0ZSlcbiAgX3VwZGF0ZU1hcFNpemUob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgY29uc3Qgc2l6ZUNoYW5nZWQgPVxuICAgICAgb2xkUHJvcHMud2lkdGggIT09IG5ld1Byb3BzLndpZHRoIHx8IG9sZFByb3BzLmhlaWdodCAhPT0gbmV3UHJvcHMuaGVpZ2h0O1xuXG4gICAgaWYgKHNpemVDaGFuZ2VkKSB7XG4gICAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICAgIG1hcC5yZXNpemUoKTtcbiAgICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0pO1xuICAgIH1cbiAgfVxuXG4gIF9jYWxjdWxhdGVOZXdQaXRjaEFuZEJlYXJpbmcoe3Bvcywgc3RhcnRQb3MsIHN0YXJ0QmVhcmluZywgc3RhcnRQaXRjaH0pIHtcbiAgICBjb25zdCB4RGVsdGEgPSBwb3MueCAtIHN0YXJ0UG9zLng7XG4gICAgY29uc3QgYmVhcmluZyA9IHN0YXJ0QmVhcmluZyArIDE4MCAqIHhEZWx0YSAvIHRoaXMucHJvcHMud2lkdGg7XG5cbiAgICBsZXQgcGl0Y2ggPSBzdGFydFBpdGNoO1xuICAgIGNvbnN0IHlEZWx0YSA9IHBvcy55IC0gc3RhcnRQb3MueTtcbiAgICBpZiAoeURlbHRhID4gMCkge1xuICAgICAgLy8gRHJhZ2dpbmcgZG93bndhcmRzLCBncmFkdWFsbHkgZGVjcmVhc2UgcGl0Y2hcbiAgICAgIGlmIChNYXRoLmFicyh0aGlzLnByb3BzLmhlaWdodCAtIHN0YXJ0UG9zLnkpID4gUElUQ0hfTU9VU0VfVEhSRVNIT0xEKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlID0geURlbHRhIC8gKHRoaXMucHJvcHMuaGVpZ2h0IC0gc3RhcnRQb3MueSk7XG4gICAgICAgIHBpdGNoID0gKDEgLSBzY2FsZSkgKiBQSVRDSF9BQ0NFTCAqIHN0YXJ0UGl0Y2g7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh5RGVsdGEgPCAwKSB7XG4gICAgICAvLyBEcmFnZ2luZyB1cHdhcmRzLCBncmFkdWFsbHkgaW5jcmVhc2UgcGl0Y2hcbiAgICAgIGlmIChzdGFydFBvcy55ID4gUElUQ0hfTU9VU0VfVEhSRVNIT0xEKSB7XG4gICAgICAgIC8vIE1vdmUgZnJvbSAwIHRvIDEgYXMgd2UgZHJhZyB1cHdhcmRzXG4gICAgICAgIGNvbnN0IHlTY2FsZSA9IDEgLSBwb3MueSAvIHN0YXJ0UG9zLnk7XG4gICAgICAgIC8vIEdyYWR1YWxseSBhZGQgdW50aWwgd2UgaGl0IG1heCBwaXRjaFxuICAgICAgICBwaXRjaCA9IHN0YXJ0UGl0Y2ggKyB5U2NhbGUgKiAoTUFYX1BJVENIIC0gc3RhcnRQaXRjaCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5kZWJ1ZyhzdGFydFBpdGNoLCBwaXRjaCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBpdGNoOiBNYXRoLm1heChNYXRoLm1pbihwaXRjaCwgTUFYX1BJVENIKSwgMCksXG4gICAgICBiZWFyaW5nXG4gICAgfTtcbiAgfVxuXG4gICAvLyBIZWxwZXIgdG8gY2FsbCBwcm9wcy5vbkNoYW5nZVZpZXdwb3J0XG4gIF9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIG9wdHMgPSB7fSkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQpIHtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCh7XG4gICAgICAgIGxhdGl0dWRlOiB0cmFuc2Zvcm0uY2VudGVyLmxhdCxcbiAgICAgICAgbG9uZ2l0dWRlOiBtb2QodHJhbnNmb3JtLmNlbnRlci5sbmcgKyAxODAsIDM2MCkgLSAxODAsXG4gICAgICAgIHpvb206IHRyYW5zZm9ybS56b29tLFxuICAgICAgICBwaXRjaDogdHJhbnNmb3JtLnBpdGNoLFxuICAgICAgICBiZWFyaW5nOiBtb2QodHJhbnNmb3JtLmJlYXJpbmcgKyAxODAsIDM2MCkgLSAxODAsXG5cbiAgICAgICAgaXNEcmFnZ2luZzogdGhpcy5wcm9wcy5pc0RyYWdnaW5nLFxuICAgICAgICBzdGFydERyYWdMbmdMYXQ6IHRoaXMucHJvcHMuc3RhcnREcmFnTG5nTGF0LFxuICAgICAgICBzdGFydEJlYXJpbmc6IHRoaXMucHJvcHMuc3RhcnRCZWFyaW5nLFxuICAgICAgICBzdGFydFBpdGNoOiB0aGlzLnByb3BzLnN0YXJ0UGl0Y2gsXG5cbiAgICAgICAgLi4ub3B0c1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kIF9vblRvdWNoU3RhcnQoe3Bvc30pIHtcbiAgICB0aGlzLl9vbk1vdXNlRG93bih7cG9zfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VEb3duKHtwb3N9KSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgbG5nTGF0ID0gdW5wcm9qZWN0RnJvbVRyYW5zZm9ybShtYXAudHJhbnNmb3JtLCBwb3MpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWUsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IFtsbmdMYXQubG5nLCBsbmdMYXQubGF0XSxcbiAgICAgIHN0YXJ0QmVhcmluZzogbWFwLnRyYW5zZm9ybS5iZWFyaW5nLFxuICAgICAgc3RhcnRQaXRjaDogbWFwLnRyYW5zZm9ybS5waXRjaFxuICAgIH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kIF9vblRvdWNoRHJhZyh7cG9zfSkge1xuICAgIHRoaXMuX29uTW91c2VEcmFnKHtwb3N9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZURyYWcoe3Bvc30pIHtcbiAgICBpZiAoIXRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHRha2UgdGhlIHN0YXJ0IGxuZ2xhdCBhbmQgcHV0IGl0IHdoZXJlIHRoZSBtb3VzZSBpcyBkb3duLlxuICAgIC8vYXNzZXJ0KHRoaXMucHJvcHMuc3RhcnREcmFnTG5nTGF0LCAnYHN0YXJ0RHJhZ0xuZ0xhdGAgcHJvcCBpcyByZXF1aXJlZCAnICtcbiAgICAgLy8gJ2ZvciBtb3VzZSBkcmFnIGJlaGF2aW9yIHRvIGNhbGN1bGF0ZSB3aGVyZSB0byBwb3NpdGlvbiB0aGUgbWFwLicpO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgdHJhbnNmb3JtLnNldExvY2F0aW9uQXRQb2ludCh0aGlzLnByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Ub3VjaFJvdGF0ZSh7cG9zLCBzdGFydFBvc30pIHtcbiAgICB0aGlzLl9vbk1vdXNlUm90YXRlKHtwb3MsIHN0YXJ0UG9zfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VSb3RhdGUoe3Bvcywgc3RhcnRQb3N9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uQ2hhbmdlVmlld3BvcnQgfHwgIXRoaXMucHJvcHMucGVyc3BlY3RpdmVFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge3N0YXJ0QmVhcmluZywgc3RhcnRQaXRjaH0gPSB0aGlzLnByb3BzO1xuICAgIC8vYXNzZXJ0KHR5cGVvZiBzdGFydEJlYXJpbmcgPT09ICdudW1iZXInLFxuICAgIC8vICAnYHN0YXJ0QmVhcmluZ2AgcHJvcCBpcyByZXF1aXJlZCBmb3IgbW91c2Ugcm90YXRlIGJlaGF2aW9yJyk7XG4gICAgLy9hc3NlcnQodHlwZW9mIHN0YXJ0UGl0Y2ggPT09ICdudW1iZXInLFxuICAgIC8vICAnYHN0YXJ0UGl0Y2hgIHByb3AgaXMgcmVxdWlyZWQgZm9yIG1vdXNlIHJvdGF0ZSBiZWhhdmlvcicpO1xuXG4gICAgY29uc3QgbWFwID0gdGhpcy5fZ2V0TWFwKCk7XG5cbiAgICBjb25zdCB7cGl0Y2gsIGJlYXJpbmd9ID0gdGhpcy5fY2FsY3VsYXRlTmV3UGl0Y2hBbmRCZWFyaW5nKHtcbiAgICAgIHBvcyxcbiAgICAgIHN0YXJ0UG9zLFxuICAgICAgc3RhcnRCZWFyaW5nLFxuICAgICAgc3RhcnRQaXRjaFxuICAgIH0pO1xuXG4gICAgY29uc3QgdHJhbnNmb3JtID0gY2xvbmVUcmFuc2Zvcm0obWFwLnRyYW5zZm9ybSk7XG4gICAgdHJhbnNmb3JtLmJlYXJpbmcgPSBiZWFyaW5nO1xuICAgIHRyYW5zZm9ybS5waXRjaCA9IHBpdGNoO1xuXG4gICAgdGhpcy5fY2FsbE9uQ2hhbmdlVmlld3BvcnQodHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VNb3ZlKG9wdCkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIGNvbnN0IHBvcyA9IG9wdC5wb3M7XG4gICAgaWYgKCF0aGlzLnByb3BzLm9uSG92ZXJGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmZWF0dXJlcyA9IG1hcC5xdWVyeVJlbmRlcmVkRmVhdHVyZXMoW3Bvcy54LCBwb3MueV0sXG4gICAgICB0aGlzLl9xdWVyeVBhcmFtcyk7XG4gICAgaWYgKCFmZWF0dXJlcy5sZW5ndGggJiYgdGhpcy5wcm9wcy5pZ25vcmVFbXB0eUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe2lzSG92ZXJpbmc6IGZlYXR1cmVzLmxlbmd0aCA+IDB9KTtcbiAgICB0aGlzLnByb3BzLm9uSG92ZXJGZWF0dXJlcyhmZWF0dXJlcyk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uVG91Y2hFbmQob3B0KSB7XG4gICAgdGhpcy5fb25Nb3VzZVVwKG9wdCk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uVG91Y2hUYXAob3B0KSB7XG4gICAgdGhpcy5fb25Nb3VzZUNsaWNrKG9wdCk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uTW91c2VVcChvcHQpIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydChtYXAudHJhbnNmb3JtLCB7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcbiAgICAgIHN0YXJ0RHJhZ0xuZ0xhdDogbnVsbCxcbiAgICAgIHN0YXJ0QmVhcmluZzogbnVsbCxcbiAgICAgIHN0YXJ0UGl0Y2g6IG51bGxcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25Nb3VzZUNsaWNrKG9wdCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vbkNsaWNrRmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCBwb3MgPSBvcHQucG9zO1xuXG4gICAgLy8gUmFkaXVzIGVuYWJsZXMgcG9pbnQgZmVhdHVyZXMsIGxpa2UgbWFya2VyIHN5bWJvbHMsIHRvIGJlIGNsaWNrZWQuXG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMucHJvcHMuY2xpY2tSYWRpdXM7XG4gICAgY29uc3QgYmJveCA9IFtbcG9zLnggLSBzaXplLCBwb3MueSAtIHNpemVdLCBbcG9zLnggKyBzaXplLCBwb3MueSArIHNpemVdXTtcbiAgICBjb25zdCBmZWF0dXJlcyA9IG1hcC5xdWVyeVJlbmRlcmVkRmVhdHVyZXMoYmJveCwgdGhpcy5fcXVlcnlQYXJhbXMpO1xuICAgIGlmICghZmVhdHVyZXMubGVuZ3RoICYmIHRoaXMucHJvcHMuaWdub3JlRW1wdHlGZWF0dXJlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm9uQ2xpY2tGZWF0dXJlcyhmZWF0dXJlcyk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uWm9vbSh7cG9zLCBzY2FsZX0pIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLl9nZXRNYXAoKTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBjbG9uZVRyYW5zZm9ybShtYXAudHJhbnNmb3JtKTtcbiAgICBjb25zdCBhcm91bmQgPSB1bnByb2plY3RGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgcG9zKTtcbiAgICB0cmFuc2Zvcm0uem9vbSA9IHRyYW5zZm9ybS5zY2FsZVpvb20obWFwLnRyYW5zZm9ybS5zY2FsZSAqIHNjYWxlKTtcbiAgICB0cmFuc2Zvcm0uc2V0TG9jYXRpb25BdFBvaW50KGFyb3VuZCwgcG9zKTtcbiAgICB0aGlzLl9jYWxsT25DaGFuZ2VWaWV3cG9ydCh0cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIEBhdXRvYmluZCBfb25ab29tRW5kKCkge1xuICAgIGNvbnN0IG1hcCA9IHRoaXMuX2dldE1hcCgpO1xuICAgIHRoaXMuX2NhbGxPbkNoYW5nZVZpZXdwb3J0KG1hcC50cmFuc2Zvcm0sIHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NsYXNzTmFtZSwgd2lkdGgsIGhlaWdodCwgc3R5bGV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBtYXBTdHlsZSA9IHtcbiAgICAgIC4uLnN0eWxlLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBjdXJzb3I6IHRoaXMuX2N1cnNvcigpXG4gICAgfTtcblxuICAgIGxldCBjb250ZW50ID0gW1xuICAgICAgPGRpdiBrZXk9XCJtYXBcIiByZWY9XCJtYXBib3hNYXBcIlxuICAgICAgICBzdHlsZT17IG1hcFN0eWxlIH0gY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0vPixcbiAgICAgIDxkaXYga2V5PVwib3ZlcmxheXNcIiBjbGFzc05hbWU9XCJvdmVybGF5c1wiXG4gICAgICAgIHN0eWxlPXsge3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiAwLCB0b3A6IDB9IH0+XG4gICAgICAgIHsgdGhpcy5wcm9wcy5jaGlsZHJlbiB9XG4gICAgICA8L2Rpdj5cbiAgICBdO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuaXNTdXBwb3J0ZWQgJiYgdGhpcy5wcm9wcy5vbkNoYW5nZVZpZXdwb3J0KSB7XG4gICAgICBjb250ZW50ID0gKFxuICAgICAgICA8TWFwSW50ZXJhY3Rpb25zXG4gICAgICAgICAgb25Nb3VzZURvd24gPXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICAgIG9uTW91c2VEcmFnID17IHRoaXMuX29uTW91c2VEcmFnIH1cbiAgICAgICAgICBvbk1vdXNlUm90YXRlID17IHRoaXMuX29uTW91c2VSb3RhdGUgfVxuICAgICAgICAgIG9uTW91c2VVcCA9eyB0aGlzLl9vbk1vdXNlVXAgfVxuICAgICAgICAgIG9uTW91c2VNb3ZlID17IHRoaXMuX29uTW91c2VNb3ZlIH1cbiAgICAgICAgICBvbk1vdXNlQ2xpY2sgPSB7IHRoaXMuX29uTW91c2VDbGljayB9XG4gICAgICAgICAgb25Ub3VjaFN0YXJ0ID17IHRoaXMuX29uVG91Y2hTdGFydCB9XG4gICAgICAgICAgb25Ub3VjaERyYWcgPXsgdGhpcy5fb25Ub3VjaERyYWcgfVxuICAgICAgICAgIG9uVG91Y2hSb3RhdGUgPXsgdGhpcy5fb25Ub3VjaFJvdGF0ZSB9XG4gICAgICAgICAgb25Ub3VjaEVuZCA9eyB0aGlzLl9vblRvdWNoRW5kIH1cbiAgICAgICAgICBvblRvdWNoVGFwID0geyB0aGlzLl9vblRvdWNoVGFwIH1cbiAgICAgICAgICBvblpvb20gPXsgdGhpcy5fb25ab29tIH1cbiAgICAgICAgICBvblpvb21FbmQgPXsgdGhpcy5fb25ab29tRW5kIH1cbiAgICAgICAgICB3aWR0aCA9eyB0aGlzLnByb3BzLndpZHRoIH1cbiAgICAgICAgICBoZWlnaHQgPXsgdGhpcy5wcm9wcy5oZWlnaHQgfT5cblxuICAgICAgICAgIHsgY29udGVudCB9XG5cbiAgICAgICAgPC9NYXBJbnRlcmFjdGlvbnM+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIC4uLnRoaXMucHJvcHMuc3R5bGUsXG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9IH0+XG5cbiAgICAgICAgeyBjb250ZW50IH1cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5NYXBHTC5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuTWFwR0wuZGVmYXVsdFByb3BzID0gREVGQVVMVF9QUk9QUztcbiJdfQ==