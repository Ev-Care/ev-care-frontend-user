// regexConstants.js

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export  const NAME_REGEX = /^[A-Za-z ]+$/;


export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

export const AADHAR_REGEX = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;

export const PHONE_REGEX = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
export const VEHICLE_NUMBER_REGEX =/^[A-Z0-9]{8,11}$/;

// You can import these in other files like:
// import { EMAIL_REGEX, NAME_REGEX } from './regexConstants';