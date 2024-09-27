// a2.js
const collegeData = require('./modules/collegeData');

// Initialize the data module
collegeData.initialize()
  .then(() => {
    console.log("Initialization successful");

    // Test getAllStudents()
    return collegeData.getAllStudents();
  })
  .then((students) => {
    console.log(`Successfully retrieved ${students.length} students`);
    
    // Test getCourses()
    return collegeData.getCourses();
  })
  .then((courses) => {
    console.log(`Successfully retrieved ${courses.length} courses`);
    
    // Test getTAs()
    return collegeData.getTAs();
  })
  .then((tas) => {
    console.log(`Successfully retrieved ${tas.length} TAs`);
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
