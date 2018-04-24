import * as restify from 'restify'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import * as mongoose from 'mongoose'

export class Server {
    application: restify.Server

    constructor() {
        this.application = restify.createServer({
            name: 'meat-api',
            version: '1.0.0'
        })
    }

    initializeDb() {
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url)
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try{
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())

                for(let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                   resolve(this.application)
                })
                
            }catch(error) {
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then(() =>
               this.initRoutes(routers).then(()=> this)
        ) 
    }
}