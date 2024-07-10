import { useContext, useEffect, useState } from 'react';
import {getQuestionnaireById, getQuestionnaireTotalPointsLive, updateQuestionnaireDescription, updateQuestionnaireStatus, updateQuestionnaireTime, updateQuestionnaireTitle} from '../../services/questionnaire.service.ts'
import AppContext, { UserState } from '../../context/AppContext';
import {IdQuestionnaire, Questionnaire } from '../../common/typeScriptDefinitions.ts';
import parse from 'html-react-parser';
import { RiEdit2Fill, RiEdit2Line } from 'react-icons/ri';
import ReactQuill from 'react-quill';
import { MAX_CONTEXT_LENGTH, MSG_CONTEXT_LENGTH, MSG_FIELD_REQUIRED } from '../../common/constant.ts';


const QuestionnaireDetails = ({idQuestionnaire}: IdQuestionnaire) => {
    const { userData } = useContext<UserState>(AppContext);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({})
    const [totalPoints, setTotalPoints] = useState<number>(0)
    const [visibleIconEdit, setVisibleIconEdit] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [errorContext, setErrorContext] = useState<boolean>(false);
    const [lengthContext, setLengthContext] = useState<number>(0)


    useEffect(() => {
        getQuestionnaireById(idQuestionnaire)
        .then(res => {
            setQuestionnaire(res);
          })
        .catch(e => console.error(e));

      }, [idQuestionnaire, userData])

    useEffect(() => {
      getQuestionnaireTotalPointsLive(idQuestionnaire, (data: number) => setTotalPoints(data))
    },[idQuestionnaire, userData])

    const updateQuestionnaires = (field: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) =>{
      setQuestionnaire({
          ...questionnaire,
          [field]: e.target.value
      })
  }
  
    const updateQuestionnaire = () => {
      if(!questionnaire.title) return setError(true);
      if(lengthContext > MAX_CONTEXT_LENGTH) return setErrorContext(true);

      updateQuestionnaireTitle(questionnaire.id, questionnaire.title)
      updateQuestionnaireDescription(questionnaire.id, questionnaire.description)
      updateQuestionnaireTime(questionnaire.id, questionnaire.time)
      updateQuestionnaireStatus(questionnaire.id, questionnaire.status)
      setIsEdit(false)
      setVisibleIconEdit(false)
    }

    return (
        <div className="w-full">
        <h2 className="text-2xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl w-full px-6 py-5  ">Preview</h2>
        {isEdit ? (<div>
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
              const length = editor.getText();
              return setQuestionnaire({ ...questionnaire, description: data }),setLengthContext(length.length - 1);
            }}
          />
          <div className="flex justify-end">
            {lengthContext <= MAX_CONTEXT_LENGTH ? <p className='text-xs'>Symbols: {lengthContext}</p> : 
            <p className="text-red-500 text-xs "> Symbols: {lengthContext}</p>}
          </div>
          <div>
              {errorContext && <p className="text-red-500"> {MSG_CONTEXT_LENGTH}</p>}
          </div>
         </div>
         <div className="flex m-2.5 ">
            <p className='text-center'>Time: &nbsp;</p>
          <input 
          value={questionnaire.time}
          className="text-right w-[50px] border border-yellow-400 rounded px-2 
          focus-visible:outline-none focus:ring-2 focus:ring-yellow-400"
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
            onClick={updateQuestionnaire}>Update</button>
        </div>

        </div>
        </div>)
          : (
        <div>
        <div className='pl-4'>
        <h4 className='text-2xl text-center m-3 '>{questionnaire.title}</h4>
        {questionnaire.description && <div>{parse(questionnaire.description)}</div>}
        <p className="m-1 px-2">Time: {questionnaire.time}</p>
        <p className="m-1 px-2">Status: {questionnaire.status}</p>
        <p className="m-1 px-2">Total points: {totalPoints}</p>
        </div>  
        <div className='flex justify-end m-4'>
        <button className="card-button" 
        onMouseEnter={() => setVisibleIconEdit(true)}
        onMouseLeave={() => setVisibleIconEdit(false)}
        onClick={() => setIsEdit(true)}
        >
        {visibleIconEdit  ?  <RiEdit2Fill size={25} /> : <RiEdit2Line size={25}/>} 
        </button>
        </div>     
        </div> 
        
          )}
        </div>
    )
}

export default QuestionnaireDetails