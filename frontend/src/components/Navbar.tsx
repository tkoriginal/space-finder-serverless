import React, { FC } from "react";
import { User } from "../model/Model";
import { Link } from 'react-router-dom'

interface NavBarProps {
    user: User | undefined
}
const NavBar: FC<NavBarProps> = ({ user }) => {
    return(
        <div className='navbar'>
            <Link to='/'> Home</Link>
            <Link to='/profile'> Profile</Link>
            <Link to='/spaces'> Spaces</Link>
            {user ? <Link to='/logout' style={{float:'right'}} >{user.userName}</Link> : <Link to='/login'  style={{float:'right'}}>Login</Link>}
        </div>
    )
}

export default NavBar;