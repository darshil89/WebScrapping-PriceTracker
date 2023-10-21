import mongoose from 'mongoose';

let isConnected = false;

export const connectToDb = async () => {
    mongoose.set('strictQuery', true)

    if (!process.env.MONGODB_URI)
        return console.log('MONGODB_URI is not defined')

    if (isConnected) return console.log('Already connected to db')

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        isConnected = true;
        console.log('Connected to db')
    } catch (error) {
        console.log('Error while connecting to db', error)
    }

};