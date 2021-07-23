import { gql, useSubscription } from "@apollo/react-hooks";
import { Map } from "./modules/Map/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

const App = () => {
  const { data, error, loading } = useSubscription(
    gql`
      subscription getAnimalByName {
        # animal(where: { name: { _eq: $input } }) {
        animal {
          name
          animal_positions {
            position {
              lng
              lat
            }
          }
        }
      }
    `
    // {
    //   variables: {
    //     input: "Tiger",
    //   },
    // }
  );
  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error... {error.message}</div>;
  }
  return (
    <div className='App'>
      <Map animals={data.animal} />
    </div>
  );
};

export default App;
