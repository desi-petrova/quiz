import { useContext, useEffect, useState } from 'react';
import {getQuestionnaireById, getQuestionnaireTotalPointsLive} from '../../services/questionnaire.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import {IdQuestionnaire, Questionnaire } from '../../common/typeScriptDefinitions.ts';
import parse from 'html-react-parser';


const QuestionnaireDetails = ({idQuestionnaire}: IdQuestionnaire) => {
    const { userData } = useContext<UserState>(AppContext);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({})
    const [totalPoints, setTotalPoints] = useState<number>(0)
    

    useEffect(() => {
        getQuestionnaireById(idQuestionnaire)
        .then(res => {
            setQuestionnaire(res);
          })
        .catch(e => console.error(e));

      }, [idQuestionnaire, userData])

    useEffect(() => {
      getQuestionnaireTotalPointsLive(idQuestionnaire, (data: number) => setTotalPoints(data))
    },[idQuestionnaire, userData])

     
    return (
        <div className="w-full">
        <h2 className="text-2xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl w-full px-6 py-5  ">Preview</h2>
        <div className='pl-4'>
        <h4 className='text-2xl text-center m-1'>{questionnaire.title}</h4>
        {questionnaire.description && <p className="m-1 px-2">{parse(questionnaire.description)}</p>}
        <p className="m-1 px-2">Time: {questionnaire.time}</p>
        <p className="m-1 px-2">Status: {questionnaire.status}</p>
        <p className="m-1 px-2">Total points: {totalPoints}</p>
        </div>       
        </div> 
    )
}

export default QuestionnaireDetails