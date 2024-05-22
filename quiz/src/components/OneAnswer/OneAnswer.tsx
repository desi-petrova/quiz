import { useState } from 'react';
import { createQuestion, updateQuestionAnswers } from "../../services/question.service.ts";
import {MSG_FIELD_REQUIRED} from '../../common/constant.ts';
import { createAnswers } from '../../services/answers.service.ts';
import {updateQuestionnaireQuestion, updateQuestionnaireAnswer} from "../../services/questionnaire.service.ts"
import AppContext, { UserState } from '../../context/AppContext';
import { useContext } from 'react';
import {updateUserQuestions, updateUserAnswers} from "../../services/users.service.ts"


interface OneAnswer {
    idQuestionnaire: string
}

export interface Answer {
    description: string,
    wrong: boolean,
}


interface NewQuestion{
    question: string,
    type: string,
}


const OneAnswer = ({idQuestionnaire}: OneAnswer) => {

    const [newQuestion, setNewQuestion] = useState<NewQuestion>({
        question: '',
        type: 'oneAnswer',
    })

    const [answers, setAnswers] = useState<Answer[]>([
        {description: '', wrong: false,},
        {description: '', wrong: true,},
        {description: '', wrong: true,},
        {description: '', wrong: true,},
])

    const [error, setError] = useState<boolean>(false)
    const [errorWrongQuestions, setErrorQuestions] = useState<boolean>(false)
    const { userData } = useContext<UserState>(AppContext);

    const updateNewQuestion = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {

        setNewQuestion({
            ...newQuestion,
            [field]: e.target.value,
        })
    }

    const updateAnswers = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedAnswers = answers.map((answer, i) =>
            i === index ? { ...answer, description: e.target.value } : answer
        );
        setAnswers(updatedAnswers);
        };


    const addAnswer = () => {
        setAnswers([...answers, {description: '', wrong: true}])
    }

    const saveQuestion = () => {

        if(answers[0].description == "" ) return setError(true);
        if(!newQuestion.question) return setErrorQuestions(true);
        if(userData === null) return "User is not login!"

        if(answers.some(answer => {answer.description != '' && answer.wrong == null })) return setError(true)

        createQuestion(newQuestion.question, newQuestion.type, idQuestionnaire)
        .then(question => {
            answers.forEach(answer => {
                if(answer.description != "" ) {
                    if(answer.wrong == null) return 'Wrong Answer!'
                createAnswers(question.id, answer.description, answer.wrong)
                .then(answer => {
                updateQuestionAnswers(question.id, answer.id)
                updateQuestionnaireQuestion(idQuestionnaire, question.id)
                updateQuestionnaireAnswer(idQuestionnaire, answer.id)
                updateUserQuestions(userData.handle, question.id)
                updateUserAnswers(userData.handle, answer.id) 
                })
                .catch(e => console.error(e))
                }                
            })
            setNewQuestion({
                question: '',
                type: 'oneAnswer',
            })
            setAnswers([
                {description: '', wrong: false,},
                {description: '', wrong: true,},
                {description: '', wrong: true,},
                {description: '', wrong: true,},
            ])
        })
        .catch(e => console.error(e))
           
    } 
    
    return (
    <div className='w-full'>
        <p>Question:</p>
        <input 
        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400
        focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 
        ring-1 ring-inset ring-gray-300"
        value={newQuestion.question}
        onChange={updateNewQuestion('question')}/>
        <div >
            <p>Answers (The first answer will be recorded as correct): </p>
            <button
            className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={addAnswer}>
                Add wrong answer
            </button>
            {answers.map((answerKey, index) =>{
                return(
             <div key={index}>
            <input
            className={`block w-full m-2 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400
            ${answerKey.wrong ===null ? 'focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 ring-1 ring-inset ring-gray-300' :
            answerKey.wrong === false ? 'focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 ring-1 ring-inset ring-green-300' : 
            'focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 ring-1 ring-inset ring-red-300'}`}  
            value={answerKey.description}
            onChange={updateAnswers(index)}
            />
        </div>
             ) })
            }
        </div>
        <button 
            className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={saveQuestion}>Save</button>
        
    </div> 
    )
}

export default OneAnswer;