const Sequelize = require('sequelize');

// Configure Sequelize with PostgreSQL credentials
const sequelize = new Sequelize('neonDB', 'neonDB_owner', 'a0FWCpN8hydz', {
    host: 'ep-green-forest-a50a683n.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
});

// Define the Student model
const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    course: Sequelize.INTEGER,
});

// Define the Course model
const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

// Define relationships
Course.hasMany(Student, { foreignKey: 'course' });

module.exports = {
    // Initialize the database
    initialize: function () {
        return new Promise((resolve, reject) => {
            sequelize
                .sync()
                .then(() => resolve())
                .catch((err) => reject("Unable to sync the database: " + err));
        });
    },

    // Get all students
    getAllStudents: function () {
        return new Promise((resolve, reject) => {
            Student.findAll()
                .then((data) => resolve(data))
                .catch(() => reject("No results returned"));
        });
    },

    // Get all TAs
    getTAs: function () {
        return new Promise((resolve, reject) => {
            Student.findAll({ where: { TA: true } })
                .then((data) => resolve(data))
                .catch(() => reject("No results returned"));
        });
    },

    // Get all courses
    getCourses: function () {
        return new Promise((resolve, reject) => {
            Course.findAll()
                .then((data) => resolve(data))
                .catch(() => reject("No results returned"));
        });
    },

    // Get students by course
    getStudentsByCourse: function (course) {
        return new Promise((resolve, reject) => {
            Student.findAll({ where: { course } })
                .then((data) => resolve(data))
                .catch(() => reject("No results returned"));
        });
    },

    // Get a student by student number
    getStudentByNum: function (num) {
        return new Promise((resolve, reject) => {
            Student.findOne({ where: { studentNum: num } })
                .then((data) => resolve(data))
                .catch(() => reject("No results returned"));
        });
    },

    // Add a new student
    addStudent: function (studentData) {
        return new Promise((resolve, reject) => {
            // Ensure TA is true/false and replace empty strings with null
            studentData.TA = studentData.TA ? true : false;
            for (const prop in studentData) {
                if (studentData[prop] === '') studentData[prop] = null;
            }

            Student.create(studentData)
                .then(() => resolve())
                .catch(() => reject("Unable to create student"));
        });
    },

    // Add a new course
    addCourse: function (courseData) {
        return new Promise((resolve, reject) => {
            for (const prop in courseData) {
                if (courseData[prop] === '') courseData[prop] = null;
            }

            Course.create(courseData)
                .then(() => resolve())
                .catch(() => reject("Unable to create course"));
        });
    },

    // Get a course by ID
    getCourseById: function (id) {
        return new Promise((resolve, reject) => {
            Course.findOne({ where: { courseId: id } })
                .then((data) => resolve(data))
                .catch(() => reject("No results returned"));
        });
    },

    // Update a student
    updateStudent: function (studentData) {
        return new Promise((resolve, reject) => {
            studentData.TA = studentData.TA ? true : false;
            for (const prop in studentData) {
                if (studentData[prop] === '') studentData[prop] = null;
            }

            Student.update(studentData, { where: { studentNum: studentData.studentNum } })
                .then(() => resolve())
                .catch(() => reject("Unable to update student"));
        });
    },

    // Update a course
    updateCourse: function (courseData) {
        return new Promise((resolve, reject) => {
            for (const prop in courseData) {
                if (courseData[prop] === '') courseData[prop] = null;
            }

            Course.update(courseData, { where: { courseId: courseData.courseId } })
                .then(() => resolve())
                .catch(() => reject("Unable to update course"));
        });
    },

    // Delete a student by student number
    deleteStudentByNum: function (studentNum) {
        return new Promise((resolve, reject) => {
            Student.destroy({ where: { studentNum } })
                .then(() => resolve())
                .catch(() => reject("Unable to delete student"));
        });
    },

    // Delete a course by ID
    deleteCourseById: function (courseId) {
        return new Promise((resolve, reject) => {
            Course.destroy({ where: { courseId } })
                .then(() => resolve())
                .catch(() => reject("Unable to delete course"));
        });
    },
};
