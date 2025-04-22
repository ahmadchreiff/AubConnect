// backend/seeds/fine_arts_seed.js
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
    console.log('MongoDB connected for seeding Fine Arts and Art History department...');

    // Find or create Fine Arts and Art History department
    let fineArtsDept = await Department.findOne({ code: 'FAAH' });
    
    if (!fineArtsDept) {
      fineArtsDept = await Department.create({
        name: 'Fine Arts and Art History',
        code: 'FAAH',
        description: 'The Department of Fine Arts and Art History educates students in the arts in all their dimensions, believing that an understanding and appreciation of this area of human endeavor is an essential element in the formation of well-rounded individuals.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${fineArtsDept.name} (${fineArtsDept._id})`);
    } else {
      console.log(`Using existing department: ${fineArtsDept.name} (${fineArtsDept._id})`);
    }

    // Define Studio Art courses
    const studioArtCoursesData = [
      {
        courseNumber: '150',
        name: 'Studio Arts for Freshmen',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This course introduces students to studio practices in drawing, painting and sculpture. The projects develop representational skills based on the observation of nature.',
        prerequisites: [],
        prefix: 'SART'
      },
      {
        courseNumber: '200',
        name: 'Drawing',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This course introduces art students to the fundamentals of observational drawing through a variety of sketching techniques using wet and dry monochromatic media.',
        prerequisites: [],
        prefix: 'SART'
      },
      {
        courseNumber: '201',
        name: 'Painting I',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This course builds on the drawing skills acquired in the previous course and proposes the practice of painting as an investigative, expressive and conceptual tool.',
        prerequisites: ['SART 200'],
        prefix: 'SART'
      },
      {
        courseNumber: '202',
        name: 'Painting II',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This course follows Painting I, further developing students\' technical abilities and knowledge and introduces them to the specific practices of key modern and contemporary painters.',
        prerequisites: ['SART 200', 'SART 201'],
        prefix: 'SART'
      },
      {
        courseNumber: '203',
        name: 'Sculpture',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This course introduces students to the practice of modeling forms through the observation of nature. In a series of applied projects, students learn the modeling of forms and their organization in space.',
        prerequisites: [],
        prefix: 'SART'
      },
      {
        courseNumber: '206',
        name: 'Analog Photography',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This course introduces students to black & white analog photography. Through practical projects students discover the mechanical and conceptual possibilities of the camera and extend their learning in lab sessions that provide thorough darkroom experience.',
        prerequisites: [],
        prefix: 'SART'
      }
    ];

    // Define Art History courses
    const artHistoryCoursesData = [
      {
        courseNumber: '150',
        name: 'Introduction to Art History for Freshmen',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'A course that offers a fundamental overview of art and its development in the Western world, providing the students with a chronology and brief description of the main art periods and movements in the West.',
        prerequisites: [],
        prefix: 'AHIS'
      },
      {
        courseNumber: '203',
        name: 'Ancient Mediterranean Art',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This is a chronological examination of major Mediterranean empires taking students from Ancient Egypt to the fall of the western Roman Empire in the late 5th century CE.',
        prerequisites: [],
        prefix: 'AHIS'
      },
      {
        courseNumber: '208',
        name: 'Renaissance Art',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'A study of Renaissance art and architecture in Western Europe c.1300 - c.1600. The course covers a variety of influential works, their historical contexts and ways to understand them.',
        prerequisites: [],
        prefix: 'AHIS'
      },
      {
        courseNumber: '225',
        name: 'Art Now',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This course looks at contemporary art, as it is being produced, diffused and consumed in the present, while questioning what constitutes the present we live in historically, politically and ideologically.',
        prerequisites: [],
        prefix: 'AHIS'
      },
      {
        courseNumber: '251',
        name: 'Theories of Modern Art',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'The course grounds the concept of art in relation to the drastic transformations brought about by modernity from the mid 19th and to the mid 20th centuries.',
        prerequisites: [],
        prefix: 'AHIS'
      },
      {
        courseNumber: '284',
        name: 'History and Theory of Exhibitions',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'The course introduces students to the history of exhibition-making practices since the 19th century. It focuses on the historical and theoretical reevaluation of those exhibitions that had a major impact upon the way art history is written.',
        prerequisites: [],
        prefix: 'AHIS'
      }
    ];

    // Define Music courses
    const musicCoursesData = [
      {
        courseNumber: '150',
        name: 'Introduction to Western Music History for Freshmen',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'A course that will introduce students to examining music through a critical lens emphasizing the social and cultural context of the music.',
        prerequisites: [],
        prefix: 'MUSC'
      },
      {
        courseNumber: '200',
        name: 'Notation, Analysis and Audiation',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'This course covers musical analysis and audiation as the foundation for comprehension, performance, and creativity in music.',
        prerequisites: [],
        prefix: 'MUSC'
      },
      {
        courseNumber: '220',
        name: 'History of Western Music: Medieval to Classical',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'A history of western music from antiquity through the 17th century. It studies the coeval developments of musical technologies, institutions, practices and theories of music.',
        prerequisites: [],
        prefix: 'MUSC'
      },
      {
        courseNumber: '250',
        name: 'History of Arabic and Middle Eastern Music',
        department: fineArtsDept._id,
        creditHours: 3,
        description: 'A course introducing students to the history and key characteristics of Arabic and Middle Eastern music.',
        prerequisites: [],
        prefix: 'MUSC'
      }
    ];

    // Combine all FAAH courses
    const allFAAHCourses = [...studioArtCoursesData, ...artHistoryCoursesData, ...musicCoursesData];

    // Handle each FAAH course individually to avoid bulk insert errors
    let addedFAAHCourses = 0;
    
    for (const courseData of allFAAHCourses) {
      try {
        // Check if course already exists
        const existingCourse = await Course.findOne({
          department: fineArtsDept._id,
          courseNumber: courseData.courseNumber,
          prefix: courseData.prefix
        });
        
        if (!existingCourse) {
          // Add new course
          await Course.create(courseData);
          addedFAAHCourses++;
        } else {
          // Optionally update existing course
          await Course.updateOne(
            { _id: existingCourse._id },
            { $set: courseData }
          );
          console.log(`Updated ${courseData.prefix} course ${courseData.courseNumber}`);
        }
      } catch (error) {
        console.warn(`Error handling ${courseData.prefix} course ${courseData.courseNumber}: ${error.message}`);
      }
    }
    
    console.log(`Added ${addedFAAHCourses} new courses for the ${fineArtsDept.name} department`);
    console.log(`${allFAAHCourses.length - addedFAAHCourses} FAAH courses already existed or were updated`);

    console.log('Fine Arts and Art History department data seeding completed successfully!');
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