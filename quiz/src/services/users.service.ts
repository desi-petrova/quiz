import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';

export const getUserByHandle = (handle: string): Promise<DataSnapshot> => {
  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (
  handle: string,
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  role: string): Promise<void> => {

  return set(ref(db, `users/${handle}`), {
    handle,
    uid,
    email,
    firstName,
    lastName,
    phoneNumber,
    profilePhoto: '',
    role,
    isBlocked: false,
  })
};

export const getUserData = (uid: string): Promise<DataSnapshot> => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const updateUserData = (handle: string, key: string, value: string | boolean): Promise<void> => {
  return update(ref(db), { [`users/${handle}/${key}`]: value });
};

export const updateUserQuestionnaires = (uid: string, handle: string) => {
  return update(ref(db), { [`users/${handle}/myQuestionnaires/${uid}`]: true })
}

export interface UserQuestionnaire { (questionnaires: string[]): void }

export const getUserQuestionnaireLive = (handle: string, listener: UserQuestionnaire) => {

  return onValue(ref(db, `users/${handle}/myQuestionnaires`), (snapshot) => {
    if (!snapshot.exists()) return [];
    const myQuestionnaires = Object.keys(snapshot.val());
    return listener(myQuestionnaires)
  })
}

export const updateUserQuestions = (handle: string, idQuestion: string): Promise<void> => {
  return update(ref(db), { [`users/${handle}/myQuestions/${idQuestion}`]: true });
};

export const updateUserAnswers = (handle: string, idAnswer: string): Promise<void> => {
  return update(ref(db), { [`users/${handle}/myAnswers/${idAnswer}`]: true });
};

export const updateCompletedQuiz = (handle: string, idQuiz: string): Promise<void> => {
  return update(ref(db), { [`users/${handle}/myCompletedQuiz/${idQuiz}`]: true });
};

export const updateUserCompletedQuiz = (handle: string, idQuiz: string ) => {
  return update(ref(db), { [`users/${handle}/myQuiz/${idQuiz}`]: true})
}

export const updateUserQuizAnswers = (handle: string, answer: string ) => {
  return update(ref(db), { [`users/${handle}/quizAnswers/${answer}`]: true})
}

export const getAllUsersData = (): Promise<DataSnapshot> => {
  return get(query(ref(db, 'users')));
};




// export const setAllUsersUnseen = (members: string[], handle: string, key: string): void => {
//   members.forEach(member => {
//     if (member !== handle) {
//       updateUserData(member, `unseen/${key}`, true);
//     }
//   });
// }

// export const getAllUsers = (): Promise<string[]> => {
//   return get(ref(db, 'users'))
//     .then((snapshot) => {
//       if (!snapshot.exists()) {
//         return [];
//       }
//       return Object.keys(snapshot.val())
//     });
// };

// export const updateUserTeams = (handle: string, idTeam: string): Promise<void> => {
//   return update(ref(db), { [`users/${handle}/myTeams/${idTeam}`]: true })
// }

// export interface TeamsListener { (teams: string[]): void }

// export const getUserTeamsLive = (handle: string, listener: TeamsListener) => {

//   return onValue(ref(db, `users/${handle}/myTeams`), (snapshot) => {
//     if (!snapshot.exists()) return [];
//     const teams = Object.keys(snapshot.val());
//     return listener(teams)
//   })
// }

// export interface StatusListener { (status: string): void }

// export const getUserStatusLive = (handle: string, listener: StatusListener) => {

//   return onValue(ref(db, `users/${handle}/status`), (snapshot) => {
//     if (!snapshot.exists()) return [];
//     const status = snapshot.val();
//     return listener(status)
//   })
// }

// export const getAllUserTeams = (handle: string) => {
//   return get(ref(db, `users/${handle}/myTeams`))
// }

// export const userMessage = (id: string, handle: string): Promise<void> => {
//   const updateUserMessage: { [key: string]: boolean } = {};
//   updateUserMessage[`/users/${handle}/myMessages/${id}`] = true;

//   return update(ref(db), updateUserMessage);
// }

// export const userChannel = (id: string, handle: string): Promise<void> => {
//   const updateUserChannel: { [key: string]: boolean } = {};
//   updateUserChannel[`/users/${handle}/myChannels/${id}`] = true;

//   return update(ref(db), updateUserChannel);
// }


// export interface ChannelsListener { (channels: string[]): void }

// export const getUserChannelsLive = (handle: string, listener: ChannelsListener) => {

//   return onValue(ref(db, `users/${handle}/myChannels`), (snapshot) => {
//     if (!snapshot.exists()) return [];

//     const channels = Object.keys(snapshot.val());

//     return listener(channels);
//   })
// }

// export const addUserReactionToMessage = (messageId: string, reaction: string, handle: string) => {
//   const updateUserReactionToMessage: { [key: string]: boolean } = {};
//   updateUserReactionToMessage[`/users/${handle}/myReactions/${reaction}/${messageId}`] = true;

//   return update(ref(db), updateUserReactionToMessage);
// }

// export const removeUserReactionFromMessage = (messageId: string, reaction: string, handle: string) => {
//   remove(ref(db, `users/${handle}/myReactions/${reaction}/${messageId}`));
// }

// export const updateUserStatus = (handle: string, status: string) => {
//   return update(ref(db), {[`/users/${handle}/status`]: status})
// }

// export const updateUserEvent = (handle: string, event: string) => {
//   return update(ref(db), {[`/users/${handle}/myEvents/${event}`]: true})
// }

// export interface EventListener { (events: string[]): void }

// export const getUserEventLive = (handle: string, listener: EventListener ) => {

//   return onValue(ref(db, `users/${handle}/myEvents`), (snapshot) => {
//     if (!snapshot.exists()) return [];

//     const events = Object.keys(snapshot.val());

//     return listener(events);
//   })
// }

// export const updateMyNotes = (handle: string, channelId: string) => {
//   return update(ref(db), {[`/users/${handle}/myNotes`]: channelId})
// }

