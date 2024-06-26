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
         totalPoints: 0,
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
        if(questionnaire.questions){
          questionnaire.questions = Object.keys(questionnaire.questions)
        } else {
          questionnaire.questions = []
        }

        if(questionnaire.answers){
          questionnaire.answers = Object.keys(questionnaire.answers)
        } else {
          questionnaire.answers = []
        }
        return questionnaire;
      })
      .catch(e => console.error(e))
  };

  export interface NewQuestions { (question: string[]): void }

  export const getQuestionnaireQuestionsLive = (id: string, listener: NewQuestions) => {

    return onValue(ref(db, `questionnaires/${id}/questions`), (snapshot) => {
      if (!snapshot.exists()) return [];
      const newQuestion = Object.keys(snapshot.val());
      return listener(newQuestion)
    })
  }

  export const updateQuestionnaireQuestion = (idQuestionnaire: string, idQuestion: string): Promise<void> => {
    return update(ref(db), { [`questionnaires/${idQuestionnaire}/questions/${idQuestion}`]: true });
  };

  export const updateQuestionnaireAnswer = (idQuestionnaire: string, idAnswer: string): Promise<void> => {
    return update(ref(db), { [`questionnaires/${idQuestionnaire}/answers/${idAnswer}`]: true });
  };

  export const updateQuestionnaireTotalPoints = (idQuestionnaire: string, points: number): Promise<void> => {
    return get(ref(db, `questionnaires/${idQuestionnaire}/`))
                        .then(res => {
                          if (!res.exists()) {
                            throw new Error(`Questionnaire with id ${idQuestionnaire} does not exist!`);
                          }
                          const questionnaire = res.val();
                          const result = Number(questionnaire.totalPoints) + Number(points)
                          return result
                        } ) 
                        .then(totalPoints => update(ref(db), { [`questionnaires/${idQuestionnaire}/totalPoints/`]: totalPoints  }))    
  };

  export interface TotalPoints { (points: number): void }

  export const getQuestionnaireTotalPointsLive = (id: string, listener: TotalPoints) => {

    return onValue(ref(db, `questionnaires/${id}/totalPoints`), (snapshot) => {
      if (!snapshot.exists()) return [];
      const points = snapshot.val();
      return listener(points)
    })
  }