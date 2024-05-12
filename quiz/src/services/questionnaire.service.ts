import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove,push } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';

export const createQuestionnaire = (title: string, description: string, handle: string, time: number, status: string, background: string, picture: string) => {

    return push(
        ref(db, 'questionnaires'),
        {title,
         description,   
         owner: handle,
         createOn: Date.now(),
         time,
         status,
         background,
         picture,
        },
    )
    .then(result => {
        if(result.key === null) return [];

        return getQuestionnaireById(result.key); 
    })
    .catch(e => console.error(e))
}

export const getQuestionnaireById = (id: string) => {
    return get(ref(db, `questionnaires/${id}`))
      .then(result => {
        if (!result.exists()) {
          throw new Error(`Questionnaire with id ${id} does not exist!`);
        }
        const questionnaire = result.val();
        questionnaire.id = id;
        questionnaire.createdOn = new Date(questionnaire.createdOn);
        return questionnaire;
      });
  };