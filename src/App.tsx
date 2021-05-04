import React from 'react';
import Dashboard from './components/Dashboard';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Dashboard}/>       
    </Switch>  
    </BrowserRouter>
  );
}

export default App;
