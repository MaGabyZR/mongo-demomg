//connect to MongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground') //to reference the Mongodb installed in my machine and a DB, that it creates automatically. 
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

//Define the schema for the documents. //Data validation
const courseSchema = new mongoose.Schema({
    name: {                                 //use the require validator, in a schema type object. 
        type: String, 
        required: true,
        minlength: 5,
        maslength: 255 
    },
    //Schema type object.
    category: {
        type: String,
        required: true,
        enum: [ 'web', 'mobile', 'network'],
        lowercase: true,
        //uppercase: true,
        trim: true
    },
    author: String,
    /* //This is a synchronous validator.
    tags: {                                 //Custom validator, so every course should have at least one tag.
        type: Array,
        validate: {
            validator: function(value){
                return value && value.length > 0; 
            },
            message: 'A course should have at least one tag.'
        } */

    //This a an async validator.
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(value) {
                return new Promise((resolve) => {
                    setTimeout(() => {                              // Do async work.
                        const result = value && value.length > 0; // Check if at least one tag exists
                        resolve(result);
                    }, 4000);
                });
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: { type: Date, default: Date.now}, //it´s defined to have a default value. 
    isPublished: Boolean,
    price: {                                //use the required validator as a boolean.
        type: Number,
        required: function(){ return this.isPublished; },
        min: 10,
        max: 200,
        get: value => Math.round(value),
        set: value => Math.round(value)
    }
});

//Compile the schema into a model.
const Course = mongoose.model('Course', courseSchema); //Class Course.

async function createCourse(){
    const course = new Course({                        //Object of the Course Class. 
        name: 'Angular course',
        category: 'web',
        author: 'MaGaby',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    });
    
    //Save this document to our DB, wrap it it a try-catch block to handles a failure to fulfill the promise. 
    try{ 
    const result = await course.save(); //async operation that returns a promise, this why all the code block is wrapped inside an async function. 
    console.log(result);
    }
    catch(ex){                          //ex: exception.
        for (field in ex.errors)
            console.log(ex.errors[field].message);                 
    }
}

async function getCourses(){
    const pageNumber = 2;
    const pageSize = 10;                    //In real apps, you call your API, do not hard code them. Ex.: /api/courses?pageNumber=2&pageSize=10
    //const courses = await Course.find(); //for getting all courses.
    const courses = await Course           //for filtering the query with more details.With all the options shown bellow. 
        //.find()       //to used the logical operators. 
        //.or([ { author: 'MaGaby'}, { isPublished: true }])      //to get courser authored by MG or published. => Logical or operator.
        .find({ author: 'MaGaby', isPublished: true})
        //.find({ price: 10 })               //to get only the courses that cost 10.
        //.find({ price: { $gt: 10, $lte: 20 } })         //to get courses greater than 10. With the {$} you can uses any of the comparison operators. 
        //.find({ price: { $in: [ 10, 15, 20 ] } })       //to get the courses in that price range. 
        //.find({ author: /^M/ })                         //to use a regular expression, and get any course whose author starts with M /^M/
        //.find({ author: /Gaby$/ })                      //to use a regular expression, and get any course whose author ends with M /Gaby$/
        //.find({ author: /.*Gaby.*/ })                   //to use a regular expression, and get any course whose author contains Gaby /.*Gaby.*/
        .skip((pageNumber - 1) * pageSize )               //to get the documents in a given page. 
        .limit(pageSize)
        .sort({ name: 1 })                                //1 indicates ascending order, descending is -1. 
        .countDocuments()
        .select({ name: 1, tags: 1, price: 1 });
    console.log(courses);
}

//async function updateCourse(id){
/*     //1st approach: Querry first.
    // findById()
    //Modify its properties
    //save()
    const course = await Course.findById(id);
    if (!course) return;

    if (course.isPublished) return; 

   //Option A
    course.isPublished = true;
    course.author = 'Another author';

/*      //Option B
    course.set({
        isPublished: true,
        author: 'Another author'
    });  */

    //const result = await course.save();
    //console.log(result);
    // } */

    //2nd approach: Update first. Update directly in the database and optionally get the updated document aswell.

/*     async function updateCourse(id) {
        const course = await Course.findByIdAndUpdate(id, { 
            $set: { 
                author: 'Jason', 
                isPublished: false 
            } 
        }, { new: true });
            console.log(course);
    }
    
    updateCourse('5a68fde3f09ad7646ddec17e'); */

    async function removeCourse(id) {
        //const result = await Course.deleteOne({ _id: id });
        const course = await Course.findByIdAndDelete(id);
        console.log(course);
    }
    
    //removeCourse('5a68fde3f09ad7646ddec17e');
    
createCourse();
//getCourses();


