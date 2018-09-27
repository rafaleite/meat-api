import {Router} from './router'
import * as mongoose from 'mongoose'
import {NotFoundError} from "restify-errors";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    basePath: string
    pageSize: number

    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${this.model.collection.name}`
        this.pageSize = 4
    }

    protected prepareOne(query: mongoose.DocumentQuery<D,D>) : mongoose.DocumentQuery<D,D> {
        return query
    }

    protected prepareAll(query: mongoose.DocumentQuery<D[],D>) : mongoose.DocumentQuery<D[],D> {
        return query
    }

    envelope(document: any) : any {
        let resource = Object.assign({_links: {}}, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

    validateId = (req, res, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'))
        }else {
            next()
        }
    }

    findAll = (req, res, next) => {
        let page = parseInt(req.query._page || 1)
        page = page > 0 ? page : 1
        const skip = (page - 1) * this.pageSize

        this.prepareAll(this.model.find())
            .skip(skip)
            .limit(this.pageSize)
            .then(this.renderAll(res, next))
            .catch(next)
    }

    findById = (req, res, next) => {
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next)
    }

    save = (req, res, next) => {
        let document = new this.model(req.body)
        document.save().then(this.render(res, next)).catch(next)
    }

    replace = (req, res, next) => {
        const options = { runValidators: true, overwrite: true }
        this.model.update({_id: req.params.id}, req.body, options)
            .exec().then(result => {
            if(result.n) {
                return this.model.findById(req.params.id)
            } else {
                throw new NotFoundError('Document not found')
            }
        }).then(this.render(res, next))
            .catch(err => {
                res.json(err)
                res.status(500)
                return next()
            })
    }

    update = (req, res, next) => {
        const options = { runValidators: true, new: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(res, next))
            .catch(next)
    }

    delete = (req, res, next) => {
        this.model.remove({ _id: req.params.id }).exec().then(cmdResult => {
            if(cmdResult.result.n) {
                res.send(204)
            }else {
                throw new NotFoundError('Document not found')
            }

            return next()
        }).catch(next)
    }
}
