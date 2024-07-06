import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchUsers from "../SearchUsers/SearchUsers";
import UsersList from "../UsersList/UsersList";
import { IdQuestionnaire } from "../../common/typeScriptDefinitions";
import { RiMailSendFill, RiMailSendLine } from "react-icons/ri";
import { updateUserUpcomingQuizzes } from "../../services/users.service";
import { updateQuestionnaireUpcomingQuizzes } from "../../services/questionnaire.service";


const SendQuiz = ({idQuestionnaire}: IdQuestionnaire) => {

    // const location = useLocation();
    // const idQuestionnaire = location.state.idQuestionnaire 
    // const navigate = useNavigate()
    const [newUsers, setNewUsers] = useState<{[handle: string]: boolean}>({})
    const [visibleIconSend, setVisibleIconSend] = useState<boolean>(false)

    const updateNewUsers = (user: string) => {
        console.log(user)
        setNewUsers({
            ...newUsers,
            [user]: true
        })

    }

    const send = () => {
        if(Object.keys(newUsers).length > 0){
        Object.keys(newUsers).forEach(user => {
            updateUserUpcomingQuizzes(user, idQuestionnaire)
            updateQuestionnaireUpcomingQuizzes(idQuestionnaire, user)            
            .catch(e => console.log(e))

            setNewUsers({})
        })
        }
    }

    const open =() => {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    modal?.showModal();
    }

    return(
        <div>
            <button className="card-button" 
            onMouseEnter={() => setVisibleIconSend(true)}
            onMouseLeave={() => setVisibleIconSend(false)} 
            onClick={open}>
            {visibleIconSend ?  <RiMailSendFill size={24} /> : <RiMailSendLine size={24}/>}
            </button>
            <dialog id="my_modal_2" className="modal">
               <div className="modal-box">
               <SearchUsers updateNewUsers={updateNewUsers}/>
               <div className="scrollbar my-5 mr-5 "> 
              {Object.keys(newUsers).length > 0 && Object.keys(newUsers).map(user => <UsersList key={user} handle={user} /> )} 
               </div>
                <div className="modal-action">
                 <form method="dialog">
                 <button className="block m-3 rounded-md bg-purple-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white 
                         shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                         focus-visible:outline-purple-600"
                        onClick={send}
                        >Send</button>
                 </form>
                </div>
               </div>
            </dialog>
        </div>
    )
} 

export default SendQuiz