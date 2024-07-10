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
        
        if(questionnaire.completedQuiz){
          questionnaire.completedQuiz = Object.keys(questionnaire.completedQuiz)
        } else {
          questionnaire.completedQuiz = []
        }

        if(questionnaire.upcomingQuizzes){
          questionnaire.upcomingQuizzes = Object.keys(questionnaire.upcomingQuizzes)
        } else {
          questionnaire.upcomingQuizzes = []
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

  export const updateQuestionnaireCompletedQuizzes= (idQuestionnaire: string, idQuiz: string): Promise<void> => {
    return update(ref(db), { [`questionnaires/${idQuestionnaire}/completedQuizzes/${idQuiz}`]: true });
  };

  export const getQuestionnaireByCompletedQuizzesId = (idQuestionnaire: string) => {

    return get(ref(db, `questionnaires/${idQuestionnaire}`))
    .then(result => {
      if (!result.exists()) {
        throw new Error(`Questionnaire with id ${idQuestionnaire} does not exist!`);
      }
      const questionnaire = result.val();
      if(questionnaire.completedQuizzes){
        questionnaire.completedQuizzes = Object.keys(questionnaire.completedQuizzes)
      } else {
        questionnaire.completedQuizzes = []
      }
            
      return  questionnaire.completedQuizzes
    })
    .catch(e => console.error(e))

  }

  export const removeQuestionnaire = (questionnaireId: string) => {
    remove(ref(db, `questionnaires/${questionnaireId}`));
  }

  export const updateQuestionnaireUpcomingQuizzes = (idQuestionnaire: string, handle: string): Promise<void> => {
    return update(ref(db), { [`questionnaires/${idQuestionnaire}/upcomingQuizzes/${handle}`]: true });
  };

  export const removeQuestionnaireUpcomingQuizzes = (questionnaireId: string, handle: string) => {
    remove(ref(db, `questionnaires/${questionnaireId}/upcomingQuizzes/${handle}`));
  }

  export const removeQuestionnaireQuestion = (questionnaireId: string, questionId: string) => {
    remove(ref(db, `questionnaires/${questionnaireId}/questions/${questionId}`));
  }

  export const removeQuestionnaireAnswer = (questionnaireId: string, answer: string) => {
    remove(ref(db, `questionnaires/${questionnaireId}/answers/${answer}`));
  }

  export const updateQuestionnaireTitle = (questionnaireId: string, title: string) => {
    return update(ref(db), { [`questionnaires/${questionnaireId}/title/`]: title });
  }

  export const updateQuestionnaireDescription = (questionnaireId: string, description: string) => {
    return update(ref(db), { [`questionnaires/${questionnaireId}/description/`]: description });
  }

  export const updateQuestionnaireTime = (questionnaireId: string, time: number) => {
    return update(ref(db), { [`questionnaires/${questionnaireId}/time`]: time });
  }

  export const updateQuestionnaireStatus = (questionnaireId: string, status: string) => {
    return update(ref(db), { [`questionnaires/${questionnaireId}/status`]: status });
  }