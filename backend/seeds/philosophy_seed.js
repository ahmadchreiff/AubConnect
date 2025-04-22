// backend/seeds/philosophy_seed.js
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Course = require('../models/Course');
const connectDB = require('../config/db');
// require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });


const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('MongoDB connected for seeding Philosophy department...');

    // Find or create Philosophy department
    let philosophyDept = await Department.findOne({ code: 'PHIL' });
    
    if (!philosophyDept) {
      philosophyDept = await Department.create({
        name: 'Philosophy',
        code: 'PHIL',
        description: 'The undergraduate program in Philosophy provides students with a knowledge of key historical and contemporary philosophers and philosophical problems, together with a range of responses to those problems. They promote respect for clarity, truth, critical reflection and rational argument.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${philosophyDept.name} (${philosophyDept._id})`);
    } else {
      console.log(`Using existing department: ${philosophyDept.name} (${philosophyDept._id})`);
    }

    // Define Philosophy courses
    const philosophyCoursesData = [
      {
        courseNumber: '101',
        name: 'Applied Philosophy',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'A course that deals with philosophical questions which have practical import; it aims to introduce students to the philosophical mode of analysis.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '102',
        name: 'Philosophical Classics',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'An introduction to the thought of some major figures in the history of philosophy.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '201',
        name: 'Introduction to Philosophy',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'An introduction to philosophy and its methods through an analysis of traditional issues in ethics, epistemology, metaphysics, and the philosophy of religion.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '210',
        name: 'Ethics',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'An introduction to some of the major normative ethical theories based on the study of the original writings of selected philosophers, including a section on applied ethics.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '211',
        name: 'Introduction to Logic',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'A first introduction to formal and informal logic, including argument analysis, informal fallacies, natural deduction methods in propositional and first-order predicate logic.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '213',
        name: 'History of Ancient and Medieval Philosophy',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'A survey of ancient and medieval philosophy from the pre-Socratics to Aquinas.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '214',
        name: 'History of Modern Philosophy',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'A survey of early modern philosophy, from Descartes to Kant.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '216',
        name: 'Political Philosophy',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'An examination of the main issues of political philosophy, such as political obligation, justice, political rights, and other issues.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '218',
        name: 'Metaphysics and Epistemology',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'An investigation of the most fundamental concepts involved in our thoughts about the world, including the nature of truth, knowledge, causality, substance, space, and time.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '221',
        name: 'Philosophy of Mind',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'An introductory examination of contemporary accounts of the nature of the mental and of psychological explanation.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '225',
        name: 'History of Moral Philosophy',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'A survey of some major historical traditions in moral philosophy, including at least one figure from ancient or medieval philosophy, and at least one figure from modern philosophy.',
        prerequisites: [],
        prefix: 'PHIL'
      },
      {
        courseNumber: '232',
        name: 'Islamic Philosophy',
        department: philosophyDept._id,
        creditHours: 3,
        description: 'An examination of the philosophical and religious thought of the major philosophers of Islam. Offered either in Arabic or in English.',
        prerequisites: [],
        prefix: 'PHIL'
      }
    ];

    // Handle each Philosophy course individually to avoid bulk insert errors
    let addedPhilCourses = 0;
    
    for (const courseData of philosophyCoursesData) {
      try {
        // Check if course already exists
        const existingCourse = await Course.findOne({
          department: philosophyDept._id,
          courseNumber: courseData.courseNumber,
          prefix: 'PHIL'
        });
        
        if (!existingCourse) {
          // Add new course
          await Course.create(courseData);
          addedPhilCourses++;
        } else {
          // Optionally update existing course
          await Course.updateOne(
            { _id: existingCourse._id },
            { $set: courseData }
          );
          console.log(`Updated PHIL course ${courseData.courseNumber}`);
        }
      } catch (error) {
        console.warn(`Error handling PHIL course ${courseData.courseNumber}: ${error.message}`);
      }
    }
    
    console.log(`Added ${addedPhilCourses} new PHIL courses for the ${philosophyDept.name} department`);
    console.log(`${philosophyCoursesData.length - addedPhilCourses} PHIL courses already existed or were updated`);

    console.log('Philosophy department data seeding completed successfully!');
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    return { success: true };
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.connection.close();
    console.log('Database connection closed due to error');
    process.exit(1);
  }
};

// Execute the seed function
seedDatabase();