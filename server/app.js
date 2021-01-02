const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
require('dotenv').config({path:'./config.env'})
const app = express()

mongoose.connect(process.env.DATABASE,{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true})

const db = mongoose.connection
db.on('error',error => console.error(error))
db.once('open',()=>console.log('DataBase is connected'))


app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}))


app.listen(process.env.PORT,()=>{
    console.log("Server is listening");
})