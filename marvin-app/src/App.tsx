import { createTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlaylistDetail from './pages/PlaylistDetail';

const theme = createTheme({
  "palette":{
    "type": "light",
     "common":{
        "black":"#000",
        "white":"#fff"
     },
     "background":{
        "paper":"rgba(255, 255, 255, 1)",
        "default":"rgba(255, 255, 255, 1)",
     },
     "primary":{
        "light":"rgba(129, 156, 169, 1)",
        "main":"rgba(84, 110, 122, 1)",
        "dark":"#2ac751",
        "contrastText":"#fff"
     },
     "secondary":{
        "light":"rgba(72, 72, 72, 1)",
        "main":"rgba(33, 33, 33, 1)",
        "dark":"rgba(0, 0, 0, 1)",
        "contrastText":"#fff"
     },
     "error":{
        "light":"#e57373",
        "main":"#f44336",
        "dark":"#d32f2f",
        "contrastText":"#fff"
     },
     "text":{
        "primary":"rgba(0, 0, 0, 0.87)",
        "secondary":"rgba(0, 0, 0, 0.54)",
        "disabled":"rgba(0, 0, 0, 0.38)",
        "hint":"rgba(0, 0, 0, 0.38)"
     }
  }
})


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline >
      <Router>
        <Switch>
          <Route path="/playlist/:playlistId" children={<PlaylistDetail />} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
      </CssBaseline> 
    </ThemeProvider>
  );
}

export default App;
