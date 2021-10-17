import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlaylistDetail from './pages/PlaylistDetail';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/playlist/:playlistId" children={<PlaylistDetail />} />
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
