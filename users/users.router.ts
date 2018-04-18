import { Router } from "../common/router";
import { Server } from "restify";
import { User } from "./users.model";

class UsersRouter extends Router {
    applyRoutes(application: Server) {
        application.get('/users', (req, res, next) => {
            User.findAll().then(users => {
                res.json(users)
                return next()
            })
        })
    }
}

export const usersRouter = new UsersRouter()