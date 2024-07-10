import { useState } from 'react';
import OneAnswer from '../OneAnswer/OneAnswer';
import MoreAnswer from '../MoreAnswer/MoreAnswer';
import OpenAnswer from '../OpenAnswer/OpenAnswer';
import { IdQuestionnaire } from '../../common/typeScriptDefinitions';

const NewQuestions = ({idQuestionnaire}: IdQuestionnaire) => {
    
    const [questionType, setQuestionType] = useState('');

    const addQuestion = (field: string) => {
        setQuestionType(field);
    }

    const renderQuestion = () => {
        switch (questionType) {
            case 'oneAnswer':
                return <OneAnswer idQuestionnaire={idQuestionnaire} />
            case 'moreAnswer':
                return <MoreAnswer idQuestionnaire={idQuestionnaire} />
            case 'openAnswer':
                return <OpenAnswer idQuestionnaire={idQuestionnaire} />
            default:
                return null; 
        }
    }

    return (
        <div className="w-1/2 mt-10">
        <div className="flex justify-center m-2 ">
            <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
             onClick={() => addQuestion('oneAnswer')} 
             >
                Question with 1 answer</button>
            <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
            onClick={() => addQuestion('moreAnswer')}
            >
                Question with 2 or more answer</button>
            <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => addQuestion('openAnswer')}
            >
                Question with open answer</button>
        </div>

        {renderQuestion()}
        </div>

    )
}

export default NewQuestions;