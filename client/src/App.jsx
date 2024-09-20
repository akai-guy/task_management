import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {

  
  return (
    <>

      <div className="w-full h-screen p-6 bg-slate-100">
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};
export default App