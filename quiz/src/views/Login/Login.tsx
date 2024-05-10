import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { loginUser } from '../../services/auth.service';
import {MSG_FIELD_REQUIRED, MSG_WRONG_EMAIL_AND_PASSWORD} from '../../common/constant.ts';

interface LoginForm{
  email: string,
  password: string,
}

interface ErrorLoginForm{
  error: boolean,
  fieldErr: boolean,
  email: boolean,
  password: boolean,
}

const Login = () => {
    const { setContext } = useContext(AppContext);
    const [loginForm, setLoginForm] = useState<LoginForm>({
      email: '',
      password: '',
    })
    const [errorLoginForm, setErrorLoginForm] = useState<ErrorLoginForm>({
      error: false,
      fieldErr: false,
      email: false,
      password: false,
    })
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const navigate = useNavigate();


    const updateLoginForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginForm({
        ...loginForm,
        [field]: e.target.value
      })
    }

    const onKeyEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Enter') return;
      onLogin();
    }

    const onLogin = () => {
      if (!loginForm.email) return setErrorLoginForm({ ...errorLoginForm, error: true, email: true });
      if(!loginForm.password) return setErrorLoginForm({ ...errorLoginForm, error: true, password: true })
      setErrorLoginForm({ ...errorLoginForm, error: false,  email: false, password: false,});

    loginUser(loginForm.email, loginForm.password)
      .then(credential => {
        setContext(prevState => ({
          ...prevState,
          user: credential.user,
        }));
      })
      .then(() => {
        navigate('/');
      })
      .then(() => setLoadingState(false))
      .catch(e => {
        setLoadingState(false);
        setErrorLoginForm({ ...errorLoginForm, error: true, fieldErr: true });
        throw e;  
      });

    }
  
  return (
    <>
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8"
    onKeyDown={e => onKeyEnter(e)}>
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Log in</h2>
      </div>
      <form className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <div className="mt-2.5">
              <input
                type="text"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="Email"
                className={`block w-full border-0 rounded-md px-3.5 py-2 text-gray-900  shadow-sm  placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-purple-300 sm:text-sm sm:leading-6 
                ${errorLoginForm.error && errorLoginForm.email ? 'ring-2 ring-inset ring-red-500' : 'ring-1 ring-inset ring-gray-300'}`}
                onChange={updateLoginForm('email')}
                /> 
                {errorLoginForm.error && errorLoginForm.email && <p className="text-red-500">{MSG_FIELD_REQUIRED}</p>}              
            </div>
          </div>
          <div>
            <div className="mt-2.5">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="password"
                placeholder='Password'
                className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm  placeholder:text-gray-400 
                focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 
                ${errorLoginForm.error && errorLoginForm.password ? 'ring-2 ring-inset ring-red-500' : 'ring-1 ring-inset ring-gray-300'}`}
                onChange={updateLoginForm('password')}
              />
              {errorLoginForm.error && errorLoginForm.password && <p className="text-red-500">{MSG_FIELD_REQUIRED}</p>}
            </div>
          </div>
          </div>
          {errorLoginForm.error && errorLoginForm.fieldErr && <p className="text-red-500">{MSG_WRONG_EMAIL_AND_PASSWORD}</p>}
          <div className='flex justify-center'>
          <button
            type="button"
            className="block w-1/2 rounded-md bg-purple-800 px-3.5 py-2.5 m-10 text-center text-sm font-semibold 
            text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={onLogin}
          >
            Login
          </button>
          </div>
          
      </form>
    </div>
    </>
  );
}

export default Login;