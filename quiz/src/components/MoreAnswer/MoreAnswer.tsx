import { useState } from 'react';
import { createQuestion, updateQuestionAnswers } from "../../services/question.service.ts";
import {MSG_FIELD_REQUIRED} from '../../common/constant.ts';
import { createAnswers } from '../../services/answers.service.ts';
import {updateQuestionnaireQuestion, updateQuestionnaireAnswer} from "../../services/questionnaire.service.ts"
import AppContext, { UserState } from '../../context/AppContext';
import { useContext } from 'react';
import {updateUserQuestions, updateUserAnswers} from "../../services/users.service.ts"
import {IdQuestionnaire, Answer, NewQuestion} from '../../common/typeScriptDefinitions.ts'

const MoreAnswers = ({idQuestionnaire}: IdQuestionnaire) => {
    
    const [newQuestion, setNewQuestion] = useState<NewQuestion>({
        question: '',
        type: 'MoreAnswer',
    })

    const [answers, setAnswers] = useState<Answer[]>([
        {description: '', wrong: null,},
        {description: '', wrong: null,},
        {description: '', wrong: null,},
        {description: '', wrong: null,},
        {description: '', wrong: null,},
        {description: '', wrong: null,},
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

    const updateWrong = (index: number, wrongValue: boolean) => {
        const updatedAnswers = answers.map((answer, i) =>
            i === index ? {...answer, wrong: wrongValue} : answer
        )

        setAnswers(updatedAnswers)  
    }

    const addAnswer = () => {
        setAnswers([...answers, {description: '', wrong: null}])
    }

    const saveQuestion = () => {

        if(!answers.some(answer => answer.wrong ===true )) return setError(true);
        if(!answers.some(answer => answer.wrong === false )) return setErrorQuestions(true);
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
        onChange={updateNewQuestion('question')}/>
        <div >
            <p>Answers (Choose correct answers): </p>
            <button
            className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={addAnswer}>
                Add answer
            </button>
            {answers.map((answerKey, index) =>{
                return(
             <div key={index} className="flex ">
            <input
            className={`block w-full m-2 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400
            ${answerKey.wrong ===null ? 'focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 ring-1 ring-inset ring-gray-300' :
            answerKey.wrong === false ? 'focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 ring-1 ring-inset ring-green-300' : 
            'focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 ring-1 ring-inset ring-red-300'}`}  
            value={answerKey.description}
            onChange={updateAnswers(index)}
            />
            <button
            className="block m-1 rounded-md bg-red-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-red-600"
            onClick={() => updateWrong(index, true)}>X</button>
            <button 
            className="block m-1 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={() => updateWrong(index, false)}>Y</button>
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

export default MoreAnswers;