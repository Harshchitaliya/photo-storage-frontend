import "./assets/styles/App.css";
import { AuthProvider } from "./context/auth/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Layout from './components/Layout/Layout.jsx';
import { ThemeProvider } from './utils/ThemeProvider.jsx';
import { Flowbite,theme } from 'flowbite-react';
import FlowbiteTheme from './components/FlowBiteTheme';

const App = () => {
  console.log(theme);
  return (
    <ThemeProvider>
      <Flowbite theme={{ theme: {...theme,...FlowbiteTheme} }}>     
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </Flowbite>
    </ThemeProvider>
  );
}

export default App;
