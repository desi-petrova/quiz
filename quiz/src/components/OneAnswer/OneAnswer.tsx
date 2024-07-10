import { useEffect, useState } from 'react';
import { createQuestion, updateQuestion, updateQuestionAnswers } from "../../services/question.service.ts";
import {MSG_FIELD_REQUIRED, MSG_WRONG_ANSWER} from '../../common/constant.ts';
import { createAnswers, getAnswerById, updateAnswer, updateAnswerWrong } from '../../services/answers.service.ts';
import {updateQuestionnaireQuestion, updateQuestionnaireAnswer, updateQuestionnaireTotalPoints} from "../../services/questionnaire.service.ts"
import AppContext, { UserState } from '../../context/AppContext';
import { useContext } from 'react';
import {updateUserQuestions, updateUserAnswers} from "../../services/users.service.ts"
import { Answer, NewQuestion, AnswerProps, MyAnswers } from '../../common/typeScriptDefinitions.ts';
import { useNavigate } from 'react-router-dom';

type AnswerWithId = (Answer | MyAnswers) & { id?: string };

const OneAnswer = ({idQuestionnaire, idAnswers, idQuestion, question, points, onEdit}: AnswerProps) => {

    const navigate = useNavigate();
    const [newQuestion, setNewQuestion] = useState<NewQuestion>({
        question: question || '',
        type: 'oneAnswer',
        points: points || 0,
    })

    const [answers, setAnswers] = useState<AnswerWithId[]>([
        {answer: '', wrong: false,},
        {answer: '', wrong: true,},
        {answer: '', wrong: true,},
        {answer: '', wrong: true,},
])

  
    useEffect(() => {
        if(idAnswers){
        Promise.all(
        idAnswers.map(answersId => {
            return getAnswerById(answersId)
        }
        )) 
        .then(res => {
            setAnswers(res)  
        })
        .catch(e => console.error(e)) 
        }
        },[])
    
    const [error, setError] = useState<boolean>(false)
    const [errorErrorQuestion, setErrorQuestion] = useState<boolean>(false)
    const [errorWrongAnswer, setErrorWrongAnswer] = useState<boolean>(false)
    const [errorPoints, setErrorPoints] = useState<boolean>(false)
    const { userData } = useContext<UserState>(AppContext);

    const updateNewQuestion = (field: string | number) => (e: React.ChangeEvent<HTMLInputElement>) => {

        setNewQuestion({
            ...newQuestion,
            [field]: e.target.value,
        })
    }

    const updateAnswers = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedAnswers = answers.map((answer, i) =>
            i === index ? { ...answer, answer: e.target.value } : answer
        );
        console.log(1)
        setAnswers(updatedAnswers);
        console.log(2)
        console.log(updatedAnswers)
        };


    const addAnswer = () => {
        setAnswers([...answers, {answer: '', wrong: true}])
    }

    const saveQuestion = () => {

        if(newQuestion.question == "") return setErrorQuestion(true);
        if(answers[0].answer == "" ) return setError(true);
        if(userData === null) return "User is not login!"
        if(newQuestion.points == 0) return setErrorPoints(true);

        let wrongAnswer = false;
        for(let i =1; i< answers.length; i++) {
            if(answers[i].answer == ''){
                wrongAnswer = true;
            } else { 
                wrongAnswer = false;
                break;
            }
        }
        if(wrongAnswer) return setErrorWrongAnswer(wrongAnswer)

        if(answers.some(answer => {answer.answer != '' && answer.wrong == null })) return setError(true)

        createQuestion(newQuestion.question, newQuestion.type, idQuestionnaire, newQuestion.points)
        .then(question => {
            answers.forEach(answer => {
                if(answer.answer != "" ) {
                    if(answer.wrong == null) return 'Wrong Answer!'
                createAnswers(question.id, answer.answer, answer.wrong)
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
            updateQuestionnaireTotalPoints(idQuestionnaire, newQuestion.points)

            setNewQuestion({
                question: '',
                type: 'oneAnswer',
                points: 0,
            })
            setAnswers([
                {answer: '', wrong: false,},
                {answer: '', wrong: true,},
                {answer: '', wrong: true,},
                {answer: '', wrong: true,},
            ])
            setErrorQuestion(false)
            setError(false)
            setErrorWrongAnswer(false)
            setErrorPoints(false)
        })
        .catch(e => console.error(e))
           
    } 

    const saveQuestionAndFinish =() =>{
        saveQuestion()

        return navigate('/')
    } 

    const update = () => {
        if(!idQuestion || !onEdit) return;
        updateQuestion(idQuestion, newQuestion.question)
        answers.forEach(el => {
            if(el.wrong == null || el.id == null) return; 
          updateAnswer(el.id, el.answer)  
          updateAnswerWrong(el.id, el.wrong)
        })
        onEdit(false)
    }
    
    return (
    <div className='w-full m-4'>
        <p>Question:</p>
        <input type="text"
        className="input input-bordered input-warning w-full mt-2 mb-2"
        value={newQuestion.question}
        onChange={updateNewQuestion('question')}/>
        {errorErrorQuestion && <p className="text-red-500">{MSG_FIELD_REQUIRED}</p>}
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
            value={answerKey.answer}
            onChange={updateAnswers(index)}
            />
            {error && index==0 && <p className="text-red-500">{MSG_FIELD_REQUIRED}</p>}
        </div>
             ) })
            }
            {errorWrongAnswer && <p className="text-red-500">{MSG_WRONG_ANSWER}</p>}
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
        {idAnswers && (<div className='flex justify-end'>
            <button 
        className="block m-2 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
        shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
        focus-visible:outline-purple-600"
        onClick={update}>Update</button>
        </div>)}
        {!idAnswers && <div className='flex justify-end'>
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
        </div>}
        
        
    </div> 
    )
}

export default OneAnswer;