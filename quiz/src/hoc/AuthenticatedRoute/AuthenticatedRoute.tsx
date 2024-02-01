import { useContext, ReactNode } from 'react';
import AppContext, {UserState} from '../../context/AppContext';
import { Navigate, useLocation  } from 'react-router-dom';

interface RouteProps{
  children: ReactNode
}

const AuthenticatedRoute = ({ children } : RouteProps) => {
  const { user, userData } = useContext<UserState>(AppContext);
  const location = useLocation();

  if (user === null || userData === null) {
    return <Navigate to='/login' state={location.pathname} />;
  } 

  return children;
}

export default AuthenticatedRoute;