import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import { useCities } from "../context/CitiesContext";
import { useEffect } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useURLPosition } from "../hooks/useURLPosition";

function Map() {
  const { cities } = useCities();
  const navigate = useNavigate();
  const {isLoading : isLoadingPosition , position : geolocationPosition , getPosition} = useGeolocation();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  const [mapLat , mapLng] = useURLPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(function(){
    if(geolocationPosition) setMapPosition([geolocationPosition.lat,geolocationPosition.lng])
  },[geolocationPosition]);

  return (
    <div
      className={styles.mapContainer}
    >
    {!geolocationPosition && <Button type='position' onClick={getPosition}>{isLoadingPosition? "Loading..." : "Use Your Position"}</Button>}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>{city.notes}</Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    // console.log(e.latlng.lat , e.latlng.lng);
  });
}

export default Map;
