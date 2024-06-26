import { useEffect, useState } from 'react';
import { getMyAnswerById } from '../../services/quizAnswers.service';
import { QuizMyAnswer } from '../../common/typeScriptDefinitions';
import { IoMdCheckboxOutline, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaRegCircle, FaRegCircleXmark, FaRegSquare } from 'react-icons/fa6';
import { FiXSquare } from "react-icons/fi";
import { FcCheckmark } from 'react-icons/fc';


interface QuizAnswer{
    answerId: string,
    num: number,
}

const QuizAnswer = ({answerId, num}: QuizAnswer) => {

    const [quizAnswer, setQuizAnswer] = useState<QuizMyAnswer>({})

    useEffect(() => {
        getMyAnswerById(answerId)
        .then(result => setQuizAnswer(result))
    },[])

    return (
        <div className='pl-4'>
            <p className="m-1">{num + 1}. {quizAnswer.question}</p>
            <p className='text-right text-green-500 font-bold'>{quizAnswer.myPoints}/{quizAnswer.points}</p>
            {quizAnswer.answers && quizAnswer.answers.map((myAnswer, index) => {
                return (
                    <div key={index} className="m-5">
                        {quizAnswer.typeQuestion == 'oneAnswer' ? (
                            <div className='flex'>
                                <div className='m-1 pt-0.5'>{myAnswer.myAnswer == true && myAnswer.wrong == false ? 
                                <IoMdCheckmarkCircleOutline size={17} color="#008000"/> :
                                myAnswer.myAnswer == true && myAnswer.wrong == true ?
                                <FaRegCircleXmark size={17} color="#d90429" /> : <FaRegCircle size={12}  />}</div>
                                
                                <p>{myAnswer.answer}</p>
                                <div className='ml-2'>{ myAnswer.wrong == false && <FcCheckmark size={24} />}</div>
                                
                            </div>
                        ) : quizAnswer.typeQuestion == 'MoreAnswer' ? (
                            <div className='flex'>
                                <div className='m-1 pt-0.5'>{myAnswer.myAnswer == true && myAnswer.wrong == false ? 
                            <IoMdCheckboxOutline size={17} color="#008000"/> :
                            myAnswer.myAnswer == true && myAnswer.wrong == true ?
                            <FiXSquare size={17} color="#d90429" /> : <FaRegSquare size={12}  />}</div>
                            
                            <p>{myAnswer.answer}</p>
                            <div className='ml-2'>{ myAnswer.wrong == false && <FcCheckmark size={24} />}</div>
                            
                        </div> 
                        ) : quizAnswer.typeQuestion == 'openAnswer' ? (
                            <div>
                                {myAnswer.myOpenAnswer === myAnswer.answer ? 
                                (<p className="flex">{myAnswer.myOpenAnswer}&nbsp;&nbsp;<FcCheckmark size={24} /></p>) :
                                 (<div>
                                    <p>{myAnswer.myOpenAnswer}</p>
                                    <p>The correct answer is: {myAnswer.answer}</p>
                                 </div>)}
                            </div>
                        ): '' }
                    </div>
            )})}
        </div>
    )
}

export default QuizAnswer;