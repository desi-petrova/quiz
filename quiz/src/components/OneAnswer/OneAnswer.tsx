import { useState } from 'react';
import { createQuestion, updateQuestionAnswers } from "../../services/question.service.ts";
import {MSG_FIELD_REQUIRED} from '../../common/constant.ts';
import { createAnswers } from '../../services/answers.service.ts';
import {updateQuestionnaireQuestion, updateQuestionnaireAnswer} from "../../services/questionnaire.service.ts"
import AppContext, { UserState } from '../../context/AppContext';
import { useContext } from 'react';
import {updateUserQuestions, updateUserAnswers} from "../../services/users.service.ts"
import { IdQuestionnaire, Answer, NewQuestion } from '../../common/typeScriptDefinitions.ts';
import { useNavigate } from 'react-router-dom';


const OneAnswer = ({idQuestionnaire}: IdQuestionnaire) => {

    const navigate = useNavigate();
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

    const saveQuestionAndFinish =() =>{
        saveQuestion()

        return navigate('/')
    } 
    
    return (
    <div className='w-full m-4'>
        <p>Question:</p>
        <input type="text"
        className="input input-bordered input-warning w-full mt-2 mb-2"
        value={newQuestion.question}
        onChange={updateNewQuestion('question')}/>
        <div className=''>
            <p>Answers (The first answer will be recorded as correct): </p>
            <button
            className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={addAnswer}>
                Add wrong answer
            </button>
            {answers.map((answerKey, index) =>{
                return(
             <div key={index}>
            <input
            className={`input w-full mt-2 mb-2 input-bordered 
            ${answerKey.wrong === null ? '' : answerKey.wrong === false ? 'input-success' : 'input-error' }`} 
            value={answerKey.description}
            onChange={updateAnswers(index)}
            />
        </div>
             ) })
            }
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