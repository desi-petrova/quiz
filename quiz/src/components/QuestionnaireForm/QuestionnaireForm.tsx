import { useState } from 'react';
import {createQuestionnaire} from '../../services/questionnaire.service';
import AppContext, { UserState } from '../../context/AppContext';
import { useContext } from 'react';
import {MSG_FIELD_REQUIRED} from '../../common/constant.ts';
import {updateUserQuestionnaires} from '../../services/users.service.ts';
import { useNavigate } from 'react-router-dom';
import {Questionnaire} from '../../common/typeScriptDefinitions.ts'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export const QuestionnaireForm = () => {

    const { userData } = useContext<UserState>(AppContext);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
        id: '',
        title: '',
        description: '',
        time: 0,
        status: 'public',
        background: '',
        picture: '',
    });
    const navigate = useNavigate();

    const [error, setError] = useState<boolean>(false)

    const updateQuestionnaires = (field: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) =>{
        setQuestionnaire({
            ...questionnaire,
            [field]: e.target.value
        })
    }

    const saveQuestionnaire = () => {
        if(!questionnaire.title) return setError(true);

        if(userData === null) return "User is not login!"

        createQuestionnaire(questionnaire.title, 
            questionnaire.description, 
            userData.handle, 
            questionnaire.time,
            questionnaire.status,
            questionnaire.background,
            questionnaire.picture)
        .then(result => {
            setQuestionnaire({ 
            id: '',       
            title: '',
            description: '',
            time: 0,
            status: 'public',
            background: '',
            picture: '',
            })

            updateUserQuestionnaires(result.id, userData.handle)
            .catch(e => console.error(e))     
            
            return result.id
        })
        .then(id => navigate('/newQuestionnaire', {state: {id}}))
        .catch(e => console.error(e)) 
    }

    return (
        // <div className='isolate bg-white px-6 py-24 sm:py-32 lg:px-8 w-1/2'>
        <div className="w-1/2  bg-white" >
        <div className="m-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Create Questionnaire</h2>
        </div>
         <div>
         <div className="m-2.5">
            <input 
        placeholder="Write title of questionnaire..."
        value={questionnaire.title}
        className={`input input-bordered w-full
        ${error ? 'input-error' : 'input-warning'}`}
        onChange={updateQuestionnaires('title')}/>
        {error && <p className="text-red-500"> {MSG_FIELD_REQUIRED}</p>}
         </div>
         <div className="m-2.5">
        <ReactQuill
            theme="snow"
            value={questionnaire.description}
            placeholder="Write your description here..."
            onChange={(_, delta, source, editor) => {

              const data = editor.getHTML();
              return setQuestionnaire({ ...questionnaire, description: data });
            }}
          />
         </div>
         <div className="flex m-2.5 ">
            <p className='text-center'>Time: &nbsp;</p>
          <input 
          value={questionnaire.time}
          className="w-1/5 border border-yellow-400 rounded px-2" 
          onChange={updateQuestionnaires('time')} />
          <p>&nbsp; min</p>
         </div>
         <div className='m-2.5'>
           <select 
         className="select w-full select-warning"
         value={questionnaire.status}
         onChange={updateQuestionnaires('status')}>
            <option value='public' >Public</option>
            <option value='private' >Private</option>
          </select> 
         </div>
         
        
        <div className='flex justify-center'>
            <button 
            className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
            shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-purple-600"
            onClick={saveQuestionnaire}>Save</button>
        </div>
        </div>
        </div>
        )
}

export default QuestionnaireForm;