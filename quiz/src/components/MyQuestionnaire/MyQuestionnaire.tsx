import { useContext, useEffect, useState } from 'react';
import {getUserQuestionnaireLive} from '../../services/users.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import { getQuestionnaireById } from '../../services/questionnaire.service.ts';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdTimer, MdTimerOff } from "react-icons/md";
import { Questionnaire, VisibleIcon } from '../../common/typeScriptDefinitions.ts';
import { RiEdit2Fill, RiEdit2Line } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import SendQuiz from '../SendQuiz/SendQuiz.tsx';


const MyQuestionnaire = () => {

    const { userData } = useContext<UserState>(AppContext);
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
    const navigate = useNavigate();
    const [visibleIcon, setVisibleIcon] = useState<VisibleIcon>({
        edit: false,
        delete: false,
        questionnaireId: '',
    })


    useEffect(() => {

        if(userData === null) {return}

        getUserQuestionnaireLive(userData.handle, ((data: string[]) => {
            Promise.all(
                data.map((questionnaireId: string) => {
                    return getQuestionnaireById(questionnaireId)
                }))
            .then(questionnaireVal => setQuestionnaires([...questionnaireVal.reverse()]))
            .catch(e => console.error(e));
        })
    )
      }, [userData])

      const edit = (id: string) => navigate('/newQuestionnaire', {state: {id}})
      const start= (idQuestionnaire: string) => navigate('/startQuestionnaire', {state: {idQuestionnaire}})

      const onSeeColor = (field: string, id: string) => {
        setVisibleIcon({
            ...visibleIcon,
            [field]: true,
            questionnaireId: id,
        })
      }

      const onHideColor = (field: string,) => {
        setVisibleIcon({
            ...visibleIcon,
            [field]: false,
            questionnaireId: ''
        })
      }

    return (
    <div>
        <h2 className="text-4xl text-center font-bold text-[#6B21A8]">M y &nbsp;&nbsp;&nbsp; Q u e s t i o n n a i r e s</h2>
        <div className='flex justify-end'>
        <button
            className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
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
                    <h2 className="card-title justify-center ">{questionnaire.title}</h2>
                    {questionnaire.time > 0 ? (<div className='flex'>
                    <span className='m-1'><MdTimer size={20} color={'#891177'} /></span> 
                    <p>{questionnaire.time} min</p>
                    </div>)
                     : <MdTimerOff size={20} color={'#891177'}/>}
                    <button className="card-button hover:bg-purple-500  
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                    focus-visible:outline-purple-500"
                    onClick={() => start(questionnaire.id)}
                    >Start</button>
                      <div className="card-actions justify-end m-2">
                      <SendQuiz idQuestionnaire={questionnaire.id} />
                      <button className="card-button" 
                        onMouseEnter={() => onSeeColor('edit', questionnaire.id)}
                        onMouseLeave={() => onHideColor('edit')}
                        onClick={() => edit(questionnaire.id)}>
                        {(visibleIcon.edit && visibleIcon.questionnaireId ==questionnaire.id) ?  <RiEdit2Fill size={25} /> : <RiEdit2Line size={25}/>} 
                        </button>
                      <button className="card-button"
                      onMouseEnter={() => onSeeColor('delete', questionnaire.id)}
                      onMouseLeave={() => onHideColor('delete')}
                      onClick={() => edit(questionnaire.id)}
                      >{(visibleIcon.delete && visibleIcon.questionnaireId ==questionnaire.id) ?  <MdDelete size={25}/> : <MdDeleteOutline size={25}/>}
                      </button>
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