import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove,push } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';

export const createQuestion = (question: string, type: string, idQuestionnaire: string ) => {

    return push(
        ref(db, 'questions'),
        {question,
        type,
        createOn: Date.now(),
        idQuestionnaire,
        },
    )
    .then(result => {
        if(result.key === null) return [];

        return getQuestionById(result.key); 
    })
    .catch(e => console.error(e))
}

export const getQuestionById = (id: string) => {
    return get(ref(db, `questions/${id}`))
      .then(result => {
        if (!result.exists()) {
          throw new Error(`Question with id ${id} does not exist!`);
        }
        const question = result.val();
        question.id = id;
        question.createdOn = new Date(question.createdOn);
        return question;
      })
      .catch(e => console.error(e));
  };

export const updateQuestionAnswers = (idQuestion: string, idAnswer: string) => {
    return update(ref(db), { [`questions/${idQuestion}/answers/${idAnswer}`]: true })
}