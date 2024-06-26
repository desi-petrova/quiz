import { useState } from 'react';
import { createQuestion, updateQuestionAnswers } from "../../services/question.service.ts";
import {MSG_CORRECT_ANSWER, MSG_FIELD_REQUIRED, MSG_WRONG_ANSWER} from '../../common/constant.ts';
import { createAnswers } from '../../services/answers.service.ts';
import {updateQuestionnaireQuestion, updateQuestionnaireAnswer, updateQuestionnaireTotalPoints} from "../../services/questionnaire.service.ts"
import AppContext, { UserState } from '../../context/AppContext';
import { useContext } from 'react';
import {updateUserQuestions, updateUserAnswers} from "../../services/users.service.ts"
import {IdQuestionnaire, Answer, NewQuestion} from '../../common/typeScriptDefinitions.ts'
import { GiCheckMark } from "react-icons/gi";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';


const MoreAnswers = ({idQuestionnaire}: IdQuestionnaire) => {
    
    const navigate = useNavigate();
    const [newQuestion, setNewQuestion] = useState<NewQuestion>({
        question: '',
        type: 'MoreAnswer',
        points: 0,
    })

    const [answers, setAnswers] = useState<Answer[]>([
        {description: '', wrong: null,},
        {description: '', wrong: null,},
        {description: '', wrong: null,},
        {description: '', wrong: null,},
        {description: '', wrong: null,},
        {description: '', wrong: null,},
])

    const [errorQuestion, setErrorQuestion] = useState<boolean>(false)
    const [errorWrongAnswer, setErrorWrongAnswer] = useState<boolean>(false)
    const [errorCorrectAnswer,setErrorCorrectAnswer] = useState<boolean>(false)
    const [errorPoints, setErrorPoints] = useState<boolean>(false)

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

        if(newQuestion.question == "") return setErrorQuestion(true)

        if(!answers.some(answer => answer.wrong ===true)) return setErrorWrongAnswer(true);
        if(!answers.some(answer => answer.wrong === false)) return setErrorCorrectAnswer(true);
        if(newQuestion.points == 0) return setErrorPoints(true);

        if(userData === null) return "User is not login!"

        createQuestion(newQuestion.question, newQuestion.type, idQuestionnaire, newQuestion.points)
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

        updateQuestionnaireTotalPoints(idQuestionnaire, newQuestion.points)

        setNewQuestion({
            question: '',
            type: 'oneAnswer',
            points: 0,
        })
        setAnswers([
            {description: '', wrong: null,},
            {description: '', wrong: null,},
            {description: '', wrong: null,},
            {description: '', wrong: null,},
            {description: '', wrong: null,},
            {description: '', wrong: null,},
        ])
        setErrorQuestion(false)
        setErrorWrongAnswer(false)
        setErrorPoints(false)
           
    } 

    const saveQuestionAndFinish =() =>{
        saveQuestion()

        return navigate('/')
    }

    return (
    <div className='w-full m-4'>
        <p>Question:</p>
        <input 
        className="input input-bordered input-warning w-full mt-2 mb-2"
        onChange={updateNewQuestion('question')}/>
        {errorQuestion && <p className="text-red-500">{MSG_FIELD_REQUIRED}</p>}
        <div >
            <p>Answers (Choose correct answers): </p>
            <button
            className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={addAnswer}>
                Add answer
            </button>
            {answers.map((answerKey, index) =>{
                return(
             <div key={index} className="flex ">
            <input
            className={`input w-full mt-2 mb-2 input-bordered 
            ${answerKey.wrong === null ? '' : answerKey.wrong === false ? 'input-success' : 'input-error' }`} 
            value={answerKey.description}
            onChange={updateAnswers(index)}
            />
            <button 
            className="block ml-2 my-2 rounded-md bg-green-600 px-3 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => updateWrong(index, false)}><GiCheckMark size={15}/></button>
            <button
            className="block ml-2 my-2 rounded-md bg-red-600 px-3 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
            onClick={() => updateWrong(index, true)}><FaXmark size={15}/></button>
        </div>
             ) })
            }
        {errorWrongAnswer && <p className="text-red-500">{MSG_WRONG_ANSWER}</p>} 
        {errorCorrectAnswer && <p className="text-red-500">{MSG_CORRECT_ANSWER}</p>}   
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

export default MoreAnswers;