// backend/seeds/biology_seed.js
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Course = require('../models/Course');
const connectDB = require('../config/db');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('MongoDB connected for seeding Biology department...');

    // Find or create Biology department
    let biologyDept = await Department.findOne({ code: 'BIOL' });
    
    if (!biologyDept) {
      biologyDept = await Department.create({
        name: 'Biology',
        code: 'BIOL',
        description: 'The BS program in Biology prepares students for advanced study and careers in research, education, and service in Biology-related disciplines. Students will acquire descriptive, experimental, quantitative, and conceptual abilities spanning molecular, cellular, organismal, and ecological levels.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${biologyDept.name} (${biologyDept._id})`);
    } else {
      console.log(`Using existing department: ${biologyDept.name} (${biologyDept._id})`);
    }

    // Define Biology courses
    const biologyCoursesData = [
      {
        courseNumber: '101',
        name: 'Basic Concepts in Biology',
        department: biologyDept._id,
        creditHours: 3,
        description: 'A course that deals with the basic concepts in biology and prepares students for BIOL 201 and BIOL 202. This course introduces the student to the forms and functions of plants and animals, and to the principles of genetics, evolution, and ecology.',
        prerequisites: [],
        prefix: 'BIOL'
      },
      {
        courseNumber: '102',
        name: 'Basic Concepts in Biology II',
        department: biologyDept._id,
        creditHours: 3,
        description: 'This course is only intended for freshman students who have taken BIOL 101 and plan to continue their education in the field of biological sciences as it prepares students for BIOL 201 and 202. The course introduces students to the forms and functions of animals.',
        prerequisites: ['BIOL 101'],
        prefix: 'BIOL'
      },
      {
        courseNumber: '201',
        name: 'General Biology I',
        department: biologyDept._id,
        creditHours: 4,
        description: 'An integrated approach to the biology of organisms covering the organization of life, energy transfer through living systems, perpetuation of life, and diversity of life.',
        prerequisites: [],
        prefix: 'BIOL'
      },
      {
        courseNumber: '202',
        name: 'General Biology II',
        department: biologyDept._id,
        creditHours: 4,
        description: 'A study of the anatomy and physiology of plants and animals covering their structure, growth, nutrition, transport, reproduction, development, and control systems. This course focuses also on the relationships between structure and function, and stresses the evolutionary adaptation and changes in the different systems of the major plant and animal groups.',
        prerequisites: ['BIOL 201'],
        prefix: 'BIOL'
      },
      {
        courseNumber: '220',
        name: 'Introductory Biochemistry',
        department: biologyDept._id,
        creditHours: 3,
        description: 'An introduction to the structure-function relationships of biomolecules, cells, enzymes, and the metabolic reactions of living cells.',
        prerequisites: ['BIOL 202', 'CHEM 211'],
        prefix: 'BIOL'
      },
      {
        courseNumber: '223',
        name: 'Genetics',
        department: biologyDept._id,
        creditHours: 4,
        description: 'A course that deals with the basic principles of classical and modern genetics with emphasis on the analysis of genetic material and genetic processes at the molecular level.',
        prerequisites: ['BIOL 202'],
        prefix: 'BIOL'
      },
      {
        courseNumber: '224',
        name: 'Microbiology',
        department: biologyDept._id,
        creditHours: 4,
        description: 'A course that deals with micro-organisms, especially bacteria, and in particular those of pathogenic and industrial importance. This course includes basic knowledge on isolation, classification, and the various metabolic processes.',
        prerequisites: ['BIOL 223'],
        prefix: 'BIOL'
      },
      {
        courseNumber: '240',
        name: 'Animal Behavior',
        department: biologyDept._id,
        creditHours: 3,
        description: 'A course that covers the basic concepts of animal behavior including physiological, genetic, ecological, and evolutionary aspects, as well as exploration of the controversial ideas of sociobiology.',
        prerequisites: [],
        prefix: 'BIOL'
      },
      {
        courseNumber: '252',
        name: 'Ecology',
        department: biologyDept._id,
        creditHours: 4,
        description: 'A study of organisms in relation to their biotic and abiotic environment. This course deals with population growth and regulation, species diversity, age structure, succession, food chains, energy flow, and recycling of nutrients.',
        prerequisites: ['BIOL 202'],
        prefix: 'BIOL'
      },
      {
        courseNumber: '260',
        name: 'Cell Biology',
        department: biologyDept._id,
        creditHours: 4,
        description: 'A course that provides an understanding of the structure and function of cellular organelles and components, and the functional interaction of the cell with its microenvironment.',
        prerequisites: ['BIOL 223'],
        prefix: 'BIOL'
      },
      {
        courseNumber: '270',
        name: 'Plant Physiology',
        department: biologyDept._id,
        creditHours: 4,
        description: 'A study of the vital processes that occur in flowering plants, including biophysical and metabolic processes, with emphasis on photosynthesis, growth, and development. This course also deals with plant responses to the physical environment.',
        prerequisites: ['BIOL 220'],
        prefix: 'BIOL'
      },
      {
        courseNumber: '290',
        name: 'Special Topics in Biology',
        department: biologyDept._id,
        creditHours: 4,
        description: 'The course covers topics in biology that warrant an extensive coverage in a separate course not typically offered by the department. May be repeated for credit.',
        prerequisites: [],
        prefix: 'BIOL'
      },
      {
        courseNumber: '293',
        name: 'Undergraduate Seminar',
        department: biologyDept._id,
        creditHours: 1,
        description: 'Prerequisite: Senior standing.',
        prerequisites: [],
        prefix: 'BIOL'
      },
      {
        courseNumber: '296',
        name: 'Exit Survey',
        department: biologyDept._id,
        creditHours: 0,
        description: 'A computer-based exit exam taken in the last term in the BS in Biology program. Prerequisite: Completion of graduation requirements for BS in Biology by the end of term. Graded Pass/No Pass (or Fail).',
        prerequisites: [],
        prefix: 'BIOL'
      }
    ];

    // Handle each biology course individually to avoid bulk insert errors
    let addedBioCourses = 0;
    
    for (const courseData of biologyCoursesData) {
      try {
        // Check if course already exists
        const existingCourse = await Course.findOne({
          department: biologyDept._id,
          courseNumber: courseData.courseNumber,
          prefix: 'BIOL'
        });
        
        if (!existingCourse) {
          // Add new course
          await Course.create(courseData);
          addedBioCourses++;
        } else {
          // Optionally update existing course
          await Course.updateOne(
            { _id: existingCourse._id },
            { $set: courseData }
          );
          console.log(`Updated BIOL course ${courseData.courseNumber}`);
        }
      } catch (error) {
        console.warn(`Error handling BIOL course ${courseData.courseNumber}: ${error.message}`);
      }
    }
    
    console.log(`Added ${addedBioCourses} new BIOL courses for the ${biologyDept.name} department`);
    console.log(`${biologyCoursesData.length - addedBioCourses} BIOL courses already existed or were updated`);

    console.log('Biology department data seeding completed successfully!');
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