const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    personID:{
        type:String
    }
})

module.exports = new mongoose.model('Task',taskSchema)