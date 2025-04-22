// backend/seeds/english_seed.js
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
    console.log('MongoDB connected for seeding English department...');

    // Find or create English department
    let englishDept = await Department.findOne({ code: 'ENGL' });
    
    if (!englishDept) {
      englishDept = await Department.create({
        name: 'English',
        code: 'ENGL',
        description: 'The English Department offers courses in English language, English literature, literature in translation, visual and digital culture, and creative writing. The department also offers communication skills courses which are part of the university general education requirements.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${englishDept.name} (${englishDept._id})`);
    } else {
      console.log(`Using existing department: ${englishDept.name} (${englishDept._id})`);
    }

    // Define English courses
    const englishCoursesData = [
      {
        courseNumber: '100',
        name: 'Intensive English Course',
        department: englishDept._id,
        creditHours: 0,
        description: 'The Intensive English Course (IEC) is intended for undergraduate and graduate applicants to AUB who have been selected for admission but have not met the language requirement of Readiness for University Study in English (RUSE).',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '102',
        name: 'Enrichment Course in English',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course that offers instruction in the writing of short essays of various expository types (e.g., description, comparison and contrast, cause and effect). This course emphasizes communicative fluency and accuracy.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '203',
        name: 'Academic English',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course designed to develop critical thinking, reading, and writing at the sophomore level. Students compose essays based on their analysis of and response to thematic articles presented in class.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '204',
        name: 'Advanced Academic English',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course designed to provide rigorous training in reading comprehension, synthesis, critiquing, and research skills. Although ENGL 204 builds on many of the skills learned in ENGL 203, it differs in that it encourages more advanced independent research as well as writing and discussion in relation to a variety of issues across the curriculum.',
        prerequisites: ['ENGL 203'],
        prefix: 'ENGL'
      },
      {
        courseNumber: '205',
        name: 'English Literature I',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course that covers major literary works from the early medieval period to the later eighteenth century.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '207',
        name: 'English Literature II',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course that covers major works of literature from Romanticism to the contemporary period.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '209',
        name: 'Survey of American Literature',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course that covers major works of American literature and a broad range of writers.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '212',
        name: 'Shakespeare',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course that covers several representative plays by Shakespeare, with attention to form, cultural context and the theatrical practices of the period.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '221',
        name: 'Introduction to Literary Theory',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course that covers significant movements in the history of literary theory, with emphasis on the application of different theoretical schools in contemporary literary and cultural analysis.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '227',
        name: 'Introduction to Language',
        department: englishDept._id,
        creditHours: 3,
        description: 'A general introduction to the study of language structure and use. Students familiarize themselves with methods of linguistic analysis, which they apply to English and other languages.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '229',
        name: 'History of the English Language',
        department: englishDept._id,
        creditHours: 3,
        description: 'An introduction to the cultural and linguistic history of the English language in a global context.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '236',
        name: 'Creative Writing',
        department: englishDept._id,
        creditHours: 3,
        description: 'A workshop-based course in which students explore a variety of creative forms. Approach will vary from course to course, but will cover at least four genres such as fiction, nonfiction, poetry, drama, short film or graphic novel.',
        prerequisites: [],
        prefix: 'ENGL'
      },
      {
        courseNumber: '238',
        name: 'Academic Writing for English Majors',
        department: englishDept._id,
        creditHours: 3,
        description: 'A course for English majors that covers methods and practices of reading, writing, and research specific to the study of language and literature.',
        prerequisites: ['ENGL 204'],
        prefix: 'ENGL'
      },
      {
        courseNumber: '292',
        name: 'Capstone Seminar',
        department: englishDept._id,
        creditHours: 3,
        description: 'A writing-intensive course for majors that culminates in a research orientated project. Topics and approaches will vary depending on the instructor.',
        prerequisites: [],
        prefix: 'ENGL'
      }
    ];

    // Handle each English course individually to avoid bulk insert errors
    let addedEnglCourses = 0;
    
    for (const courseData of englishCoursesData) {
      try {
        // Check if course already exists
        const existingCourse = await Course.findOne({
          department: englishDept._id,
          courseNumber: courseData.courseNumber,
          prefix: 'ENGL'
        });
        
        if (!existingCourse) {
          // Add new course
          await Course.create(courseData);
          addedEnglCourses++;
        } else {
          // Optionally update existing course
          await Course.updateOne(
            { _id: existingCourse._id },
            { $set: courseData }
          );
          console.log(`Updated ENGL course ${courseData.courseNumber}`);
        }
      } catch (error) {
        console.warn(`Error handling ENGL course ${courseData.courseNumber}: ${error.message}`);
      }
    }
    
    console.log(`Added ${addedEnglCourses} new ENGL courses for the ${englishDept.name} department`);
    console.log(`${englishCoursesData.length - addedEnglCourses} ENGL courses already existed or were updated`);

    console.log('English department data seeding completed successfully!');
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