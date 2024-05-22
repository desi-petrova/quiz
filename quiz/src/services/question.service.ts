import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove,push } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';
import { getAnswerById } from './answers.service.ts';
import { object } from 'prop-types';

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
        if(question.answers){
          question.answers = Object.keys(question.answers)
        } else {
          question.answers = []
        }
        return question;
      })
      .catch(e => console.error(e));
  };

export const updateQuestionAnswers = (idQuestion: string, idAnswer: string) => {
    return update(ref(db), { [`questions/${idQuestion}/answers/${idAnswer}`]: true })
}

export interface QuestionAnswers { (answer: string[]): void }

export const getQuestionAnswersLive = (id: string, listener: QuestionAnswers) => {

  return onValue(ref(db, `questions/${id}/answers`), (snapshot) => {
    if (!snapshot.exists()) return [];
    const answer = Object.keys(snapshot.val());
    return listener(answer)
  })
}