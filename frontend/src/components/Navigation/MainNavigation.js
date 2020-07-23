import React from 'react';
import { NavLink } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';


const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>MBJ ENT EMR V2.0.1</h1>

          </div>
          <nav className="main-navigation__items">

            <ul>

              {!context.token && (
                <React.Fragment>
                <li>
                  <NavLink to="/landing">Landing</NavLink>
                </li>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/signup">Signup</NavLink>
                </li>
                </React.Fragment>
              )}
              {context.token && (
                <React.Fragment>

                  <li>
                    <NavLink to="/home">Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/home2">Home2</NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile">My Profile</NavLink>
                  </li>
                  <li>
                    <NavLink to="/staff">Staff</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
              {
                // !context.token && (
                //   <React.Fragment>
                //     <li>
                //       <NavLink to="/landing">.</NavLink>
                //     </li>
                //   </React.Fragment>
                // )
              }
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
