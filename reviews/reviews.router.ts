import { ModelRouter } from "../common/model-router";
import { Server } from "restify";
import { Review } from "./reviews.model";
import * as mongoose from "mongoose";

class ReviewsRouter extends ModelRouter<Review> {

    constructor() {
        super(Review)
    }

    envelope(document: any) : any {
        let resource = super.envelope(document)
        const restID = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurant/${restID}/`

        const userID = document.user._id ? document.user._id : document.user
        resource._links.user = `/users/${userID}/`

        return resource
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review,Review>) : mongoose.DocumentQuery<Review,Review> {
        return query.populate('user', 'name')
                    .populate('restaurant', 'name')
    }

    protected prepareAll(query: mongoose.DocumentQuery<Review[],Review>) : mongoose.DocumentQuery<Review[],Review> {
        return query.populate('user', 'name')
            .populate('restaurant', 'name')
    }

    /*findById = (req, res, next) => {
        this.model.findById(req.params.id)
            .populate('user', 'name')
            .populate('restaurant', 'name')
            .then(this.render(res, next))
            .catch(next)
    }*/

    applyRoutes(application: Server): any {
        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
    }

}

export const reviewRouter = new ReviewsRouter()