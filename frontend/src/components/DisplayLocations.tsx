import { useQuery, gql } from '@apollo/client';
const GET_LOCATIONS = gql`
query GetLocations {
locations {
    id
    name
    description
    photo
}
}
`;
interface Location {
    id: string;
    name: string;
    description: string;
    photo: string;
}
const DisplayLocations = () => {

  const { loading, error, data } = useQuery(GET_LOCATIONS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      {data.locations.map((location: Location) => (
        <div key={location.id} className="location-card">
          <h2>{location.name}</h2>
          <img src={location.photo} alt={location.name} />
          <p>{location.description}</p>
        </div>
        ))}
    </div>
  )
}

export default DisplayLocations
