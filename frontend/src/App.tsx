import Books from "./components/Books";
import CreateBookForm from "./components/CreateBookForm";
import GetSchema from "./components/GetSchema";

// Import everything needed to use the `useQuery` hook
export default function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      <Books />
      <CreateBookForm />
      <GetSchema />
    </div>
  );
}