import { useQuery, gql } from '@apollo/client';
const GET_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author
      content
    }      
  }
`;
interface Book {
    id: string;
    title: string;
    author: string;
    content: string;
}    
const Books = () => {
    const { loading, error, data } = useQuery(GET_BOOKS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.allBooks.map((book: Book) => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <h3>{book.author}</h3>
          <p>{book.content}</p>
        </div>
      ))}
    </div>
  )
}

export default Books
