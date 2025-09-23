import L from "leaflet";

/**
 * This file configures Leaflet's default icon paths.
 * It's a common workaround for issues with bundlers like Webpack that
 * mis-handle the default icon URLs.
 *
 * By importing this file once in a client-side component (like MapView),
 * the correct icon paths will be set for the entire application.
 *
 * Make sure to have the leaflet icon images in your `public/leaflet/` directory.
 * You can get them from the leaflet package in `node_modules/leaflet/dist/images/`.
 *
 * @see https://github.com/PaulLeCam/react-leaflet/issues/453
 */

// This is the magic that fixes the icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});
