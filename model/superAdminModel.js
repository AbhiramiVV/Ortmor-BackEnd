import mongoose from 'mongoose'

const superAdminSchema  = new mongoose.Schema({
  email: {
    type : String ,
    required: true ,
  
  },
  password : {
    type : String ,
    required: true
  }
})

const SuperAdminModel = mongoose.model("superAdminSchema", superAdminSchema)


export default SuperAdminModel 