import { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { InteractiveMapProps } from "react-map-gl/src/components/interactive-map";
import cowIcon from "../../assets/images/cow.png";

interface Position {
  lat: number;
  lng: number;
}

interface AnimalPosition {
  position: Position;
  __typename: string;
}

interface Animal {
  name: string;
  animal_positions: AnimalPosition[];
  __typename: string;
}

interface MapProps {
  animals: Animal[];
}

export const Map = ({ animals }: MapProps) => {
  const [viewport, setViewport] = useState<InteractiveMapProps>({
    width: "100vw",
    height: "100vh",
    latitude: 26.2041,
    longitude: 28.0473,
    mapStyle: "mapbox://styles/mapbox/dark-v9",
    zoom: 4,
  });

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN}
      onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
    >
      {animals.map((animal) => {
        console.log({ animal });
        const { animal_positions } = animal;
        if (!animal_positions.length) {
          return null;
        }
        return (
          <Marker
            draggable
            latitude={animal.animal_positions[0].position.lat}
            longitude={animal.animal_positions[0].position.lng}
            // offsetLeft={-20}
            // offsetTop={-10}
          >
            <img src={cowIcon} width={40} height={40} alt='pin-icon' />
          </Marker>
        );
      })}
    </ReactMapGL>
  );
};
