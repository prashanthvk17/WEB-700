const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData.js');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// GET home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// GET about page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// GET html demo page
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});


// GET /students
app.get("/students", (req, res) => {
    const course = req.query.course;
    if (course) {
        collegeData.getStudentsByCourse(course)
            .then(students => res.json(students))
            .catch(err => res.json({ message: err }));
    } else {
        collegeData.getAllStudents()
            .then(students => res.json(students))
            .catch(err => res.json({ message: err }));
    }
});

// GET /tas
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(tas => res.json(tas))
        .catch(err => res.json({ message: err }));
});

// GET /courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(err => res.json({ message: err }));
});

// GET /student/:num
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(student => res.json(student))
        .catch(err => res.json({ message: err }));
});

// GET /
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// GET /about
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// GET /htmlDemo
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

// 404 error handling
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize collegeData and start server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port: ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Failed to initialize data: ${err}`);
    });
