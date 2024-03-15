import validator from "validator";


// Validate MongoDB ID in Params
export const validateId  = (req, res, next ) => {
  try {
    
  if(!req.params.id || !validator.isMongoId(req.params.id)){
    return res.json({ message : "Invalid Id"})
  }
  next();
  } catch (error) {
    console.log(error);
  }
}