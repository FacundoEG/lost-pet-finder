const MapboxClient = require("mapbox");

/* console.log(process.env.MAPBOX_TOKEN); */

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZmFjdWRldiIsImEiOiJja3hxanVlYnQ0Y3NmMnZvazFhcXByZncwIn0.wnTM6d0Mz5b1fxFLg9IFyA";
const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

export { mapboxClient, MAPBOX_TOKEN };
