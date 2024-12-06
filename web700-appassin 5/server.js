/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Prashanth Sultan Harinath
* Student ID: 165963232
********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require(path.join(__dirname, "modules", "collegeData"));
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware setup
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Active Route Helper
app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute =
        "/" +
        (isNaN(route.split("/")[1])
            ? route.replace(/\/(?!.*)/, "")
            : route.replace(/\/(.*)/, ""));
    next();
});

// Equality Helper for EJS
app.locals.equal = (lvalue, rvalue, options) => {
    if (arguments.length < 3) {
        throw new Error("EJS Helper 'equal' needs 2 parameters");
    }
    return lvalue !== rvalue ? options.inverse(this) : options.fn(this);
};

// Home Route
app.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});

// About Route
app.get("/about", (req, res) => {
    res.render("about", { title: "About" });
});

// HTML Demo Route
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo", { title: "HTML Demo" });
});

// Students Routes
app.get("/students/add", async (req, res) => {
    try {
        const courses = await collegeData.getCourses();
        res.render("addStudent", { courses });
    } catch {
        res.render("addStudent", { courses: [] });
    }
});

app.post("/students/add", async (req, res) => {
    try {
        await collegeData.addStudent(req.body);
        res.redirect("/students");
    } catch {
        res.status(500).send("Unable to add student");
    }
});

app.get("/students", async (req, res) => {
    const course = req.query.course;
    try {
        const students = course
            ? await collegeData.getStudentsByCourse(course)
            : await collegeData.getAllStudents();
        res.render("students", { students });
    } catch {
        res.render("students", { message: "No results" });
    }
});

app.get("/student/:num", async (req, res) => {
    let viewData = {};
    try {
        viewData.student = await collegeData.getStudentByNum(req.params.num);
    } catch {
        viewData.student = null;
    }
    try {
        viewData.courses = await collegeData.getCourses();
        if (viewData.student) {
            viewData.courses.forEach((course) => {
                if (course.courseId == viewData.student.course) {
                    course.selected = true;
                }
            });
        }
    } catch {
        viewData.courses = [];
    }
    if (!viewData.student) {
        res.status(404).send("Student Not Found");
    } else {
        res.render("student", { viewData });
    }
});

app.post("/student/update", async (req, res) => {
    try {
        await collegeData.updateStudent(req.body);
        res.redirect("/students");
    } catch {
        res.status(500).send("Unable to update student");
    }
});

app.get("/student/delete/:studentNum", async (req, res) => {
    try {
        await collegeData.deleteStudentByNum(req.params.studentNum);
        res.redirect("/students");
    } catch {
        res.status(500).send("Unable to remove student");
    }
});

// Courses Routes
app.get("/courses", async (req, res) => {
    try {
        const courses = await collegeData.getCourses();
        res.render("courses", { courses });
    } catch {
        res.render("courses", { message: "No results" });
    }
});

app.get("/courses/add", (req, res) => {
    res.render("addCourse");
});

app.post("/courses/add", async (req, res) => {
    try {
        await collegeData.addCourse(req.body);
        res.redirect("/courses");
    } catch {
        res.status(500).send("Unable to add course");
    }
});

app.get("/course/:id", async (req, res) => {
    try {
        const course = await collegeData.getCourseById(req.params.id);
        if (!course) {
            res.status(404).send("Course Not Found");
        } else {
            res.render("course", { course });
        }
    } catch {
        res.status(500).send("Unable to retrieve course");
    }
});

app.post("/course/update", async (req, res) => {
    try {
        await collegeData.updateCourse(req.body);
        res.redirect("/courses");
    } catch {
        res.status(500).send("Unable to update course");
    }
});

app.get("/course/delete/:id", async (req, res) => {
    try {
        await collegeData.deleteCourseById(req.params.id);
        res.redirect("/courses");
    } catch {
        res.status(500).send("Unable to remove course");
    }
});

// 404 Error Handling
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// Initialize Database and Start Server
collegeData
    .initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Failed to initialize database: ${err}`);
    });

module.exports = app;
