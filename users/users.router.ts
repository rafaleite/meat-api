import { Router } from "../common/router";
import { Server } from "restify";
import { User } from "./users.model";

import {NotFoundError} from 'restify-errors'

class UsersRouter extends Router {

    constructor() {
        super()
        this.on('beforeRender', document => {
            document.password = undefined
            //delete document.password
        })
    }

    applyRoutes(application: Server) {
        application.get('/users', (req, res, next) => {
            User.find().then(this.render(res, next))
                .catch(next)
        })

        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id)
                .then(this.render(res, next))
                .catch(next)
        })

        application.post('/users', (req, res, next) => {
            let user = new User(req.body)
            user.save().then(this.render(res, next)).catch(next)
        })

        application.put('/users/:id', (req, res, next) => {
            const options = { runValidators: true, overwrite: true }
            User.update({_id: req.params.id}, req.body, options)
                .exec().then(result => {
                    if(result.n) {
                        return User.findById(req.params.id) 
                    } else {
                        throw new NotFoundError('Document not found')
                    }
                }).then(this.render(res, next))
                  .catch(err => {
                    res.json(err)
                    res.status(500)
                    return next()
                })
        })

        application.patch('/users/:id', (req, res, next) => {
            const options = { runValidators: true, new: true }
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next))
                .catch(next)
        })

        application.del('/users/:id', (req, res, next) => {
            User.remove({ _id: req.params.id }).exec().then(cmdResult => {
                if(cmdResult.result.n) {
                    res.send(204)
                }else {
                    throw new NotFoundError('Document not found')
                }

                return next()
            }).catch(next)
        })

    }
}

export const usersRouter = new UsersRouter()