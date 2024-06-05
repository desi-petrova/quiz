import { useContext, useEffect, useState } from "react";
import { StartAnswer, MyAnswers } from "../../common/typeScriptDefinitions"
import { getAnswersByQuestionId } from "../../services/answers.service";
import AppContext, { UserState } from "../../context/AppContext";
import { FaRegCircle, FaRegSquare  } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline, IoMdCheckboxOutline } from "react-icons/io";
import { createMyAnswers, getQuizAnswerByQuizIdAndQuestionId, updateMyAnswers } from "../../services/quizAnswers.service";
import { updateUserQuizAnswers } from "../../services/users.service";
import { updateQuizAnswers } from "../../services/completedQuiz.service";



const StartAnswers = ({questionId, type, question, idQuiz} : StartAnswer) => {

    const { userData } = useContext<UserState>(AppContext);
    const [answers, setAnswers] = useState<MyAnswers[]>([]);
    const [myAnswerId, setMyAnswerId] = useState<string>('')

    useEffect(() => {
        getAnswersByQuestionId(questionId)
        .then(result => {
            const updatedAnswers: MyAnswers[] = result.map((answer) => ({...answer, myAnswer: false, myOpenAnswer: ''}))
            setAnswers(updatedAnswers)

            return updatedAnswers
        })
        .then(() =>{
            getQuizAnswerByQuizIdAndQuestionId(idQuiz, questionId)
        .then(result => {
            if(result == null) return []
            setMyAnswerId(result[0].id)
        })
        })
        .catch(e => console.error(e))
    },[questionId, type, userData, idQuiz, myAnswerId])

    const correctAnswer = (correctAnswer: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>  {
        e.preventDefault()
        const updatedAnswers: MyAnswers[] = [];
        console.log(answers)
        console.log(myAnswerId)

        if(type === 'óneAnswer'){
        answers.forEach((answer) => {
            if(answer.id == correctAnswer && answer.myAnswer){
                updatedAnswers.push({...answer, myAnswer: false}) 
            }else if(answer.id == correctAnswer && !answer.myAnswer){
                    updatedAnswers.push({...answer, myAnswer: true})
            }else {
                updatedAnswers.push({...answer, myAnswer: false})
            }
        })} else {
            answers.map((answer) => {
                if(answer.id == correctAnswer && answer.myAnswer){
                    updatedAnswers.push({...answer, myAnswer: false}) 
                }else if(answer.id == correctAnswer && !answer.myAnswer){
                        updatedAnswers.push({...answer, myAnswer: true})
                } else {
                    updatedAnswers.push({...answer})
                }
            })}
    
        setAnswers([...updatedAnswers])
        updateMyAnswers(myAnswerId, updatedAnswers)
     }

     const openAnswer = (e: React.ChangeEvent<HTMLInputElement> ) => {
      //  e.preventDefault()
       const updatedAnswer = answers.map(answer => {
        return {
            ...answer,
            myOpenAnswer: e.target.value
        };
    });

    setAnswers(updatedAnswer)
    updateMyAnswers(myAnswerId, updatedAnswer)
    }

    return (
        <div className="px-4" >
        {answers.map((answer, indexAnswer) => {
        return(
        <label key={indexAnswer} className = "flex m-1">
            <div className="pt-1">
            {type == 'oneAnswer' ? (
            <div>
            <button onClick={correctAnswer(answer.id)}> 
            {answer.myAnswer ? <IoMdCheckmarkCircleOutline size={20} color="#008000"/> : <FaRegCircle size={15}  />} 
            </button>
            <p className="ml-4">{answer.answer}</p>
            </div>
            ) : (type == 'MoreAnswer') ? (
                <div>
                <button onClick={correctAnswer(answer.id)} > 
                {answer.myAnswer ? <IoMdCheckboxOutline size={20} color="#008000"/> : <FaRegSquare size={15}  />}  
                </button>
                <p className="ml-4">{answer.answer}</p>
                </div>
                ) : (type == 'openAnswer') ? (
                    <div>
                    <input className="input input-bordered input-warning w-full mt-2 mb-2"
                    value={answer.myOpenAnswer} 
                    onChange={openAnswer}/>
                    </div>
                    ): ''}
        </div>   
        </label>
        )})}
        </div>
    )
}

export default StartAnswers;