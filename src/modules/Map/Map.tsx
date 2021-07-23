import { memo, useState } from "react";
import { gql, useSubscription } from "@apollo/react-hooks";
import ReactMapGL, { Popup } from "react-map-gl";
import { InteractiveMapProps } from "react-map-gl/src/components/interactive-map";
import { Markers } from "./components/Marker";
import "./map.css";
import { formatDateTime } from "../../utils";
export interface Position {
  lat: number;
  lng: number;
}

interface AnimalPosition {
  position: Position;
  created_at: string;
  __typename: string;
}

export interface Animal {
  name: string;
  animal_positions: AnimalPosition[];
  __typename: string;
}

export const Map = memo(() => {
  const [popupInfo, setPopupInfo] = useState<Animal>();
  const [viewport, setViewport] = useState<InteractiveMapProps>({
    width: "100vw",
    height: "100vh",
    latitude: 26.2041,
    longitude: 28.0473,
    mapStyle: "mapbox://styles/mapbox/dark-v9",
    zoom: 4,
  });
  const { data, error, loading } = useSubscription(
    gql`
      subscription getAnimalByName {
        animal {
          name
          animal_positions(order_by: { created_at: desc }, limit: 1) {
            created_at
            position {
              lng
              lat
            }
          }
        }
      }
    `
  );

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error... {error.message}</div>;
  }

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN}
      onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
    >
      <>
        <Markers animals={data.animal} onClick={setPopupInfo} />
        {popupInfo && (
          <Popup
            latitude={popupInfo.animal_positions[0].position.lat}
            dynamicPosition={false}
            longitude={popupInfo.animal_positions[0].position.lng}
            closeButton={true}
            closeOnClick={false}
            onClose={setPopupInfo}
            anchor='top'
          >
            <div className='popup'>
              <div className='popupItem'>
                <h5>Name:</h5>
                <span>{popupInfo.name}</span>
              </div>
              <hr />
              <div className='popupItem'>
                <h5>Coords:</h5>
                <span>Lat: {popupInfo.animal_positions[0].position.lat}</span>
                <span>Long: {popupInfo.animal_positions[0].position.lng}</span>
              </div>
              <hr />
              <div className='popupItem'>
                <h5>Last seen:</h5>
                <span>
                  {formatDateTime(popupInfo.animal_positions[0].created_at)}
                </span>
              </div>
            </div>
          </Popup>
        )}
      </>
    </ReactMapGL>
  );
});
