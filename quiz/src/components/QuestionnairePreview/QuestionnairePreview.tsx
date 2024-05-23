import { useContext, useEffect, useState } from 'react';
import {getQuestionnaireById, getQuestionnaireQuestionsLive} from '../../services/questionnaire.service.ts'
import { getQuestionById } from '../../services/question.service.ts';
import {Answer} from '../OneAnswer/OneAnswer.tsx'
import Answers from '../Answers/Answers.tsx';
import AppContext, { UserState } from '../../context/AppContext';


interface QuestionnairePreview {
    idQuestionnaire: string,
}

export interface Questionnaire {
    title: string,
    description: string,
    time: number,
    status: string,
    background: string,
    picture: string,
    questions: {[id: string]: boolean},
    answers: {[id: string]: boolean},
}

export interface Questions{
    id: string,
    question: string, 
    type: string, 
    idQuestionnaire: string,
    answers: string[] 
}

const QuestionnairePreview = ({idQuestionnaire}: QuestionnairePreview) => {
    
    const { userData } = useContext<UserState>(AppContext);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({})
    const [questions, setQuestions] = useState <Questions[]>([])

    useEffect(() => {
        getQuestionnaireById(idQuestionnaire)
        .then(res => {
            setQuestionnaire(res);
          })
        .catch(e => console.error(e));

      }, [idQuestionnaire, userData])

      console.log(idQuestionnaire)
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
        <div className="w-1/2 m-5">
        <h2 className="text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl m-10 w-full px-6 py-5  lg:px-8">Preview</h2>
        <div>
        <h4 className='text-2xl text-center m-1'>{questionnaire.title}</h4>
        <p className="m-1">{questionnaire.description}</p>
        <p className="m-1">Time: {questionnaire.time}</p>
        <p className="m-1">Status: {questionnaire.status}</p>
        </div>

        <div >
        {questions.map((question,indexQ) => {
            return(
                <div key={indexQ}>
                    <p>{indexQ + 1}. {question.question}</p>
                    <Answers questionId={question.id} show={true}/>
                </div>
            )
        })}
        </div>
        

        </div>       
    )
}

export default QuestionnairePreview;