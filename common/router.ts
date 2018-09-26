import * as restify from 'restify'
import {EventEmitter} from 'events'
import {NotFoundError} from "restify-errors";

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server) : any

    envelope(document: any) : any {
        return document
    }

    render(response: restify.Response, next: restify.Next) {
        return (document) => {
            if(document) {
                this.emit('beforeRender', document)
                response.json(this.envelope(document))
            }else {
                throw new NotFoundError('Document not found')
            }
            return next()
        }
    }

    renderAll(response: restify.Response, next: restify.Next) {
        return (documents: any[]) => {
            if(documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document)
                    array[index] = this.envelope(document)
                })
                response.json(documents)
            } else {
              response.json([])
            }
            return next()
        }
    }

}
