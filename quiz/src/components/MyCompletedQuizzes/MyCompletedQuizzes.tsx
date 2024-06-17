import { useContext, useEffect, useState } from 'react';
import {getUserCompletedQuizzesLive, getUserUpcomingQuizzesLive} from '../../services/users.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import { getQuestionnaireById } from '../../services/questionnaire.service.ts';
import { useNavigate } from 'react-router-dom';
import { Questionnaire } from '../../common/typeScriptDefinitions.ts';
import { FcOvertime } from 'react-icons/fc';
import { MdTimer, MdTimerOff } from 'react-icons/md';
import { getCompletedQuizId } from '../../services/completedQuiz.service.ts';

const MyCompletedQuizzes = () => {

    const { userData } = useContext<UserState>(AppContext);
    const [quizzesId, setQuizzesId] = useState<Questionnaire[]>([])
    const navigate = useNavigate();


    useEffect(() => {

        if(userData === null) {return}

        getUserCompletedQuizzesLive(userData.handle, ((data: string[]) => {
            Promise.all(
                data.map((questionnaireId: string) => {
                    return getCompletedQuizId(questionnaireId)
                }))
            .then(questionnaireVal => setQuizzesId([...questionnaireVal]))
            .catch(e => console.error(e));
        })
    )
      }, [userData])

      const review = (idQuiz: string) => navigate('/reviewQuiz', {state: {idQuiz}})

    return (
        <div>
            {quizzesId.length > 0 && <h2 
        className="text-4xl text-center font-bold text-[#6B21A8]">
           M y &nbsp;&nbsp;&nbsp; c o m p l e t e d &nbsp;&nbsp;&nbsp; q u i z z e s</h2>}
        <div className='flex justify-end'>
        </div>
        <div className='flex'>
            {quizzesId.length > 0 && quizzesId.map(quizId => {
                return(
                <div key={quizId.id} className="card-questionnaire">
                    <div className="card-body ">
                    <h2 className="card-title justify-center">{quizId.title}</h2>
                    <button className="card-button hover:bg-purple-500  
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                    focus-visible:outline-purple-500"
                    onClick={() => review(quizId.id)}
                    >Review</button>
                      </div>
                    </div>                   
                )
            })
            }
        </div>
        </div>
    )
}

export default MyCompletedQuizzes;