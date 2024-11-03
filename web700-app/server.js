const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData.js');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware to serve static files and handle form data
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Route to serve home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Route to serve about page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Route to serve HTML demo page
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

// GET route to serve the Add Student form
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

// POST route to handle form submission for adding a student
app.post("/students/add", (req, res) => {
    console.log("Form data received:", req.body); // Log form data to the console

    // Define studentData based on req.body
    const studentData = {
        firstName: req.body.firstName || "",
        lastName: req.body.lastName || "",
        email: req.body.email || "",
        addressStreet: req.body.addressStreet || "",
        addressCity: req.body.addressCity || "",
        addressProvince: req.body.addressProvince || "",
        TA: req.body.TA ? true : false, // Handle checkbox
        status: req.body.status || "Full Time",
        course: req.body.course || "1"
    };

    console.log("Processed student data:", studentData); // Log processed data for verification

    // Add the student using the processed data
    collegeData.addStudent(studentData)
        .then(() => {
            console.log("Student added successfully");
            res.redirect("/students");
        })
        .catch((err) => {
            console.error("Error adding student:", err);
            res.status(500).send("Error adding student: " + err);
        });
});

// GET route to fetch all students or students by course
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

// GET route to fetch all TAs
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(tas => res.json(tas))
        .catch(err => res.json({ message: err }));
});

// GET route to fetch all courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(err => res.json({ message: err }));
});

// GET route to fetch a student by student number
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(student => res.json(student))
        .catch(err => res.json({ message: err }));
});

// 404 error handling for undefined routes
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
