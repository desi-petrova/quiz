import { useContext, useEffect, useState } from "react";
import { Quiz } from "../../common/typeScriptDefinitions";
import { getQuestionnaireByCompletedQuizzesId } from "../../services/questionnaire.service";
import { getCompletedQuizId } from "../../services/completedQuiz.service";
import AppContext, { UserState } from "../../context/AppContext";
import { getUserCompletedQuizzesId } from "../../services/users.service";

const MyScores = () => {

  const { userData } = useContext<UserState>(AppContext);

    const [quizzes, setQuizzes] = useState<Quiz[]>([])

    useEffect(() => {

      if(userData == null) return 
      
      getUserCompletedQuizzesId(userData.handle)
      .then(idQuizzes => {
        Promise.all(
          idQuizzes.map((idQuiz: string) => {
            return getCompletedQuizId(idQuiz)
        }))
       .then(res => {
      setQuizzes([...res])
      })
       })
      .catch(e => console.error(e))


    }, [])


    return (
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/public/13104.jpg')] bg-cover bg-center ">
        <div className="relative z-10 w-4/5 mx-auto">
        <div className="overflow-x-auto w-3/5 mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div>
        <h2 className="text-4xl text-center font-bold text-[#6B21A8] m-4"> My score:</h2>
        </div>
            <table className="table">
           <thead>
            <tr>
            <th>No</th>
            <th>Name</th>
            <th>Score</th>
            </tr>
            </thead>
             <tbody>
           {quizzes.map((quiz, index) => {
            return (<tr key={index}>
              <th>{index + 1}</th>
              <td>{quiz.title}</td>
              <td>{quiz.myTotalPoints}</td>
              </tr>)
           }) }
      
            </tbody>
            </table>
        </div>
        </div>
        </div>
        </div>
    )
}

export default MyScores;