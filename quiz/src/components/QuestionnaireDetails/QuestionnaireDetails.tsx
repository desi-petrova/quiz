import { useContext, useEffect, useState } from 'react';
import {getQuestionnaireById} from '../../services/questionnaire.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import {IdQuestionnaire, Questionnaire } from '../../common/typeScriptDefinitions.ts'

const QuestionnaireDetails = ({idQuestionnaire}: IdQuestionnaire) => {
    const { userData } = useContext<UserState>(AppContext);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({})

    useEffect(() => {
        getQuestionnaireById(idQuestionnaire)
        .then(res => {
            setQuestionnaire(res);
          })
        .catch(e => console.error(e));

      }, [idQuestionnaire, userData])
     
    return (
        <div className="w-full">
        <h2 className="text-2xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl w-full px-6 py-5  ">Preview</h2>
        <div className='pl-4'>
        <h4 className='text-2xl text-center m-1'>{questionnaire.title}</h4>
        <p className="m-1 px-2">{questionnaire.description}</p>
        <p className="m-1 px-2">Time: {questionnaire.time}</p>
        <p className="m-1 px-2">Status: {questionnaire.status}</p>
        </div>       
        </div> 
    )
}

export default QuestionnaireDetails