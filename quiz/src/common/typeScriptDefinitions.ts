import { BlobOptions } from "buffer";

//Create Account
export interface FormUser {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    phone: string,
    email: string,
    role: string,
  }

export interface FormError {
    error: boolean,
    fieldErr: boolean,
    firstNameLength: boolean,
    lastNameLength: boolean,
    usernameErr: boolean,
    userNameTakenErr: boolean,
    passwordErr: boolean,
    phoneErr: boolean,
    emailErr: boolean,
    roleErr: boolean,
  }

 //search 
export interface User {
    handle: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePhoto: string;
}

export interface SearchUsersBoxProps {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    // imageSrc: string;
    setOpen: (value: boolean) => void;
    setSearchValue: (value: string) => void;
    updateNewUsers?: (user: string) => void;
  }

export interface SearchUsersProps {
    updateNewUsers?: (user: string) => void;
    
}


//Questionnaires
export interface IdQuestionnaire {
    idQuestionnaire: string,
}

export interface Questionnaire {
    id: string,
    title: string,
    description: string,
    time: number,
    status: string,
    background: string,
    picture: string,
    questions?: [id: string],
    answers?: [id: string],
}

//Questions
export interface NewQuestion{
    question: string,
    type: string,
}

export interface NewQuestions{
    question: string,
    type: string,
    answer: string,
}

export interface Questions{
    id: string,
    question: string, 
    type: string, 
    idQuestionnaire: string,
    answers: string[] 
}

export interface StartAnswer {
    questionId: string,
    type: string,
    question: string,
    idQuiz: string,
}

//Answers
export  interface AnswersProp {
    questionId: string,
    show: boolean
}

export interface Answers {
    id: string,
    questionId: string, 
    answer: string, 
    wrong: boolean,
}

export interface Answer {
    description: string,
    wrong: boolean | null,
}

export interface MyAnswers {
    id: string,
    questionId: string, 
    answer: string, 
    wrong: boolean,
    myAnswer: boolean,
    myOpenAnswer: string,
}

//Quiz

export interface Quiz{
    id: string,
    idQuestionnaire: string,
    title: string,   
    user: string,
    background: string,
    answers: string[],
}

export interface QuizMyAnswer{
    id: string,
    idQuiz: string,
    questionId: string,
    question: string,
    typeQuestion: string,
    answers: [{answer: string, myAnswer: boolean, wrong: boolean, myOpenAnswer: string, }],
}

//visibleIcon

export interface VisibleIcon {
    edit: boolean,
    delete: boolean,
    questionnaireId: string,
}

//UsersList
export interface UsersListProps {
    handle: string
}