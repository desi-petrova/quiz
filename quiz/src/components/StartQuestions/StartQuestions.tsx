import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuestionsByQuestionnaireId } from '../../services/question.service';
import { Questions } from '../../common/typeScriptDefinitions';
import StartAnswers from '../StartAnswers/StartAnswers';
import Timer from '../Timer/Timer';


const StartQuestions = () => {

    const location = useLocation();
    const idQuestionnaire = location.state?.idQuestionnaire
    const questionnaireTitle = location.state?.title
    const questionnaireTime = location.state?.time 
    const navigate = useNavigate()

    const [questions, setQuestions] = useState<Questions[]>([])

    useEffect(() => {
        getQuestionsByQuestionnaireId(idQuestionnaire)
        .then(result => setQuestions(result))
        .catch(e => console.error(e))
    }, [])

    return (
        <div>
        <div className='flex justify-end'>
        <Timer timeQuestionnaire={questionnaireTime}/>
        </div>
        <h4 className='text-2xl text-center m-1'>{questionnaireTitle}</h4>

            {questions.map((question, indexQ) => {
                return(
                    <div key={indexQ}>
                         <p>{indexQ + 1}. {question.question}</p>
                    <StartAnswers questionId={question.id} type={question.type} />
                    </div>
                )
            })}
        </div>

    )
}

export default StartQuestions