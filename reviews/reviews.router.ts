import { ModelRouter } from "../common/model-router";
import { Server } from "restify";
import { Review } from "./reviews.model";
import * as mongoose from "mongoose";

class ReviewsRouter extends ModelRouter<Review> {

    constructor() {
        super(Review)
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
        application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.post('/reviews', this.save)
    }

}

export const reviewRouter = new ReviewsRouter()