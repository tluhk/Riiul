import {Router} from "express";
import subjectsAdminController from "./subjects/subjectsAdminController";
import subjectsClientController from "./subjects/subjectsClientController";

export const endpoints: { path: string, controller: Router }[] = [
  { path: '/admin/subjects', controller: subjectsAdminController },
  { path: '/subjects', controller: subjectsClientController }
]