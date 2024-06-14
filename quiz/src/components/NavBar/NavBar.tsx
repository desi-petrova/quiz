import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import TopNavButton from '../../views/TopNavButtons/TopNavButtons';
import { logoutUser } from '../../services/auth.service';


interface LinksUserOptionsType {
  name: string,
  path: string
}

const LinksUserOptions: LinksUserOptionsType[] = [
  { name: 'Register', path: '/createAccount' },
  { name: 'Login', path: '/login' }
];

const NavBar = ()  =>  {

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
       <>
         <div className="navbar bg-[#fbe300]">
       <div className="flex-1">
        <a className="text-xl">Quizopia</a>
       </div>
       <div className="flex-none gap-2">
        {userData ?
        (<div className='flex'>
        <div className="form-control mr-4">
         <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="" className='border' />
        </div>
        </div>
        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <button onClick={() => navigate('/userDetails')}>
            Profile
            </button>
          </li>
          <li><button onClick={onLogout}>Logout</button></li>
        </ul>
      </div>
      </div>)
      : <TopNavButton links={LinksUserOptions} /> }
      </div>
      </div>
       </>
    )
}

export default NavBar;