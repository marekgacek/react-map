import React, { Component } from "react";
import { GoogleApiWrapper } from "google-maps-react";
import "./App.css";
import MapContainer from "./MapContainer";
class App extends Component {
	componentDidMount() {
    document.querySelector('.menu').addEventListener('click', this.showMenu)
    document.querySelector('.menu').addEventListener('keydown', (e) => {
      if(e.keyCode === 13) {
        document.querySelector('.menu').focus()
        this.showMenu()
      }
    })
  }
  showMenu = () => {
    document.querySelector('.sidebar').classList.toggle('text-input-hidden')
  }
  render() {
    return (
      <div>
        <a className="menu" tabIndex="0">
          <svg
            className="hamburger-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z" />
          </svg>
        </a>
		 <header>
        <h1 className="heading"> Udacity Google Map + React Project </h1>
		 </header>
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyBqeCAur3WuwLz9vaZyfuVA4WzfqSFjmiM"
})(App);
