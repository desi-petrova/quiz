//form validators
export const NAMES_MIN_LENGTH = 1;
export const NAMES_MAX_LENGTH = 30;
export const USERNAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 6;
export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const PHONE_REGEX = /^(?:\+359|0)8[7-9][0-9]{7}$/g; 

//form error messages 
export const MSG_FIELD_REQUIRED = '*Field required*';
export const MSG_USERNAME_TAKEN = '*This Username already exists*';
export const MSG_EMAIL_TAKEN = '*This email already exists*';
export const MSG_NAMES_LENGTH = '*Must be 1 to 30 characters*';
export const MSG_USERNAMES_LENGTH = '*Must be 3 to 30 characters*';
export const MSG_EMAIL_INVALID = '*Invalid email format*';
export const MSG_PHONE_INVALID = '*Invalid phone format*';
export const MSG_LOGIN_UNABLE = '*Wrong username or password*';
export const MSG_PASSWORD_LENGTH = '*Password length must be more than 6 characters*';
export const MSG_PASSWORD_NOT_MATCH = '*Password fields do not match*';
export const MSG_INVALID_IMAGE_FORMAT = '*Invalid image format*';

//login error messages
export const MSG_WRONG_EMAIL_AND_PASSWORD = '*This user and password was not found*';

//timer
export const MINUTE_SECONDS = 60;

//Questionnaire form
export const MAX_CONTEXT_LENGTH = 3000;
export const MSG_CONTEXT_LENGTH = '*Must be max 3000 characters*'
export const MSG_WRONG_ANSWER = '*Must be at least one wrong answer*'
export const MSG_CORRECT_ANSWER = '*Must be at least one correct answer*'
