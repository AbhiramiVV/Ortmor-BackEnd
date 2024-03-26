import asyncHandler from 'express-async-handler' 

const validate = ( Schema ) => asyncHandler(async(req,res,next) => {
  try {
    req.body = await Schema.validate(req.body , { stripUnknown :true });
    next();
  } catch (error) {
    
    // you need to make an middleware for error handler 
    res.status(400)
    throw new Error(error.message)
   
  }
})

export default validate