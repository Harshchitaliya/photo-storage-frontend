import "./App.css";
// import Sidebar from "./components/Navbar/Sidebar";
import { AuthProvider } from "./context/logincheck";
import Login from "./components/login";


function App() {
  return (
    <>
      <AuthProvider>
        
      </AuthProvider>
    </>
  );
}

export default App;
