import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {getQuestionnaireById} from '../../services/questionnaire.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import { createCompletedQuiz, updateQuizAnswers } from '../../services/completedQuiz.service.ts';
import { Questionnaire } from '../../common/typeScriptDefinitions.ts';
import { updateUserCompletedQuiz } from '../../services/users.service.ts';
import { getQuestionById } from '../../services/question.service.ts';
import { getAnswerById } from '../../services/answers.service.ts';
import { createMyAnswers } from '../../services/quizAnswers.service.ts';
import parse from 'html-react-parser';


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
        .then(resultQuiz => {

          updateUserCompletedQuiz(userData.handle, resultQuiz.id)
          if(!questionnaire.questions ) return
          questionnaire.questions.forEach(question => {
            getQuestionById(question)
            .then(res => {
             Promise.all(res.answers.map((answer: string) => {
                return getAnswerById(answer)
              }))
              .then(el => createMyAnswers(res.id, resultQuiz.id, res.question, res.type, [...el]))
              .then(idMyAnswer => {
                updateQuizAnswers(resultQuiz.id, idMyAnswer.id)})
              
            })
            .catch(e => console.error(e))
          })
          navigate('/startQuestions', {state: {idQuestionnaire: idQuestionnaire, 
                                     title: questionnaire.title, 
                                     time:questionnaire.time,
                                     idQuiz: resultQuiz.id,}})
          
        })
        
      }
    return (
        <div className="w-3/5 mx-auto m-5">
        <div className="m-3">
        <h3 className='text-2xl text-center m-1'>{questionnaire.title}</h3>
        <p>{parse(questionnaire.description)}</p>
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

