import { useContext, useEffect, useState } from 'react';
import {getUserUpcomingQuizzesLive} from '../../services/users.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import { getQuestionnaireById } from '../../services/questionnaire.service.ts';
import { useNavigate } from 'react-router-dom';
import { Questionnaire } from '../../common/typeScriptDefinitions.ts';

const UpcomingQuizzes = () => {

    const { userData } = useContext<UserState>(AppContext);
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
    const navigate = useNavigate();


    useEffect(() => {

        if(userData === null) {return}

        getUserUpcomingQuizzesLive(userData.handle, ((data: string[]) => {
            Promise.all(
                data.map((questionnaireId: string) => {
                    return getQuestionnaireById(questionnaireId)
                }))
            .then(questionnaireVal => setQuestionnaires([...questionnaireVal]))
            .catch(e => console.error(e));
        })
    )
      }, [userData])

      const start = (idQuestionnaire: string) => navigate('/startQuestionnaire', {state: {idQuestionnaire}})

    return(
        <div className='mt-8'>
        <h2 className='text-3xl text-center font-bold'>Upcoming quizzes</h2>
        <div className='flex justify-end'>
        </div>
        <div className='flex'>
            {questionnaires.length > 0 && questionnaires.map(questionnaire => {
                return(
                <div key={questionnaire.id} className="card-questionnaire">
                    <div className="card-body ">
                    <h2 className="card-title justify-center">{questionnaire.title}</h2>
                    <p>Time: {questionnaire.time}</p>
                    <button className="card-button hover:bg-purple-500  
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                    focus-visible:outline-purple-500"
                    onClick={() => start(questionnaire.id)}
                    >Start</button>
                      </div>
                    </div>                   
                )
            })
            }
        </div>
    </div>
    )
} 

export default UpcomingQuizzes;