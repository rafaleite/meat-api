import { Router } from "../common/router";
import { Server } from "restify";
import { User } from "./users.model";

class UsersRouter extends Router {
    applyRoutes(application: Server) {
        application.get('/users', (req, res, next) => {
            User.find().then(users => {
                res.json(users)
                return next()
            })
        })

        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id).then(user => {
                if(user) {
                    res.json(user)
                    return next()
                }
                res.send(404)
                return next()
            })
        })

        application.post('/users', (req, res, next) => {
            let user = new User(req.body)
            user.save().then(user => {
                user.password = undefined
                res.json(user)
                return next()
            })
        })

        application.put('/users/:id', (req, res, next) => {
            const options = { overwrite: true }
            User.update({_id: req.params.id}, req.body, options)
                .exec().then(result => {
                    if(result.n) {
                        return User.findById(req.params.id) 
                    } else {
                        res.send(404)
                    }
                }).then(user => {
                    res.json(user)
                    return next()
                }).catch(err => {
                    res.json(err)
                    res.status(500)
                    return next()
                })
        })

    }
}

export const usersRouter = new UsersRouter()