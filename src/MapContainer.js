import React, {Component} from 'react';
import ReactDOM from 'react-dom'
 export default class MapContainer extends Component {

   state = {
    locations: [
      { name: "Museum of Contemporary Art", location: {lat: 51.108015, lng: 17.075859} },
      { name: "Hydropolis", location: {lat: 51.104254, lng: 17.056610} },
      { name: "Wroclaw Town Hall", location: {lat: 51.109696, lng: 17.032106} },
      { name: "Centennial Hall", location: {lat: 51.106766, lng: 17.077152} },
      { name: "Cathedral Island", location: {lat: 51.114616, lng: 17.046704} },
      { name: "Panorama of the Battle of Racławice", location: {lat: 51.110142, lng: 17.044386} },
      { name: "University Museum - Aula Leopoldina", location: {lat: 51.114020, lng:  17.034510} },
      { name: "Tumski Bridge", location: {lat: 51.114709, lng: 17.042330} },
      { name: "ZOO", location: {lat: 51.104469, lng:  17.075200} }
    ],
    query: '',
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow()
  }

   componentDidMount() {
    this.loadMap()
   }
   loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props
      const maps = google.maps
       const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)
       const mapConfig = Object.assign({}, {
        center: {lat: 51.107883, lng: 17.038538},
        zoom: 13,
        mapTypeId: 'roadmap'
      })
       this.map = new maps.Map(node, mapConfig)
       this.addMarkers()
    }
   }
   addMarkers = () => {
    const {google} = this.props
    let {infowindow} = this.state
    const bounds = new google.maps.LatLngBounds();
     this.state.locations.forEach( (location, ind) => {
      const marker = new google.maps.Marker({
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: location.name
      });
       marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow)
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    // Extend the boundaries of the map for each marker
    this.map.fitBounds(bounds)
  }
  // This function populates the infowindow when the marker is clicked. We'll only allow
       // one infowindow which will open at the marker that is clicked, and populate based
       // on that markers position.
       populateInfoWindow(marker, infowindow) {
         // Check to make sure the infowindow is not already opened on this marker.
         if (infowindow.marker != marker) {
           infowindow.marker = marker;
           infowindow.setContent('<div>' + marker.title + '</div>');
           infowindow.open(this.map, marker);
           // Make sure the marker property is cleared if the infowindow is closed.
           infowindow.addListener('closeclick',function(){
             infowindow.setMarker = null;
           });
         }
       }
   render() {
    return (
      <div>
        <div className="container">
          <div className="sidebar text-input text-input-hidden">
          </div>
          <div role="application" className="map" ref="map">
            loading map...
          </div>
        </div>
      </div>
    )
  }
}
