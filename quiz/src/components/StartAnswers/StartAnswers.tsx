import { useContext, useEffect, useState } from "react";
import { StartAnswer, MyAnswers } from "../../common/typeScriptDefinitions"
import { getAnswersByQuestionId } from "../../services/answers.service";
import AppContext, { UserState } from "../../context/AppContext";
import { FaRegCircle, FaRegSquare  } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline, IoMdCheckboxOutline } from "react-icons/io";
import { getQuizAnswerByQuizIdAndQuestionId, updateMyAnswers, updateQuizAnswerMyPoints } from "../../services/quizAnswers.service";
import { shuffleArray } from "../../common/functions";
import { updateQuizMyTotalPoints } from "../../services/completedQuiz.service";



const StartAnswers = ({questionId, type, idQuiz, questionPoints} : StartAnswer) => {

    const { userData } = useContext<UserState>(AppContext);
    const [answers, setAnswers] = useState<MyAnswers[]>([]);
    const [myAnswerId, setMyAnswerId] = useState<string>('')

    useEffect(() => {
        getAnswersByQuestionId(questionId)
        .then(result => {
            const updatedAnswers: MyAnswers[] = result.map((answer) => ({...answer, myAnswer: false, myOpenAnswer: ''}))
            const shuffledAnswers = shuffleArray(updatedAnswers);
            setAnswers(shuffledAnswers)

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

        if(type === 'oneAnswer'){
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

        let myPoints  = 0;
        let countTrueAnswers =0;
        let countMyTrueAnswers =0;
        if(type === 'oneAnswer' ){
           updatedAnswers.forEach(answers => {
            if(answers.wrong == false && answers.myAnswer ==true){
                myPoints += Number(questionPoints)
            }
        }) } else{
            updatedAnswers.forEach(answers => {
                if(answers.wrong == false && answers.myAnswer ==true){
                    countMyTrueAnswers++;
                }
                if(answers.wrong == false){
                    countTrueAnswers++;
                }
                })
                myPoints = (questionPoints/countTrueAnswers) * countMyTrueAnswers
                if(myPoints % 1 != 0){
                    myPoints = Number(myPoints.toFixed(2))
                } 
            }

        
    
        setAnswers([...updatedAnswers])
        updateMyAnswers(myAnswerId, updatedAnswers)
        updateQuizAnswerMyPoints(myAnswerId, myPoints)
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

    updatedAnswer.forEach(answer => {
        if(answer.myOpenAnswer.toLowerCase() === answer.answer.toLowerCase()){
            updateQuizAnswerMyPoints(myAnswerId, questionPoints)

        }})

    }

    return (
        <div className="px-4" >
        {answers.map((answer, indexAnswer) => {
        return(
        <label key={indexAnswer} className = "flex m-1">
            <div className="pt-1">
            {type == 'oneAnswer' ? (
            <div className="flex">
            <button onClick={correctAnswer(answer.id)}> 
            {answer.myAnswer ? <IoMdCheckmarkCircleOutline size={20} color="#008000"/> : <FaRegCircle size={15}  />} 
            </button>
            <p className="ml-4">{answer.answer}</p>
            </div>
            ) : (type == 'MoreAnswer') ? (
                <div className="flex">
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