import "./assets/styles/App.css";
import { AuthProvider } from "./context/auth/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
