import { useRoutes } from "react-router-dom";
import EmailDashboard from "./EmailDashboard"; 

const App = () => {
  const routes = useRoutes([
    { path: "/", element: <EmailDashboard /> },
  ]);

  return routes;
};

export default App;
