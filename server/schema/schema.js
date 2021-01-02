const grapql = require('graphql')
const _ = require('lodash')
const Task = require('../models/task')
const Person = require('../models/person')

const {GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLInt,GraphQLList,GraphQLNonNull} = grapql

// const tasks = [
//     {name:"Exercise",category:"Activity",id:"1",personID:"11"},
//     {name:"Cleaning",category:"Activity",id:"3",personID:"12"},
//     {name:"Coding",category:"Work",id:"2",personID:"13"},
//     {name:"Meeting",category:"Work",id:"4",personID:"12"}
// ]

// const persons = [
//     {name:"Mike Slaer",age:23,id:"11"},
//     {name:"Denzel Lemar",age:28,id:"12"},
//     {name:"Toni drel",age:27,id:"13"}
// ]

const TaskType = new GraphQLObjectType({
    name:"Task",
    fields:()=>({
        name:{type:GraphQLString},
        id :{type:GraphQLID},
        category:{type:GraphQLString},
        person:{
            type:PersonType,
            resolve(parents,args){
                //return _.find(persons,{id:parents.personID})
                return Person.findById(parents.personID)
            }
        }
    })
})

const PersonType = new GraphQLObjectType({
    name:"Person",
    fields:()=>({
        name:{type:GraphQLString},
        id:{type:GraphQLID},
        age:{type:GraphQLInt},
        tasks:{
            type:new GraphQLList(TaskType),
            resolve(parents,args){
                //return _.filter(tasks,{personID:parents.id})
                return Task.find({personID :parents.id})
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name:"RootQuery",
    fields:{
        task:{
            type:TaskType,
            args:{id:{type:GraphQLID}},
            resolve(parents,args){
                //get data from database
               //return _.find(tasks,{id: args.id})
               return Task.findById(args.id)
            }
        },
        person:{
            type:PersonType,
            args:{id:{type:GraphQLID}},
            resolve(parents,args){
                //return _.find(persons,{id:args.id})
                return Person.findById(args.id)
            }
        },
        tasks:{
            type:new GraphQLList(TaskType),
            resolve(parents,args){
                return Task.find({})
            }
        },
        persons:{
            type:new GraphQLList(PersonType),
            resolve(parents,args){
                return Person.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addPerson:{
            type:PersonType,
            args:{name:{type:GraphQLNonNull(GraphQLString)},age:{type:GraphQLNonNull(GraphQLInt)}},
            resolve(parent,args){
                const person = new Person({
                    name:args.name,
                    age:args.age
                })

                return person.save()
            }
        },
        addTask:{
            type:TaskType,
            args:{name:{ type : GraphQLNonNull(GraphQLString)},
                  category:{ type : GraphQLNonNull(GraphQLString)},
                  personID:{type: GraphQLNonNull(GraphQLID)}},
            resolve(parent,args){
                const task = new Task({
                    name:args.name,
                    category:args.category,
                    personID:args.personID
                })

                return task.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : RootQueryType,
    mutation : Mutation
})
