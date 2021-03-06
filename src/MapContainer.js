import React, { Component } from "react";
import ReactDOM from "react-dom";
export default class MapContainer extends Component {
  state = {
    locations: [
      {
        name: "Museum of Contemporary Art",
        location: { lat: 51.108015, lng: 17.075859 }
      },
      { name: "Hydropolis", location: { lat: 51.104254, lng: 17.05661 } },
      {
        name: "Wroclaw Town Hall",
        location: { lat: 51.109696, lng: 17.032106 }
      },
      { name: "Centennial Hall", location: { lat: 51.106766, lng: 17.077152 } },
      {
        name: "Cathedral Island",
        location: { lat: 51.114616, lng: 17.046704 }
      },
      {
        name: "Panorama of the Battle of Racławice",
        location: { lat: 51.110142, lng: 17.044386 }
      },
      {
        name: "University Museum - Aula Leopoldina",
        location: { lat: 51.11402, lng: 17.03451 }
      },
      { name: "Tumski Bridge", location: { lat: 51.114709, lng: 17.04233 } },
      { name: "ZOO", location: { lat: 51.104469, lng: 17.0752 } },
      {
        name: "Main railway station",
        location: { lat: 51.098784, lng: 17.03651 }
      }
    ],
    query: "",
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow(),
    changeIcon: null,
    error: null,
    mapError: null,
    users: []
  };

  componentDidMount() {
    const url = "https://randomuser.me/api/?results=10";
    fetch(url)
      .then(data => {
        if (data.ok) {
          return data.json();
        } else {
          throw new Error(data.statusText);
        }
      })
      .then(data => {
        this.setState({ users: data.results });
        this.loadMap();
        this.onclickPlace();
      })
      .catch(err => {
        this.setState({ error: err.toString() });
      });

    // Create a "highlighted location" marker color for when the user
    // clicks on the marker.
    this.setState({ changeIcon: this.makeMarkerIcon("2486ff") });
  }
  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);
      const mapConfig = Object.assign(
        {},
        {
          center: { lat: 51.107883, lng: 17.038538 },
          zoom: 13,
          mapTypeId: "roadmap"
        }
      );
      this.map = new maps.Map(node, mapConfig);
      this.addMarkers();
    } else {
      this.setState({ mapError: "error while loading application" });
    }
  }

  onclickPlace = () => {
    const { infowindow } = this.state;
    const displayInfowindow = e => {
      const { markers } = this.state;
      const markerIndex = markers.findIndex(
        m => m.title.toLowerCase() === e.target.innerText.toLowerCase()
      );
      this.populateInfoWindow(
        markers[markerIndex],
        infowindow,
        this.state.users[markerIndex]
      );
    };
    document
      .querySelector(".locations-list")
      .addEventListener("click", function(e) {
        if (e.target && e.target.nodeName === "LI") {
          displayInfowindow(e);
        }
      });
    document
      .querySelector(".locations-list")
      .addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
          displayInfowindow(e);
        }
      });
  };

  whenValueChange = e => {
    this.setState({ query: e.target.value });
  };

  addMarkers = () => {
    const { users } = this.state;
    const { google } = this.props;
    let { infowindow } = this.state;
    const bounds = new google.maps.LatLngBounds();
    this.state.locations.forEach((location, ind) => {
      const marker = new google.maps.Marker({
        position: { lat: location.location.lat, lng: location.location.lng },
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: location.name
      });
      marker.addListener("click", () => {
        this.populateInfoWindow(marker, infowindow, users[ind]);
      });
      this.setState(state => ({
        markers: [...state.markers, marker]
      }));
      bounds.extend(marker.position);
    });
    // Extend the boundaries of the map for each marker
    this.map.fitBounds(bounds);
  };
  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  populateInfoWindow = (marker, infowindow, user) => {
    const defaultIcon = marker.getIcon();
    const { changeIcon, markers } = this.state;
    const { google } = this.props;

    const service = new google.maps.places.PlacesService(this.map);
    const geocoder = new google.maps.Geocoder();

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      // reset the color of previous marker
      if (infowindow.marker) {
        const ind = markers.findIndex(m => m.title === infowindow.marker.title);
        markers[ind].setIcon(defaultIcon);
      }
      // change marker icon color of clicked marker
      marker.setIcon(changeIcon);
      infowindow.marker = marker;
      geocoder.geocode({ location: marker.position }, function(
        results,
        status
      ) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            service.getDetails(
              {
                placeId: results[1].place_id
              },
              (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  infowindow.setContent(`<div tabindex="0"> <h4>Location: <strong>${
                    marker.title
                  }</strong></h4>
                             <div>Latitude: ${marker.getPosition().lat()}</div>
                             <div>Longitude: ${marker
                               .getPosition()
                               .lng()}</div>
                             <h4> Additional details: </h4>
                             <div>${place.name}, ${
                    place.formatted_address
                  }</div>
                <img src="${user.picture.medium}" alt="User recommend ${marker.title}"/>
							 <div class=capitalize ><strong>${user.name.first} ${
                    user.name.last
                  }</strong> recommend it</div></div>`);
                  infowindow.open(this.map, marker);
                }
              }
            );
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      });
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener("closeclick", function() {
        infowindow.setMarker = null;
      });
    }
  };
  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 20 px wide by 30 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  makeMarkerIcon = markerColor => {
    const { google } = this.props;
    var markerImage = new google.maps.MarkerImage(
      "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|" +
        markerColor +
        "|40|_|%E2%80%A2",
      new google.maps.Size(20, 30),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34)
    );
    return markerImage;
  };
  render() {
    const { locations, query, markers, infowindow } = this.state;
    if (query) {
      locations.forEach((l, i) => {
        if (l.name.toLowerCase().includes(query.toLowerCase())) {
          markers[i].setVisible(true);
        } else {
          if (infowindow.marker === markers[i]) {
            // close the info window if marker removed
            infowindow.close();
          }
          markers[i].setVisible(false);
        }
      });
    } else {
      locations.forEach((l, i) => {
        if (markers.length && markers[i]) {
          markers[i].setVisible(true);
        }
      });
    }
    return (
      <div>
        {this.state.error ? (
          <div className="error">
            Unexpected error - please try again
            <div className="error-description">{this.state.error}</div>
          </div>
        ) : (
          <div className="container">
            <div id="search-field" className="sidebar text-input text-input-hidden">
              <input
                aria-label="search-field"
                role="search"
                type="text"
                placeholder="Enter your favourite place!"
                value={this.state.value}
                onChange={this.whenValueChange}
              />
              <ul className="locations-list">
                {markers.filter(m => m.getVisible()).map((m, i) => (
                  <li role="link" tabIndex="0" key={i}>
                    {m.title}
                  </li>
                ))}
              </ul>
            </div>
            <div role="application" className="map" ref="map">
              loading map...
            </div>
          </div>
        )}
      </div>
    );
  }
}
