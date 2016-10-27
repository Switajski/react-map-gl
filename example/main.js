// Copyright (c) 2015 Uber Technologies, Inc.

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

import document from 'global/document';
import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import autobind from 'autobind-decorator';
import window from 'global/window';

import ROUTES from './data/traccar.json';
import request from 'request';


import RouteExample from './examples/route.react';

function getAccessToken() {
  const match = window.location.search.match(/access_token=([^&\/]*)/);
  let accessToken = match && match[1];
  if (!accessToken) {
    /* eslint-disable no-process-env */
    /* global process */
    accessToken = process.env.MapboxAccessToken;
    /* eslint-enable no-process-env */
  }
  if (accessToken) {
    window.localStorage.accessToken = accessToken;
  } else {
    accessToken = window.localStorage.accessToken;
  }
  return accessToken;
}

export default class App extends Component {

  constructor(props) {
    super(props);
    window.addEventListener('resize', this._onWindowResize);
    this.state = {
      width: window.innerWidth,
      route: this.transform(ROUTES),
      routeCounter: 0
    };
  }

  @autobind _onWindowResize() {
    this.setState({width: window.innerWidth});
  }

  componentDidMount(){
    const me = this;
    console.log("mounted");

    // TODO: temporary code to test second color with route requested
    request('http://localhost/api/reports/route?_dc=1477399518102&deviceId=1&type=%25&from=2016-10-14T12%3A14%3A00.000Z&to=2016-10-14T18%3A00%3A00.000Z',
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // TODO: this should not replace the ROUTE, but add a second one
          var futureState = this.state.route;
          futureState.push(this.createCoordinates(JSON.parse(body)));
          this.setState({route : futureState});
          this.setState({routeCounter: this.state.routeCounter + 1});
        }
      }.bind(this));
    // TODO: end - decomment next line

    this.connectToWebsocket();
  }

  connectToWebsocket(first = true){
    const me = this;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    //const client = new WebSocket(protocol + '//' + window.location.host + pathname + 'api/socket');
    const client = new WebSocket(protocol + '//localhost' + pathname + 'api/socket');

    client.onerror = function() {
      console.log('Connection Error');
    };

    client.onopen = function() {
      console.log('WebSocket Client Connected');
    };

    client.onclose = function() {
      console.log('Client Closed');
      me.connectToWebsocket(false);
    };

    client.onmessage = function(e) {
      if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
      }
      const data = JSON.parse(e.data);

      if (data.positions && !data.events) {
        for (var i = 0; i < data.positions.length; i++) {
          var p = data.positions[i];
          me.addPointTo2ndRoute([p.longitude, p.latitude]);
        }
      }
    };
  }

  transform(data){
    return [this.createCoordinates(data)];
  }

  createCoordinates(data){
    const transformed = data.map((route) => {
      return [route.longitude, route.latitude];
    });
    const c1 = {};
    c1.coordinates = transformed;
    return c1;
  }

  /**
   *
   * @param point array: [longitude, latitude]
     */
  addPointTo2ndRoute(point){
    const futureRoute = this.state.route;
    if (this.state.liveRouteIndex == undefined){
      this.setState({liveRouteIndex: this.state.route.length});
      const c2 = {};
      c2.coordinates = [];
      c2.coordinates.push(point);
      futureRoute.push(c2);
    }
    var liveRoute = futureRoute[this.state.liveRouteIndex];
    liveRoute.coordinates.push(point);
    console.log(futureRoute);
    this.setState({route: futureRoute});
  }

  render() {
    const common = {
      width: 800,
      height: 800,
      style: {float: 'left'},
      mapboxApiAccessToken: getAccessToken()
    };
    return (
      <div>
        <RouteExample { ...common } route={this.state.route} />
      </div>
    );
  }
}

const reactContainer = document.createElement('div');
document.body.appendChild(reactContainer);
ReactDOM.render(<App/>, reactContainer);
