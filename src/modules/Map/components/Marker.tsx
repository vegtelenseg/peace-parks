import { memo } from "react";
import { Marker } from "react-map-gl";
import { Animal } from "../Map";
import cowIcon from "../../../assets/images/cow.png";

interface MarkerProps {
  animals: Animal[];
  onClick: (v: any) => any;
}

export const Markers = memo(({ animals, onClick }: MarkerProps) => {
  return (
    <>
      {animals.map((animal) => {
        const { animal_positions } = animal;
        if (!animal_positions.length) {
          return null;
        }
        // TODO: Get latest position
        const { lat, lng } = animal.animal_positions[0].position;
        return (
          <Marker latitude={lat} longitude={lng} key={animal.name}>
            <img
              src={cowIcon}
              width={40}
              height={40}
              onClick={() => onClick(animal)}
              alt='marker-icon'
            />
          </Marker>
        );
      })}
    </>
  );
});
