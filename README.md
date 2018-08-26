# FEND NEIGHBORHOOD MAP (REACT)

Project 8 (final) of the [Front-End Web Developer with Udacity](https://eu.udacity.com/course/front-end-web-developer-nanodegree--nd001).

## For Users

- The application shows you some interesting **places in Wroclaw (Poland)**
- You can access the **full list** of those locations on the left side of the screen
- You can **filter** this list by typing the name of your desired location in the input field. The list will adjust
- When clicking on a name on the list, the **marker** on the map to will show you the exact location by changing its color
- By clicking on the **name on the list** or in the **marker** you will have an **info window** which will be displayed above the marker


## For Developers

### Warning
The service worker is only implemented during production build mode!

To run in production build mode and get a service worker create production build with 
-npm run build
-serve -s build
-then navigate to http://localhost:5000/

### TL;DL

- **Clone** this repository
- In your **terminal** go to the **root** of this repository
- Run `npm install`
- Run `npm start`
- The application will open in your browser at the address: **localhost:3000**

### Dependencies

- You will need **npm**
- The project uses **React**
- The project was built with `create-react-app`
- The project uses [Google Maps API](https://developers.google.com/maps/documentation/)
- The project uses https://randomuser.me/ 3rd party API


### React hierarchy

The hierarchy of the React components is the following:

```
<App />
--- <MapContainer />
```

- The **Google Map** lives in the `<App />` component
