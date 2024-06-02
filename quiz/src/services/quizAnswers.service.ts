import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove,push } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';
import { MyAnswers } from '../common/typeScriptDefinitions.ts';

export const createMyAnswers= (questionId: string, idQuiz: string, question: string, answers: MyAnswers[] ) => {

    return push(
        ref(db, 'quizAnswers'),
        {idQuiz,
        questionId,
        question,
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