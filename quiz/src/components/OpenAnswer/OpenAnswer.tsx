import { useState } from 'react';
import { createQuestion, updateQuestionAnswers } from "../../services/question.service.ts";
import {MSG_FIELD_REQUIRED} from '../../common/constant.ts';
import { createAnswers } from '../../services/answers.service.ts';
import {updateQuestionnaireQuestion, updateQuestionnaireAnswer, updateQuestionnaireTotalPoints} from "../../services/questionnaire.service.ts"
import AppContext, { UserState } from '../../context/AppContext';
import { useContext } from 'react';
import {updateUserQuestions, updateUserAnswers} from "../../services/users.service.ts"
import {NewQuestions, IdQuestionnaire} from '../../common/typeScriptDefinitions.ts'
import { useNavigate } from 'react-router-dom';


const OneAnswer = ({idQuestionnaire} : IdQuestionnaire) => {

    const navigate = useNavigate();

    const [newQuestion, setNewQuestion] = useState<NewQuestions>({
        question: '',
        type: 'openAnswer',
        answer: '',
        points: 0,

    }) 
    const [errorQuestion, setErrorQuestion] = useState<boolean>(false)
    const [errorAnswer, setErrorAnswer] = useState<boolean>(false)
    const [errorPoints, setErrorPoints] = useState<boolean>(false)

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
        if(newQuestion.points == 0) return setErrorPoints(true);


        createQuestion(newQuestion.question, newQuestion.type, idQuestionnaire, newQuestion.points)
        .then(question => {
            createAnswers(question.id, newQuestion.answer, false)
            .then(answer => {
                if(userData === null) return "User is not login!"

                updateQuestionAnswers(question.id, answer.id)
                updateQuestionnaireQuestion(idQuestionnaire, question.id)
                updateQuestionnaireAnswer(idQuestionnaire, answer.id)
                updateUserQuestions(userData.handle, question.id)
                updateUserAnswers(userData.handle, answer.id)
                updateQuestionnaireTotalPoints(idQuestionnaire, newQuestion.points)

                setNewQuestion({
                    question: '',
                    type: 'openAnswer',
                    answer: '',
                    points: 0,
                })
                setErrorQuestion(false)
                setErrorAnswer(false)
                setErrorPoints(false)

            })

        })
        .catch(e => console.error(e))
    }
    
    const saveQuestionAndFinish =() =>{
        saveQuestion()

        return navigate('/')
    }

    return (
    <div className='w-full m-4'>
        <div><p>Question:</p>
        <input 
        className="input input-bordered input-warning w-full mt-2 mb-2"
        value={newQuestion.question}
        onChange={updateNewQuestion('question')}/>
        </div>
        <div>
            {errorQuestion && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
        </div>
        
        <div>
            <p>Answers: </p>
        <input
            className="input input-bordered input-success w-full mt-2" 
            value={newQuestion.answer}
            onChange={updateNewQuestion('answer')}/>
            {errorAnswer && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
        </div>
        <div>
        <div className='flex my-2 justify-end'>
        <p className='text-l'>Points: &nbsp;</p>
        <input type="text"
        className="text-right w-[50px] border border-yellow-400 rounded px-2 
        focus-visible:outline-none focus:ring-2 focus:ring-yellow-400"
        value={newQuestion.points}
        onChange={updateNewQuestion('points')}/>
        </div>
        {errorPoints && <p className="text-red-500 text-right">{MSG_FIELD_REQUIRED}</p>}
        </div>
        <div className='flex justify-end'>
            <button 
            className="block m-2 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={saveQuestion}>Save</button>
            <button 
            className="block m-2 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={saveQuestionAndFinish}>Save and Finish</button>
        </div>
        
    </div> 
    )
}

export default OneAnswer;