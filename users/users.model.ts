import * as mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
    name: String,
    email: String,
    password: String
}

const userSchema = new mongoose.Schema({
    name: {
        type: String
      },
      email: {
        type: String,
        unique: true
      },
      password: {
        type: String,
        select: false
      }
})

export const User = mongoose.model<IUser>('User', userSchema)
