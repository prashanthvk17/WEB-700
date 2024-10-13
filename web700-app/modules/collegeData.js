const fs = require('fs');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports = {
    initialize: function() {
        return new Promise((resolve, reject) => {
            fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
                if (err) {
                    reject("unable to read students.json");
                    return;
                }
                let students = JSON.parse(studentDataFromFile);

                fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
                    if (err) {
                        reject("unable to read courses.json");
                        return;
                    }
                    let courses = JSON.parse(courseDataFromFile);

                    dataCollection = new Data(students, courses);
                    resolve();
                });
            });
        });
    },

    getAllStudents: function() {
        return new Promise((resolve, reject) => {
            if (dataCollection.students.length > 0) {
                resolve(dataCollection.students);
            } else {
                reject("no results returned");
            }
        });
    },

    getTAs: function() {
        return new Promise((resolve, reject) => {
            let tas = dataCollection.students.filter(student => student.TA === true);
            if (tas.length > 0) {
                resolve(tas);
            } else {
                reject("no results returned");
            }
        });
    },

    getCourses: function() {
        return new Promise((resolve, reject) => {
            if (dataCollection.courses.length > 0) {
                resolve(dataCollection.courses);
            } else {
                reject("no results returned");
            }
        });
    },

    // New function to get students by course
    getStudentsByCourse: function(course) {
        return new Promise((resolve, reject) => {
            let studentsInCourse = dataCollection.students.filter(student => student.course == course);
            if (studentsInCourse.length > 0) {
                resolve(studentsInCourse);
            } else {
                reject("no results returned");
            }
        });
    },

    // New function to get student by student number
    getStudentByNum: function(num) {
        return new Promise((resolve, reject) => {
            let student = dataCollection.students.find(student => student.studentNum == num);
            if (student) {
                resolve(student);
            } else {
                reject("no results returned");
            }
        });
    }
};

