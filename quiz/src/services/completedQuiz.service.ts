import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove,push } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';

export const createCompletedQuiz = (idQuestionnaire: string, title: string, handle: string, background: string) => {

    return push(
        ref(db, 'completedQuiz'),
        {idQuestionnaire,
         title,   
         user: handle,
         createOn: Date.now(),
         background,
        },
    )
    .then(result => {
        if(result.key === null) return [];
        return getCompletedQuizId(result.key); 
    })
    .catch(e => console.error(e))
}

export const getCompletedQuizId = (id: string) => {
    return get(ref(db, `completedQuiz/${id}`))
      .then(result => {
        if (!result.exists()) {
          throw new Error(`Quiz with id ${id} does not exist!`);
        }
        const quiz = result.val();
        quiz.id = id;
        quiz.createdOn = new Date(quiz.createdOn);

        if(quiz.answers){
          quiz.answers = Object.keys(quiz.answers)
        } else {
          quiz.answers = []
        }
        return quiz;
      })
      .catch(e => console.error(e))
  };

export const updateQuizAnswers = (idQuiz: string, idQuizAnswers: string ) => {
    return update(ref(db), { [`completedQuiz/${idQuiz}/answers/${idQuizAnswers}`]: true})
}