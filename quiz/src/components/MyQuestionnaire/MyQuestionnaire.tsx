import { useContext, useEffect, useState } from 'react';
import {getUserQuestionnaireLive} from '../../services/users.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import { getQuestionnaireById } from '../../services/questionnaire.service.ts';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Questionnaire } from '../../common/typeScriptDefinitions.ts';

const MyQuestionnaire = () => {

    const { userData } = useContext<UserState>(AppContext);
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
    const navigate = useNavigate();


    useEffect(() => {

        if(userData === null) {return}

        getUserQuestionnaireLive(userData.handle, ((data: string[]) => {
            Promise.all(
                data.map((questionnaireId: string) => {
                    return getQuestionnaireById(questionnaireId)
                }))
            .then(questionnaireVal => setQuestionnaires([...questionnaireVal]))
            .catch(e => console.error(e));
        })
    )
      }, [])

      const edit = (id: string) => navigate('/newQuestionnaire', {state: {id}})
      const start= (idQuestionnaire: string) => navigate('/startQuestionnaire', {state: {idQuestionnaire}})

    return (
    <div>
        <h2 className="justify-center">My Questionnaires</h2>
        <div>
        <button
            className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={() => navigate('/questionnaireForm')}>
                New questionnaire
            </button>
        </div>
        <div className='flex'>
            {questionnaires.length > 0 && questionnaires.map(questionnaire => {
                return(
                <div key={questionnaire.id} className="card-questionnaire">
                    <div className="card-body ">
                    <h2 className="card-title justify-center">{questionnaire.title}</h2>
                    <p>Time: {questionnaire.time}</p>
                    <button className="card-button hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-purple-600"
                        onClick={() => start(questionnaire.id)}
                      >Start</button>
                      <div className="card-actions justify-end">
                      <button className="card-button hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-purple-600"
                        onClick={() => edit(questionnaire.id)}
                      ><CiEdit size={25}/></button>
                      <button className="card-button hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-purple-600"
                        onClick={() => edit(questionnaire.id)}
                      ><MdDelete size={25}/> </button>
                      </div>
                      </div>
                    </div>                   
                )
            })
            }
        </div>
    </div>
        
        

    )
}

export default MyQuestionnaire;