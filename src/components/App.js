import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import apiKey from '../config.js';
import SearchForm from './SearchForm';
import Nav from './Nav';
import Gallery from './Gallery';

const axios = require('axios');
const image_limit = 24;


class App extends Component {

  constructor () {
    super();
    this.state = {
      loading: true,
      gun_photos: [],
      airplane_photos: [],
      guitar_photos: [],
      search_photos: []
    };
  }

  requestImages = (tag) => {
    /**
     * Creates a dynamic url and returns an axios request
     */
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${tag}&per_page=${image_limit}&page=1&format=json&nojsoncallback=1&content_type=1&sort=relevance`;
    return axios.get(url);
  }

  componentDidMount = () => {
    const self = this; // helps maintain lexical scope

    axios.all([
      this.requestImages('guns'),
      this.requestImages('airplanes'),
      this.requestImages('electric%20%guitars')
    ])
      .then(axios.spread((guns, planes, guitars) => {
        // When all requests are complete, set states
        self.setState({
          gun_photos: guns.data.photos.photo,
          airplane_photos: planes.data.photos.photo,
          guitar_photos: guitars.data.photos.photo,
          loading: false
        });
        
        //combinedPhotosArray = self.combinePhotos();
      }))
      .catch(error => {
        console.error('Error fetching and parsing data', error);
      });
  }

  combinePhotos = () => {
    /**
     * Combines default photos from application's state to show an even amount of photos for each category
     */
    return [
      ...this.state.gun_photos.slice(0, 8),
      ...this.state.airplane_photos.slice(0, 8),
      ...this.state.guitar_photos.slice(0, 8)
    ];
  }

  handleSearch = (query) => {
    const self = this; // helps maintain lexical scope
    console.log(query);
    this.requestImages(query)
      .then(response => {
        self.setState({
          search_photos: response.data.photos.photo,
          loading: false
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <SearchForm search={this.handleSearch} />
          <Nav />

            <Switch>
              <Route
                exact path="/"
                render={() => <Gallery
                isLoading={this.state.loading}
                data={this.combinePhotos()} />}
              />

              <Route
                path="/guns"
                render={() => <Gallery
                isLoading={this.state.loading}
                data={this.state.gun_photos} />}
              />

              <Route
                path="/airplanes"
                render={() => <Gallery
                isLoading={this.state.loading}
                data={this.state.airplane_photos} />}
              />

              <Route
                path="/guitars"
                render={() => <Gallery
                isLoading={this.state.loading}
                data={this.state.guitar_photos} />}
              />

              <Route
                path="/q/:query"
                render={() => <Gallery
                isLoading={this.state.loading}
                data={this.state.search_photos} />}
              />

              <Route component={Gallery} />
            </Switch>
          </div>
      </BrowserRouter>
    );
  }
}

export default App;