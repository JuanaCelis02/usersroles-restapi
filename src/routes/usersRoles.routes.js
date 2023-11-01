import { Router } from "express";
import {getUsersRole, getRolesAndUsers, createUserRole, updateUserRoles, deleteUserRole, getUserWithRoles} from "../controllers/userRole.controller.js"
import "../models/UserRole.js"
import { authUser } from '../middlewares/login.middleware.js';


const router = Router()

router.get("/usersRoles", authUser, getUsersRole)
router.get("/usersRoles/:id", authUser, getUserWithRoles)
router.get("/rolesUsers", authUser, getRolesAndUsers)
router.post("/userRoles", authUser, createUserRole)
router.put("/userRoles", authUser, updateUserRoles)
router.delete("/userRoles", authUser, deleteUserRole)


export default router