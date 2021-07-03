import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {AuthContextProvider} from './contexts/AuthContext';


import {NewRoom} from './pages/NewRoom';
import { Home } from "./pages/Home";
import { Rooms } from './pages/Rooms';



function App() {
  

  return (
    <BrowserRouter>
    <AuthContextProvider>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/rooms/new" component={NewRoom}/>
        <Route path="/rooms/:id"  component={Rooms}/>
      </Switch>
    </AuthContextProvider>
      
    </BrowserRouter>
   
  );
}

export default App;
