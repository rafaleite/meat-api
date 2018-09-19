import * as restify from 'restify'

export const handleError = (req: restify.Request, res: restify.Response, err, done) => {

    err.toJSON = () => {
        return {
            message: err.message
        }
    }
    console.log(err)
    switch (err.name) {
        case 'BulkWriteError':
            if(err.code === 11000) {
                err.statusCode = 400
            }
            break
        case 'CastError':
            err.statusCode = 400
            break
    }

    done()
}