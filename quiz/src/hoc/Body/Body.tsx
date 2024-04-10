import { ReactNode } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import TopNavButton from '../../views/TopNavButtons/TopNavButtons';
import { logoutUser } from '../../services/auth.service';


interface BodyProps {
  children: ReactNode
}

interface LinksUserOptionsType {
  name: string,
  path: string
}

const LinksUserOptions: LinksUserOptionsType[] = [
  { name: 'Register', path: '/createAccount' },
  { name: 'Login', path: '/login' }
];

const Body = ({ children }: BodyProps): JSX.Element => {
  const { userData, setContext } = useContext(AppContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logoutUser()
      .then(() => {
        setContext(prevState => ({
          ...prevState,
          user: null,
          userData: null,
        }));
      })
      .catch((e: Error) => {
        console.error(e.message);
      })
      .finally(() => navigate('/'));
  }

  return (
    <div>
      <div className="navbar bg-base-100">
       <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
       </div>
       <div className="flex-none gap-2">
        {userData ?
        (<div>
        <div className="form-control">
         <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
        </div>
        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <a className="justify-between">
            Profile
            <span className="badge">New</span>
            </a>
          </li>
          <li><button onClick={onLogout}>Logout</button></li>
        </ul>
      </div>
      </div>)
      : <TopNavButton links={LinksUserOptions} /> }
      </div>
      </div>
    {children}
    </div>  
  )
}

export default Body;