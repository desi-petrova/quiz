import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {getQuestionnaireById} from '../../services/questionnaire.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import { createCompletedQuiz } from '../../services/completedQuiz.service.ts';
import { Questionnaire } from '../../common/typeScriptDefinitions.ts';
import { updateUserCompletedQuiz } from '../../services/users.service.ts';


export interface Questions{
    id: string,
    question: string, 
    type: string, 
    idQuestionnaire: string,
    answers: string[] 
}

const StartQuestionnaire = () => {

    const location = useLocation();
    const idQuestionnaire = location.state?.idQuestionnaire 
    const navigate = useNavigate()
    
    const { userData } = useContext<UserState>(AppContext);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({})

    useEffect(() => {
        getQuestionnaireById(idQuestionnaire)
        .then(res => {
            setQuestionnaire(res);
          })
        .catch(e => console.error(e));

      }, [idQuestionnaire, userData])

      const startQuiz = () => {
        if(userData ==null) return;

        createCompletedQuiz(questionnaire.id, questionnaire.title, userData.handle, questionnaire.background)
        .then(result => {

          updateUserCompletedQuiz(userData.handle, result.id)
          navigate('/startQuestions', {state: {idQuestionnaire: idQuestionnaire, 
                                     title: questionnaire.title, 
                                     time:questionnaire.time,
                                     idQuiz: result.id,}})
          
        })
        
      }
    return (
        <div className="w-3/5 mx-auto m-5">
        <div>
        <h3 className='text-2xl text-center m-1'>{questionnaire.title}</h3>
        <p>{questionnaire.description}</p>
        <p>Time: {questionnaire.time}minutes</p>
        </div>
        <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
        shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
        focus-visible:outline-purple-600 "
        onClick={startQuiz}
        >Start</button>
        </div>       
    )
}

export default StartQuestionnaire;

//https://www.npmjs.com/package/react-timer-wrapper

{/* <CountdownCircleTimer
        {...timerProps}
        colors="#EF798A"
        duration={hourSeconds}
        initialRemainingTime={remainingTime % hourSeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > minuteSeconds
        })}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color }}>
            {renderTime("minutes", getTimeMinutes(hourSeconds - elapsedTime))}
          </span>
        )}
      </CountdownCircleTimer> */}