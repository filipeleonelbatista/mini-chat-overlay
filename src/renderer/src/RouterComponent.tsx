import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
import Config from './Config';

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/configuracoes" element={<Config />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;