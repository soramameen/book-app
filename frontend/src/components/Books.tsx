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
    const { loading, error, data, refetch } = useQuery(GET_BOOKS,{
        fetchPolicy: 'cache-and-network',
        pollInterval: 5000, // 5秒ごとにポーリング
    });
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
      <button onClick={() => refetch()}>
        更新
      </button>
    </div>
  )
}

export default Books
