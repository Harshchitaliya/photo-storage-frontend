import "./assets/styles/App.css";
import { AuthProvider } from "./context/auth/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Layout from './components/layout/Layout';
import { ThemeProvider } from './utils/ThemeProvider.jsx';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
