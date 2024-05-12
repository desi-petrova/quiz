import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import OneAnswer from '../OneAnswer/OneAnswer';
import MoreAnswer from '../MoreAnswer/MoreAnswer';
import OpenAnswer from '../OpenAnswer/OpenAnswer';



const NewQuestions = () => {
    
    const [questionType, setQuestionType] = useState('');
    
    const location = useLocation();
    const idQuestion = location.state?.id

    const addQuestion = (field: string) => {
        setQuestionType(field);
    }

    const renderQuestion = () => {
        switch (questionType) {
            case 'oneAnswer':
                return <OneAnswer id={idQuestion}/>
            case 'moreAnswer':
                return <MoreAnswer id={idQuestion}/>
            case 'openAnswer':
                return <OpenAnswer id={idQuestion}/>
            default:
                return null; // If no button is clicked, or an unsupported button is clicked, return null
        }
    }

    return (
        <div className="w-1/2">
        <div className="flex justify-center m-2">
            <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
             onClick={() => addQuestion('oneAnswer')} 
             >
                Question with 1 answer</button>
            <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={() => addQuestion('moreAnswer')}
            >
                Question with 2 or more answer</button>
            <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={() => addQuestion('openAnswer')}
            >
                Question with open answer</button>
        </div>

        {renderQuestion()}
        </div>

    )
}

export default NewQuestions;