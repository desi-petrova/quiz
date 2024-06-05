import { useState, useEffect } from 'react'
import AppContext, { UserState } from './context/AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getUserData } from './services/users.service';
import { useAuthState } from 'react-firebase-hooks/auth';
import Body from './hoc/Body/Body';
import Home from './views/Home/Home';
import NoPageFound from './views/NoPageFound/NoPageFound';
import { auth } from './config/firebaseConfig';
import AuthenticatedRoute from './hoc/AuthenticatedRoute/AuthenticatedRoute';
import './App.css';
import Login from './views/Login/Login';
import CreateAccount from './components/CreateAccount/CreateAccount';
import NewQuestionnaire from './views/NewQuestionnaire/NewQuestionnaire'
import QuestionnaireForm from './components/QuestionnaireForm/QuestionnaireForm';
import StartQuestionnaire from './components/StartQuestionnaire/StartQuestionnaire';
import StartQuestions from './components/StartQuestions/StartQuestions';
import ReviewQuiz from './components/ReviewQuiz/ReviewQuiz';

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
    <div>
    <Router>
    <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
      {!appState.loading && <Body>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/createAccount' element={!appState.user && <CreateAccount />} />
          <Route path='/login' element={!appState.user && <Login />} />
          {/* <Route path='/new-chat' element={<AuthenticatedRoute><NewChat /></AuthenticatedRoute>} /> */}
          <Route path='/newQuestionnaire' element={<AuthenticatedRoute><NewQuestionnaire /></AuthenticatedRoute>} /> 
          <Route path='/questionnaireForm' element={<AuthenticatedRoute><QuestionnaireForm /></AuthenticatedRoute>} />
          <Route path='/startQuestionnaire' element={<AuthenticatedRoute><StartQuestionnaire /></AuthenticatedRoute>} />
          <Route path='/startQuestions' element={<AuthenticatedRoute><StartQuestions /></AuthenticatedRoute>} />
          <Route path='/reviewQuiz' element={<AuthenticatedRoute><ReviewQuiz /></AuthenticatedRoute>} />
          <Route path='*' element={<NoPageFound />} />
        </Routes>
      </Body>}
    </AppContext.Provider>
    </Router>
    </div>
  )
}

export default App
