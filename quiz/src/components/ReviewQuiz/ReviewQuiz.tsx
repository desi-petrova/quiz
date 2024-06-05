import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Quiz } from '../../common/typeScriptDefinitions';
import { getCompletedQuizId } from '../../services/completedQuiz.service';
import QuizAnswer from '../QuizAnswer/QuizAnswer';
import AppContext, { UserState } from '../../context/AppContext';

const ReviewQuiz = () => {

    const { userData } = useContext<UserState>(AppContext);

    const location = useLocation();
    const idQuiz = location.state.idQuiz 

    const [quiz, setQuiz] = useState<Quiz>({})

    useEffect(() => {
        getCompletedQuizId(idQuiz)
        .then(result => {
            setQuiz(result)
            })
    }, [userData, idQuiz])

    return (
        <div className="w-3/5 mx-auto m-5">
            <h2 className='text-2xl text-center m-1'>{quiz.title}</h2>
            <div className="pl-4">
               {quiz.answers && quiz.answers.map((answer, indexQ) => {

                return (
                    <div key={indexQ}>
                        <QuizAnswer answerId={answer} num={indexQ}/>
                    </div> 
                )
            })} 
            </div>
            
        </div>
    )
}

export default ReviewQuiz;