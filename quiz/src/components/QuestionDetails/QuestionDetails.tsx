import { useContext, useEffect, useState } from 'react';
import { getQuestionnaireQuestionsLive} from '../../services/questionnaire.service.ts'
import { getQuestionById } from '../../services/question.service.ts';
import AppContext, { UserState } from '../../context/AppContext';
import {IdQuestionnaire, Questions } from '../../common/typeScriptDefinitions.ts'
import Answers from '../Answers/Answers.tsx';
import RemoveQuestion from '../RemoveQuestion/RemoveQuestion.tsx';
import { RiEdit2Fill, RiEdit2Line } from 'react-icons/ri';
import OneAnswer from '../OneAnswer/OneAnswer.tsx';
import MoreAnswers from '../MoreAnswer/MoreAnswer.tsx';
import OpenAnswer from '../OpenAnswer/OpenAnswer.tsx';


const QuestionDetails = ({idQuestionnaire}: IdQuestionnaire) => {

    const { userData } = useContext<UserState>(AppContext);
    const [questions, setQuestions] = useState <Questions[]>([])
    const [visibleIconEdit, setVisibleIconEdit] = useState<{edit: boolean, id: string}>({
        edit: false,
        id: '',
    })
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isVisibleId, setIsVisibleId] = useState<string>('')


    useEffect(() => {
        getQuestionnaireQuestionsLive(idQuestionnaire, ((data: string[]) => {
            Promise.all(
                data.map((questionId: string) => {
                    return getQuestionById(questionId)
                }))
            .then(questionVal => setQuestions([...questionVal]))
            .catch(e => console.error(e));
            
        })) 
      }, [idQuestionnaire])

      const removeQuestionId = (removedQuestionId: string) => {
        setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== removedQuestionId));
      }

      const renderQuestion = (type: string, answers: string[], idQuestion: string, question: string, points: number) => {
        switch (type) {
            case 'oneAnswer':
                return <OneAnswer idQuestionnaire={idQuestionnaire} idAnswers={answers} idQuestion={idQuestion} question={question} points={points} onEdit={onEdit}/>
            case 'moreAnswer':
                return <MoreAnswers idQuestionnaire={idQuestionnaire} idAnswers={answers} idQuestion={idQuestion} question={question} points={points} onEdit={onEdit}/>
            case 'openAnswer':
                return <OpenAnswer idQuestionnaire={idQuestionnaire} idAnswers={answers} idQuestion={idQuestion} question={question} points={points} onEdit={onEdit}/>
            default:
                return null; 
        }
    }

    const edit = (id: string) => {
        setIsEdit(true)
        setIsVisibleId(id)
    }

    const onEdit = (isEdit: boolean) => {
        setIsEdit(isEdit)
    }

    console.log(isEdit)
    return (
        <div className="w-full pl-5">
        {questions.map((question,indexQ) => {
            return(
                <div key={indexQ} className="m-3">
                    {(isEdit && question.id == isVisibleId) ? 
                    (<div>{renderQuestion(question.type, question.answers, question.id,question.question, question.points)}</div>)
                    : (<div >
                    <p>{indexQ + 1}. {question.question}</p>
                    <p className='text-right'>Points: {question.points}</p>
                    <Answers questionId={question.id} show={true}/>
                <div className="flex m-2 justify-end">
                <button className="card-button" 
                onMouseEnter={() => setVisibleIconEdit({edit: true, id: question.id})}
                onMouseLeave={() => setVisibleIconEdit({edit: false, id: ''})}
                onClick={() => edit(question.id)}
                >
                {visibleIconEdit.edit && visibleIconEdit.id == question.id ?  <RiEdit2Fill size={25} /> : <RiEdit2Line size={25}/>} 
                </button>
                <RemoveQuestion idQuestion={question.id} onRemove={removeQuestionId}/> 
                </div>
                </div>)
                }
                </div>       
            )
        })} 
        </div>
    )
}

export default QuestionDetails;