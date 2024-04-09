//form validators
export const NAMES_MIN_LENGTH = 1;
export const NAMES_MAX_LENGTH = 30;
export const USERNAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 6;
export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const PHONE_REGEX = 10; 

//form error messages 
export const MSG_FIELD_REQUIRED = '*Field required*';
export const MSG_USERNAME_TAKEN = '*This Username already exists*';
export const MSG_EMAIL_TAKEN = '*This email already exists*';
export const MSG_NAMES_LENGTH = '*Must be 1 to 30 characters*';
export const MSG_USERNAMES_LENGTH = '*Must be 3 to 30 characters*';
export const MSG_EMAIL_INVALID = '*Invalid email format*';
export const MSG_LOGIN_UNABLE = '*Wrong username or password*';
export const MSG_PASSWORD_LENGTH = '*Password length must be more than 6 characters*';
export const MSG_PASSWORD_NOT_MATCH = '*Password fields do not match*';
export const MSG_INVALID_IMAGE_FORMAT = '*Invalid image format*';