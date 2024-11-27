
/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Gauravpal Singh Sandhu
* Student id- 161718234
********************************************************************************/

var express = require("express");
const path = require('path');
var app = express();
const collegeData = require(path.join(__dirname, "modules", "collegeData"));
const ejs = require("ejs"); 
app.engine('ejs', ejs.renderFile); 
app.set('view engine', 'ejs'); 
const expressLayouts = require('express-ejs-layouts');
const { title } = require("process");
app.use(expressLayouts)
app.set('layout', 'layouts/main');
const PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute =
        "/" +
        (isNaN(route.split("/")[1])
            ? route.replace(/\/(?!.*)/, "")
            : route.replace(/\/(.*)/, ""));
    next();
});

app.locals.equal = function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Ejs Helper 'equal' needs 2 parameters");
    return lvalue !== rvalue ? options.inverse(this) : options.fn(this);
};

// Middleware to parse URL-encoded data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views'))); 

// Route for home page
app.get("/", (req, res) => {
    res.render('home',{title:'Home'});
});

// Route for about page
app.get("/about", (req, res) => {
    res.render('about',{title:'About'});
});

// Route for HTML demo page
app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo',{title:'HtmlDemo'});
});

// Route for adding a student (GET)
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

// Route for adding a student (POST)
app.post('/students/add', (req, res) => {
    console.log("Received student data:", req.body); // Log the received data
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect('/students'); // Redirect to students page after successful addition
        })
        .catch(err => {
            console.error("Error adding student:", err);
            res.status(500).send('Error adding student'); // Handle error appropriately
        });
});

// Route to get students
app.get("/students", async (req, res) => {
    const course = req.query.course;
    try {
        let students;
        if (course) {
            students = await collegeData.getStudentsByCourse(course);
        } else {
            students = await collegeData.getAllStudents();
        }
        res.render('students',{students});
    } catch (err) {
        res.render('students',{ message: "no results" });
    }
});

// Route to get TAs
app.get("/tas", async (req, res) => {
    try {
        res.json(await collegeData.getTAs());
    } catch (err) {
        res.json({ message: "no results" });
    }
});

// Route to get courses
app.get("/courses", async (req, res) => {
    try {
        const courselist = await collegeData.getCourses();
        res.render('courses',{courses:courselist});
    } catch (err) {
        res.render('courses',{ message: "no results" });
    }
});

// Route to get a specific student by number
app.get("/student/:num", async (req, res) => {
    const studentId = req.params.num;
    const studentdetail = await collegeData.getStudentByNum(studentId);
    try {
        res.render('student',{student:studentdetail});
    } catch (err) {
        res.render('student',{ message: "no results" });
    }
});


app.get("/course/:id", async (req, res) => {
    const courseId = req.params.id;
    const coursedetail = await collegeData.getCourseById(courseId);
    try {
        res.render('course',{course:coursedetail});
    } catch (err) {
        res.render('course',{ message: "no results" });
    }
});


// 404 Error handling
app.use((req, res, next) => {
    res.status(404).send("404 - We're unable to find what you're looking for.");
});

// Initialize college data and start server
collegeData.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server listening on port: " + PORT);
        });
    })
    .catch(err => {
        console.log("Failed to initialize data:", err);
    });

    module.exports.app;
