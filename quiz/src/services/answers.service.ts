import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove,push } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';

export const createAnswers= (questionId: string, answer: string, wrong: boolean ) => {

    return push(
        ref(db, 'answers'),
        {questionId,
        answer,
        wrong,
        createOn: Date.now(),
        },
    )
    .then(result => {
        if(result.key === null) return [];

        return getAnswerById(result.key); 
    })
    .catch(e => console.error(e))
}

export const getAnswerById = (id: string) => {
    return get(ref(db, `answers/${id}`))
      .then(result => {
        if (!result.exists()) {
          throw new Error(`Question with id ${id} does not exist!`);
        }
        const answer = result.val();
        answer.id = id;
        answer.createdOn = new Date(answer.createdOn);
        return answer;
      })
      .catch(e => console.error(e));
  };