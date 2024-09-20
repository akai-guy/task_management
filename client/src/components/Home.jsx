import { Link } from "react-router-dom";
import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';

export default function Home() {
    //const [loggedInUser, setLoggedInUser] = useState(null);
    localStorage.loggedIn;
    localStorage.username;
    const [loggedInUser, setLoggedInUser] = useState();
    const handleLogout = () => {
      localStorage.removeItem('token'); // Remove token from localStorage
      setLoggedInUser(null); // Set logged-in user to null
      localStorage.loggedIn = null;
      localStorage.username = null;
    };
    if(localStorage.loggedIn == 'true'){
        return (
            <div className="App">
            {
                    (  
                    <div>
                        <p>Welcome {loggedInUser}</p>
                        <Link
                        className="bg-sky-100 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-sky-300 h-9 rounded-md px-3"
                        to={"/records"}
                        >
                            View Tasks
                        </Link>
                        <button onClick={handleLogout}>Logout</button>
                        {/*<RecordList />*/}
                    </div>
                    )
                }
                </div>
        )
    }
    return (
        <div className="App">
        {(
            <div>
                <Register />
                <Login setLoggedInUser={setLoggedInUser} />
            </div>
        )}
        </div>
    );
}