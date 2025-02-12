//connect to MongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground') //to reference the Mongodb installed in my machine and a DB, that it creates automatically. 
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

//Define the schema for the documents.
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now}, //it´s defined to have a default value. 
    isPublished: Boolean
});

//Compile the schema into a model.
const Course = mongoose.model('Course', courseSchema); //Class Course.

async function createCourse(){
    const course = new Course({                        //Object of the Course Class. 
        name: 'Angular course',
        author: 'MaGaby',
        tags: ['angular', 'frontend'],
        isPublished: true
    });
    
    //Save this document to our DB
    const result = await course.save(); //async operation that returns a promise, this why all the code block is wrapped inside an async function. 
    console.log(result);
}

async function getCourses(){
    //const courses = await Course.find(); //for getting all courses.
    const courses = await Course           //for filtering the query with more details.
        .find()
        .or([ { author: 'MaGaby'}, { isPublished: true }])      //to get courser authored by MG or published. => Logical or operator.
        //.find({ author: 'MaGaby', isPublished: true})
        //.find({ price: 10 })               //to get only the courses that cost 10.
        //.find({ price: { $gt: 10, $lte: 20 } })        //to get courses greater than 10. With the {$} you can uses any of the comparison operators. 
        //.find({ price: { $in: [ 10, 15, 20 ] } })            //to get the courses in that price range. 
        .limit(10)
        .sort({ name: 1 })                //1 indicates ascending order, descending is -1. 
        .select({ name: 1, tags: 1 });
    console.log(courses);
}

//createCourse();
getCourses();


