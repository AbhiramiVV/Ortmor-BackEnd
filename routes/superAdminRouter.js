import express from "express";
import { authAdmin,SuperAdminLogin,getAllAdmin,addAdmin,blockAdmin,unBlockAdmin ,getBlog,changeBlogStatus} from "../controllers/superAdminController.js";
import validate from "../middleware/validateBody.js";
import { loginSchema } from "../Utils/yupSchema.js";
import paginatedResults from "../middleware/pagination.js";
import { validateId } from "../middleware/validateParams.js";
// import { verifySuperAdmin } from "../middleware/superAdminAuth.js";





const router = express.Router();

// Admin Auth routes
router.get ("/auth"  , authAdmin );
router.post("/login", validate(loginSchema) , SuperAdminLogin); 

// router.use(verifySuperAdmin)

// Admin  Management
router.post("/add-Admin" , addAdmin);
router.get ("/get-Admin" , paginatedResults() , getAllAdmin);
router.get("/block-Admin/:id" , validateId ,blockAdmin);
router.get("/unblock-Admin/:id" ,validateId , unBlockAdmin);

//Blog Management
router.get('/get-Blog' ,paginatedResults(),getBlog);
router.put('/blog/change-status/:id/:status' , validateId , changeBlogStatus) 

export default router;
