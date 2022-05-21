import { useState } from 'react';
import { User  } from '../model/Model'
import { AuthService } from '../services/AuthService'
import Login from './Login';
import { Router, Route, Switch } from 'react-router-dom'
import history from '../utils/history';
import Navbar from './Navbar';
import  Home from './Home';
import  Profile from './Profile';
import Spaces from './spaces/Spaces'
import { DataService } from '../services/DataService';

const App = () => {
  const [user, setUser] = useState<User>()

  const authService: AuthService = new AuthService()
  const dataService: DataService = new DataService()

  return (
    <div className='wrapper'>
      <Router history={history}>
        <div>
          <Navbar user={user}/>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/login'>
              <Login authService={authService} setUser={setUser}/>
            </Route>
            <Route exact path='/profile'>
              <Profile authService={authService} user={user}/>
            </Route>
            <Route exact path='/spaces'>
              <Spaces dataService={dataService}/>
            </Route>
          </Switch>
        </div>

      </Router>
    </div>
  )
}

export default App