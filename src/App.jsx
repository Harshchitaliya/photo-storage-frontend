import "./assets/styles/App.css";
import { AuthProvider } from "./context/auth/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Layout from './components/Layout/Layout.jsx';
import { ThemeProvider } from './utils/ThemeProvider.jsx';

const App = () => {
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
