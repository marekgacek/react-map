import React, {Component} from 'react';
import ReactDOM from 'react-dom'
 export default class MapContainer extends Component {
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
