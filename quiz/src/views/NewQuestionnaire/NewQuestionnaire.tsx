import NewQuestions from '../../components/NewQuestions/NewQuestions.tsx';
import QuestionnairePreview from '../QuestionnairePreview/QuestionnairePreview.tsx';
import { useLocation } from 'react-router-dom';


const NewQuestionnaire = () => {

    const location = useLocation();
    const idQuestionnaire = location.state?.id   

    return (
        <div className="flex">
        <NewQuestions idQuestionnaire={idQuestionnaire}/> 
        <QuestionnairePreview idQuestionnaire={idQuestionnaire}/>   
        </div>
    )

}

export default NewQuestionnaire;