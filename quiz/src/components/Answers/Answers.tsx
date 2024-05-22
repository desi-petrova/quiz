import AppContext, { UserState } from '../../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { getQuestionAnswersLive } from '../../services/question.service';
import { getAnswerById } from '../../services/answers.service';
import { FcCheckmark } from "react-icons/fc";
import { FaRegCircle } from "react-icons/fa6";
import { shuffleArray } from '../../common/functions';


interface AnswersProp {
    questionId: string,
    show: boolean
}

export interface Answers {
    questionId: string, 
    answer: string, 
    wrong: boolean,
}

const Answers = ({questionId, show}: AnswersProp) => {
    const { userData } = useContext<UserState>(AppContext);
    const [answers, setAnswers] = useState<Answers[]>([]);
  

    useEffect(()=> {
        getQuestionAnswersLive(questionId, (data: string[]) => {
            console.log(data)
            Promise.all(
                data.map((answerId: string) => {
                    return getAnswerById(answerId)
                }))
            .then(answersVal => {
                const shuffledAnswers = shuffleArray(answersVal);
                setAnswers([...shuffledAnswers]);
            })
            .catch(e => console.error(e));
        })


    }, [userData])

    return (
        <div>
        {answers.map((answer, indexAnswer) => {
        return(
            <label key={indexAnswer} className = "flex m-1">
            <div className="pt-1">
                {<FaRegCircle size={15} />}
            </div>
            
            <p className="ml-4">{answer.answer}</p>
            <div className="ml-2">
                {!answer.wrong && show && <FcCheckmark size={24} />}
            </div>
            
            </label>
        )})}
        </div>
    )
}

export default Answers;