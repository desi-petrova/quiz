import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove,push } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';
import { MyAnswers } from '../common/typeScriptDefinitions.ts';

export const createMyAnswers= (questionId: string, idQuiz: string, question: string, typeQuestion: string, answers: MyAnswers[] ) => {

    return push(
        ref(db, 'quizAnswers'),
        {idQuiz,
        questionId,
        question,
        typeQuestion,
        answers,
        },
    )
    .then(result => {
        if(result.key === null) return [];

        return getMyAnswerById(result.key); 
    })
    .catch(e => console.error(e))
}

export const getMyAnswerById = (id: string) => {
    return get(ref(db, `quizAnswers/${id}`))
      .then(result => {
        if (!result.exists()) {
          throw new Error(`Answer with id ${id} does not exist!`);
        }
        const answer = result.val();
        answer.id = id;
        answer.createdOn = new Date(answer.createdOn);
        return answer;
      })
      .catch(e => console.error(e));
  };

  export const updateMyAnswers = (idMyAnswers: string, answers: MyAnswers[]) => {
    return update(ref(db), { [`quizAnswers/${idMyAnswers}/answers/`]: answers})
}

export const getQuizAnswerByQuizIdAndQuestionId =(idQuiz: string, questionId: string) => {

  return get(query(ref(db,'quizAnswers'), orderByChild('idQuiz',), equalTo(idQuiz)))
         .then(snapshot => {
          if(!snapshot.exists) return null;

          console.log(snapshot)
        const answer = snapshot.val();
        if(answer == null) return null
          console.log(questionId)
        return Object.keys(answer).map(key => {
          const result = answer[key];
  
          return {
              ...answer[key],
              id: key,
              createdOn: new Date(result.createdOn),
          };
      }).filter(answer => answer.questionId === questionId) ;

         })
}