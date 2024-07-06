import { useContext, useEffect, useState } from "react";
import { IdQuestionnaire, Questionnaire } from "../../common/typeScriptDefinitions";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { getQuestionnaireById, removeQuestionnaire } from "../../services/questionnaire.service";
import { removeAnswer } from "../../services/answers.service";
import { removeQuestion } from "../../services/question.service";
import { removeUserMyAnswers, removeUserMyQuestions, removeUserQuestionnaire, removeUserUpcomingQuizzes } from "../../services/users.service";
import AppContext, { UserState } from "../../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";


const RemoveQuestionnaire = ({idQuestionnaire}: IdQuestionnaire) => {
   
    const { userData } = useContext<UserState>(AppContext);
    const [visibleIconRemove, setVisibleIconRemove] = useState<boolean>(false)
    const [questionnaire, setQuestionnaires] = useState<Questionnaire>({}) 
    const navigate = useNavigate()

    useEffect (() => {
        getQuestionnaireById(idQuestionnaire)
        .then(res => setQuestionnaires(res))
    } , [])

    const open =() => {
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        modal?.showModal();
        }

    const remove = () => {

        if(userData  == null) return
        
        questionnaire.answers?.forEach(answerId =>{
            removeAnswer(answerId)
            removeUserMyAnswers(answerId, userData.handle) } )
        questionnaire.questions?.forEach(questionId => {
            removeQuestion(questionId)
            removeUserMyQuestions(questionId, userData.handle) } )
        removeQuestionnaire(questionnaire.id)
        if(questionnaire.upcomingQuizzes.length > 0){       
         questionnaire.upcomingQuizzes.forEach(handle  => removeUserUpcomingQuizzes(questionnaire.id, handle))
         console.log(1)
        }
        removeUserQuestionnaire(questionnaire.id, userData.handle)
        navigate('/') 
}

    return (
        <div>
            <button className="card-button" 
            onMouseEnter={() => setVisibleIconRemove(true)}
            onMouseLeave={() => setVisibleIconRemove(false)} 
            onClick={open}>
            {visibleIconRemove  ?  <MdDelete size={25}/> : <MdDeleteOutline size={25}/>}       
            </button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                <h3 className="font-bold text-lg">Remove questionnaire</h3>
                <p className="py-4">Are you sure you want to remove the questionnaire? 
                The questionnaire will also be deleted from the upcoming quizzes.
                Solved quizzes will remain in My scores</p>
                <div className="modal-action">
                <form method="dialog">
                <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
                shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                focus-visible:outline-purple-600"
                onClick={() => navigate('/')}
                >Close</button>
                <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
                shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                focus-visible:outline-purple-600" 
                onClick={remove}>Remove</button>
                </form>
                </div>
                </div>
                </dialog>
        </div>
    )
}

export default RemoveQuestionnaire;