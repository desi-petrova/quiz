import { useState, useEffect } from 'react'
import AppContext, { UserState } from './context/AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getUserData } from './services/users.service';
import { useAuthState } from 'react-firebase-hooks/auth';
import Body from './hoc/Body/Body';
import Home from './views/Home/Home';
import NoPageFound from './views/NoPageFound/NoPageFound';
import { auth } from './config/firebaseConfig';
//import AuthenticatedRoute from './hoc/AuthenticatedRoute/AuthenticatedRoute';


function App() {
  const [userAuth, loading] = useAuthState(auth);
  const [appState, setAppState] = useState<UserState>({
    user: null,
    userData: null,
    loading: true,
    callObject: null,
    setContext: () => { },
  });

  if (appState.user !== userAuth) {
    setAppState((prevState: UserState) => ({
      ...prevState,
      user: userAuth || null,
    }));
  }

  useEffect(() => {
    if (userAuth === null || userAuth === undefined) {
      if (!loading) {
        setAppState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
      return;
    }

    getUserData(userAuth.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }

        setAppState(prevState => ({
          ...prevState,
          loading: false,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        }));
      })
      .catch(e => alert(e.message))
  }, [userAuth, loading]);

  return (
    <Router>
    <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
      {!appState.loading && <Body>
        <Routes>
          <Route path='/' element={<Home />} />
          {/* <Route path='/new-chat' element={<AuthenticatedRoute><NewChat /></AuthenticatedRoute>} /> */}
          <Route path='*' element={<NoPageFound />} />
        </Routes>
      </Body>}
    </AppContext.Provider>
    </Router>
  )
}

export default App
