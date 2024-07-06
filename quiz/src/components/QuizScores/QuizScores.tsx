import { useEffect, useState } from "react";
import { Quiz } from "../../common/typeScriptDefinitions";
import { getQuestionnaireByCompletedQuizzesId } from "../../services/questionnaire.service";
import { useLocation } from "react-router-dom";
import { getCompletedQuizId } from "../../services/completedQuiz.service";
import { getUserByHandle, getUserData } from "../../services/users.service";

const QuizScores = () => {

    const location = useLocation()
    const idQuestionnaire = location.state.idQuestionnaire;

    const [quizzes, setQuizzes] = useState<Quiz[]>([])

    useEffect(() => {
      getQuestionnaireByCompletedQuizzesId(idQuestionnaire)
      .then(idQuizzes => {
        Promise.all(
          idQuizzes.map((idQuiz: string) => {
            return getCompletedQuizId(idQuiz)
        }))
       .then(res => {
          return Promise.all(
            res.map(el => {
              return getUserByHandle(el.user)
                .then(user => {
                  if (!user.exists()) {
                    throw new Error(`User with handle ${user} does not exist!`);
                  }
    
                  const userResult = user.val();
                  const nameUser = userResult.firstName + ' ' + userResult.lastName;
    
                  return { ...el, user: nameUser };
                })
                .catch(e => {
                  console.error(e);
                });
            })
          );
        })
       .then(res => {
      const sortByScore = res.sort((a, b) => b.myTotalPoints - a.myTotalPoints)
      setQuizzes([...sortByScore])
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
        <h2 className="text-4xl text-center font-bold text-[#6B21A8] m-4"> Score:</h2>
        {quizzes.length > 0 && <h4 className="text-xl text-center font-bold text-[#6B21A8] m-3">{quizzes[0].title}</h4>}
        </div>
        
            <table className="table">
           {/* head */}
           <thead>
            <tr>
            <th>No</th>
            <th>Name</th>
            <th>Score</th>
            </tr>
            </thead>
             <tbody>
           {/* row 1 */}
           {quizzes.map((quiz, index) => {
            return (<tr key={index}>
              <th>{index + 1}</th>
              <td>{quiz.user}</td>
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

export default QuizScores;