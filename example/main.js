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
      route: this.transform(ROUTES)
    };
  }

  @autobind _onWindowResize() {
    this.setState({width: window.innerWidth});
  }

  componentWillMount(){
    console.log("mounted");
    var request = require('request');
    request('http://localhost/api/reports/route?_dc=1477399518102&deviceId=1&type=%25&from=2016-10-14T12%3A14%3A00.000Z&to=2016-10-14T18%3A00%3A00.000Z',
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('success');
          this.setState({route : this.transform(JSON.parse(body))});
        }
      }.bind(this))
  }

  transform(data){
    const transformed = data.map((route) => {
      return [route.longitude, route.latitude];
    });
    const c1 = {};
    c1.coordinates = transformed;
    const packed = [];
    packed.push(c1);
    return packed;
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
