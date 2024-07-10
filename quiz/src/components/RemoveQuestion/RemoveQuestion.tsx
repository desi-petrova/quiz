import { useContext, useEffect, useState } from "react";
import { Questions, RemoveQuestionProps } from "../../common/typeScriptDefinitions";
import { getQuestionById, removeQuestion } from "../../services/question.service";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { removeAnswer } from "../../services/answers.service";
import { removeUserMyAnswers, removeUserMyQuestions } from "../../services/users.service";
import AppContext, { UserState } from "../../context/AppContext";
import { removeQuestionnaireAnswer, removeQuestionnaireQuestion } from "../../services/questionnaire.service";

const RemoveQuestion = ({idQuestion, onRemove} : RemoveQuestionProps) => {

    const [visibleIconRemove, setVisibleIconRemove] = useState<boolean>(false)
    const [question, setQuestion] = useState <Questions>({})
    const {userData} = useContext<UserState>(AppContext)

    useEffect(() => {
        getQuestionById(idQuestion)
        .then(res => setQuestion(res))
    }, [])

    const remove = () =>{
        if(userData == null) return
        question.answers.forEach(answer => {
         removeAnswer(answer)   
         removeUserMyAnswers(answer, userData.handle)
         removeQuestionnaireAnswer(question.idQuestionnaire, answer)
        })
        removeQuestionnaireQuestion(question.idQuestionnaire, question.id)
        removeQuestion(question.id)
        removeUserMyQuestions(question.id, userData.handle)
        onRemove(question.id)
    } 

    return(
        <div className="m-1">
            <button className="card-button" 
            onMouseEnter={() => setVisibleIconRemove(true)}
            onMouseLeave={() => setVisibleIconRemove(false)}
            onClick={remove} 
            >
            {visibleIconRemove  ?  <MdDelete size={25}/> : <MdDeleteOutline size={25}/>}       
            </button> 
        </div>

    )
}

export default RemoveQuestion;