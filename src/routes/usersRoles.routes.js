import { Router } from "express";
import {getUsersRole, getRolesAndUsers, createUserRole, updateUserRoles, deleteUserRole, getUserWithRoles} from "../controllers/userRole.controller.js"
import "../models/UserRole.js"
import { authUser } from '../middlewares/login.middleware.js';
import apicache from 'apicache'


const router = Router()
const cache = apicache.middleware

router.get("/usersRoles", cache("1 minutes"), authUser, getUsersRole)
router.get("/usersRoles/:id", cache("1 minutes"), authUser, getUserWithRoles)
router.get("/rolesUsers", cache("1 minutes"), authUser, getRolesAndUsers)
router.post("/userRoles", cache("1 minutes"), authUser, createUserRole)
router.put("/userRoles", cache("1 minutes"), authUser, updateUserRoles)
router.delete("/userRoles", cache("1 minutes"), authUser, deleteUserRole)


export default router