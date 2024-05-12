import { useState } from 'react';
import { createQuestion, updateQuestionAnswers } from "../../services/question.service.ts";
import {MSG_FIELD_REQUIRED} from '../../common/constant.ts';
import { createAnswers } from '../../services/answers.service.ts';

interface NewQuestions{
    question: string,
    type: string,
    answer: string,
}

interface OneAnswer {
    id: string
}

const OneAnswer = ({id} : OneAnswer) => {

    const [newQuestion, setNewQuestion] = useState<NewQuestions>({
        question: '',
        type: 'openAnswer',
        answer: '',

    }) 
    const [error, setError] = useState<boolean>(false)

    const updateNewQuestion = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {

        setNewQuestion({
            ...newQuestion,
            [field]: e.target.value,
        })
    }

    const saveQuestion = () => {

        if(!newQuestion.question) return setError(true)

        createQuestion(newQuestion.question, newQuestion.type, id)
        .then(question => {
            createAnswers(question.id, newQuestion.answer, true)
            .then(answer => {
                updateQuestionAnswers(question.id, answer.id)
                updateUserQuestions()
                updateUserAnswers()
            })

        })
        .catch(e => console.error(e))
    }
    
    return (
    <div className='w-full'>
        <div><p>Question</p>
        <input 
        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400
        focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 
        ring-1 ring-inset ring-gray-300"
        onChange={updateNewQuestion('question')}/>
        </div>
        <div>
            {error && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
        </div>
        
        <div >
            <p>Answers: </p>
        <input
            className="block w-full m-1 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400
            focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 
            ring-1 ring-inset ring-green-300" 
            onChange={updateNewQuestion('answer')}/>
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