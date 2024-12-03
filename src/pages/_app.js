import "<cgch-ch>/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "@fontsource/overpass"; // Defaults to weight 400
import "@fontsource/overpass/400.css"; // Specify weight
import "@fontsource/overpass/400-italic.css"; // Specify weight and style
// import '<cgch-ch>/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <Component {...pageProps} />
    </React.StrictMode>
  );
}
