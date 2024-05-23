import { useState } from 'react';
import { createQuestion, updateQuestionAnswers } from "../../services/question.service.ts";
import {MSG_FIELD_REQUIRED} from '../../common/constant.ts';
import { createAnswers } from '../../services/answers.service.ts';
import {updateQuestionnaireQuestion, updateQuestionnaireAnswer} from "../../services/questionnaire.service.ts"
import AppContext, { UserState } from '../../context/AppContext';
import { useContext } from 'react';
import {updateUserQuestions, updateUserAnswers} from "../../services/users.service.ts"
import {NewQuestions, IdQuestionnaire} from '../../common/typeScriptDefinitions.ts'


const OneAnswer = ({idQuestionnaire} : IdQuestionnaire) => {

    const [newQuestion, setNewQuestion] = useState<NewQuestions>({
        question: '',
        type: 'openAnswer',
        answer: '',

    }) 
    const [errorQuestion, setErrorQuestion] = useState<boolean>(false)
    const [errorAnswer, setErrorAnswer] = useState<boolean>(false)
    const { userData } = useContext<UserState>(AppContext);

    const updateNewQuestion = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {

        setNewQuestion({
            ...newQuestion,
            [field]: e.target.value,
        })
    }
    

    const saveQuestion = () => {

        if(!newQuestion.question) return setErrorQuestion(true)
        if(!newQuestion.answer) return setErrorAnswer(true)

        createQuestion(newQuestion.question, newQuestion.type, idQuestionnaire)
        .then(question => {
            createAnswers(question.id, newQuestion.answer, false)
            .then(answer => {
                if(userData === null) return "User is not login!"

                updateQuestionAnswers(question.id, answer.id)
                updateQuestionnaireQuestion(idQuestionnaire, question.id)
                updateQuestionnaireAnswer(idQuestionnaire, answer.id)
                updateUserQuestions(userData.handle, question.id)
                updateUserAnswers(userData.handle, answer.id)

                setNewQuestion({
                    question: '',
                    type: 'openAnswer',
                    answer: '',
                })
            })

        })
        .catch(e => console.error(e))
    }
    
    return (
    <div className='w-full'>
        <div><p>Question:</p>
        <input 
        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400
        focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 
        ring-1 ring-inset ring-gray-300"
        value={newQuestion.question}
        onChange={updateNewQuestion('question')}/>
        </div>
        <div>
            {errorQuestion && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
        </div>
        
        <div >
            <p>Answers: </p>
        <input
            className="block w-full m-1 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400
            focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 
            ring-1 ring-inset ring-green-300" 
            value={newQuestion.answer}
            onChange={updateNewQuestion('answer')}/>
            {errorAnswer && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
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