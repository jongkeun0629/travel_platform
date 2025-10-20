import React, { useEffect, useState } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

const KakaoMap = ({ onAddressClick }) => {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ["services"],
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [markerPosition, setMarkerPosition] = useState({
    lat: 37.5665,
    lng: 126.978,
  });

  const handleMapClick = (_, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    const position = {
      lat: latlng.getLat(),
      lng: latlng.getLng(),
    };

    setMarkerPosition(position);

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(position.lng, position.lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name;
        onAddressClick(address);
      }
    });
  };

  useEffect(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(newPosition);
        setMarkerPosition(newPosition);
      });
    }
  }, [map]);

  if (loading) return <div className="loading">지도를 불러오는 중...</div>;
  if (error) return <div className="error">지도를 불러올 수 없습니다.</div>;

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <div id="kakao-map" className="w-full h-80">
        <Map
          center={center}
          level={3}
          style={{ width: "100%", height: "100%" }}
          onClick={handleMapClick}
          onCreate={setMap}
        >
          <MapMarker position={markerPosition} />
        </Map>
      </div>
    </div>
  );
};

export default KakaoMap;
