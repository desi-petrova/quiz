import NewQuestions from '../../components/NewQuestions/NewQuestions.tsx';
import QuestionnairePreview from '../../components/QuestionnairePreview/QuestionnairePreview.tsx';




const NewQuestionnaire = () => {

   

    return (
        <div className="flex">
        <NewQuestions/> 
        <QuestionnairePreview/>   
        </div>
    )

}

export default NewQuestionnaire;