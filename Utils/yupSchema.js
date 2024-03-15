import * as yup from 'yup';


// Validating login data 
export const loginSchema = yup.object().shape({
  email:yup.string().trim().required()
  .test("isvalidEmail", "Invalid e-Mail", (arg) => /[a-z0-9]+@[a-z0-9]+.com/i.test(arg)),
  
  password : yup.string().trim().required().min(6).max(16),
  
})
export const signupSchema = yup.object().shape({
  firstName:yup.string().trim().required().min(4 , "Invalid Name").max(16, "Invalid Name"),

  email:yup.string().trim().required()
  .test("isvalidEmail", "Invalid e-Mail", (arg) => /[a-z0-9]+@[a-z0-9]+.com/i.test(arg)),
  
  password : yup.string().trim().required().min(6).max(16),
  
})