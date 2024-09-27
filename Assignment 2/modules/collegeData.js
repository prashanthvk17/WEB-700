// collegeData.js
const fs = require('fs');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports = {
    // Initialize function to read data from students.json and courses.json
    initialize: function() {
        return new Promise((resolve, reject) => {
            // Read students.json
            fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
                if (err) {
                    reject("unable to read students.json");
                    return;
                }
                let students = JSON.parse(studentDataFromFile);
                
                // Read courses.json only after students.json has been successfully read
                fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
                    if (err) {
                        reject("unable to read courses.json");
                        return;
                    }
                    let courses = JSON.parse(courseDataFromFile);

                    // Create a new instance of the Data class and assign it to dataCollection
                    dataCollection = new Data(students, courses);

                    // Resolve the promise to indicate success
                    resolve();
                });
            });
        });
    },

    // Return all students
    getAllStudents: function() {
        return new Promise((resolve, reject) => {
            if (dataCollection.students.length > 0) {
                resolve(dataCollection.students);
            } else {
                reject("no results returned");
            }
        });
    },

    // Return all students who are TAs
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

    // Return all courses
    getCourses: function() {
        return new Promise((resolve, reject) => {
            if (dataCollection.courses.length > 0) {
                resolve(dataCollection.courses);
            } else {
                reject("no results returned");
            }
        });
    }
};
