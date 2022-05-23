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
import CreateSpace from './spaces/CreateSpace';

const App = () => {
  const [user, setUser] = useState<User>()

  const authService: AuthService = new AuthService()
  const dataService: DataService = new DataService()

  const fetchUser = async (user: User) => {
    setUser(user)
    await authService.getAWSTemporaryCreds(user.cognitoUser)


  }

  return (
    <div className='wrapper'>
      <Router history={history}>
        <div>
          <Navbar user={user}/>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/login'>
              <Login authService={authService} setUser={fetchUser}/>
            </Route>
            <Route exact path='/profile'>
              <Profile authService={authService} user={user}/>
            </Route>
            <Route exact path='/spaces'>
              <Spaces dataService={dataService}/>
            </Route>
            <Route exact path='/create-space'>
              <CreateSpace dataService={dataService}/>
            </Route>
          </Switch>
        </div>

      </Router>
    </div>
  )
}

export default App