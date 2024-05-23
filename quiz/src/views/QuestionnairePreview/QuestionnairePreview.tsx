import { IdQuestionnaire } from "../../common/typeScriptDefinitions";
import QuestionDetails from "../../components/QuestionDetails/QuestionDetails";
import QuestionnaireDetails from "../../components/QuestionnaireDetails/QuestionnaireDetails";
import { useNavigate } from 'react-router-dom';

const QuestionnairePreview = ({idQuestionnaire}: IdQuestionnaire) => {
    const navigate = useNavigate();


    return ( 
        <div className="w-1/2 m-5">
        <QuestionnaireDetails idQuestionnaire={idQuestionnaire}/> 
        <QuestionDetails idQuestionnaire={idQuestionnaire} />
        <div className="flex justify-center">
        <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
        shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
        focus-visible:outline-purple-600 "
        onClick={() => navigate('/')}>Finnish</button>
        </div>
        </div>       
    )
}

export default QuestionnairePreview;