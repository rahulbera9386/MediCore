import express, { NextFunction, Request, Response } from "express";
import { addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login, logoutAdmin, logoutPatient, patientRegister } from "../controller/userController";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middleware/auth";
import { upload } from "../middleware/multer";
const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
    patientRegister(req, res);
})
router.post("/login", (req: Request, res: Response) => {
    login(req, res);
})
router.post("/admin/addnew", (req: Request, res: Response, next: NextFunction) => { isAdminAuthenticated(req, res, next) },(req: Request, res: Response) => {
    addNewAdmin(req, res);
});
router.post("/doctor/addnew", (req: Request, res: Response, next: NextFunction) => { isAdminAuthenticated(req, res, next) }, upload.single("docAvatar"),(req: Request, res: Response) => {
    addNewDoctor(req, res);
});

router.get("/doctors", (req: Request, res: Response) => {
    getAllDoctors(req, res);
});
router.get("/patient/me", (req: Request, res: Response, next: NextFunction) => { isPatientAuthenticated(req, res, next) }, (req: Request, res: Response) => {
    getUserDetails(req, res);
});
router.get("/admin/me", (req: Request, res: Response, next: NextFunction) => { isAdminAuthenticated(req, res, next) }, (req: Request, res: Response) => {
    getUserDetails(req, res);
});
router.get("/patient/logout", (req: Request, res: Response, next: NextFunction) => { isPatientAuthenticated(req, res, next) }, (req: Request, res: Response) => {
    logoutPatient(req, res);
});
router.get("/admin/logout", (req: Request, res: Response, next: NextFunction) => { isAdminAuthenticated(req, res, next) }, (req: Request, res: Response) => {
    logoutAdmin(req, res);
});
export default router;