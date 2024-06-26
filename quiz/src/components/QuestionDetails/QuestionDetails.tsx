import { useContext, useEffect, useState } from 'react';
import { getQuestionnaireQuestionsLive} from '../../services/questionnaire.service.ts'
import { getQuestionById } from '../../services/question.service.ts';
import AppContext, { UserState } from '../../context/AppContext';
import {IdQuestionnaire, Questions } from '../../common/typeScriptDefinitions.ts'
import Answers from '../Answers/Answers.tsx';

const QuestionDetails = ({idQuestionnaire}: IdQuestionnaire) => {

    const { userData } = useContext<UserState>(AppContext);
    const [questions, setQuestions] = useState <Questions[]>([])


    useEffect(() => {
        getQuestionnaireQuestionsLive(idQuestionnaire, ((data: string[]) => {
            Promise.all(
                data.map((questionId: string) => {
                    return getQuestionById(questionId)
                }))
            .then(questionVal => setQuestions([...questionVal]))
            .catch(e => console.error(e));
            
        })) 
      }, [idQuestionnaire, userData])

    return (
        <div className="w-full pl-5">
        {questions.map((question,indexQ) => {
            return(
                <div key={indexQ} className="m-3">
                    <p>{indexQ + 1}. {question.question}</p>
                    <p className='text-right'>Points: {question.points}</p>
                    <Answers questionId={question.id} show={true}/>
                </div>
            )
        })}
        </div>
    )
}

export default QuestionDetails;