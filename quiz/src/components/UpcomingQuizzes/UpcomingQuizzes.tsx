import { useContext, useEffect, useState } from 'react';
import {getUserUpcomingQuizzesLive} from '../../services/users.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import { getQuestionnaireById } from '../../services/questionnaire.service.ts';
import { useNavigate } from 'react-router-dom';
import { Questionnaire } from '../../common/typeScriptDefinitions.ts';
import { FcOvertime } from 'react-icons/fc';
import { MdTimer, MdTimerOff } from 'react-icons/md';

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
        <h2 className="text-4xl text-center font-bold text-[#6B21A8]">U p c o m i n g &nbsp;&nbsp;&nbsp; q u i z z e s</h2>
        <div className='flex justify-end'>
        </div>
        <div className='flex'>
            {questionnaires.length > 0 && questionnaires.map(questionnaire => {
                return(
                <div key={questionnaire.id} className="card-questionnaire">
                    <div className="card-body ">
                    <h2 className="card-title justify-center">{questionnaire.title}</h2>
                    {questionnaire.time > 0 ? (<div className='flex'>
                    <span className='m-1'><MdTimer size={20} color={'#891177'} /></span> 
                    <p>{questionnaire.time} min</p>
                    </div>)
                     : <MdTimerOff size={20} color={'#891177'}/>}
                    {<FcOvertime />}
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