import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img alt="Beautiful Face" className="h-10 w-40 inline" src="\src\components\beautifulface.png"></img>
        </NavLink>

        {/*<NavLink className="bg-sky-100 inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-sky-300 h-9 rounded-md px-3" to="/create">
          Create Task
        </NavLink>*/}
        </nav>
    </div>
  );
}