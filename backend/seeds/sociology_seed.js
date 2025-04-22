// backend/seeds/sociology_seed.js
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
    console.log('MongoDB connected for seeding Sociology, Anthropology, and Media Studies department...');

    // Find or create SOAN department
    let soanDept = await Department.findOne({ code: 'SOAN' });
    
    if (!soanDept) {
      soanDept = await Department.create({
        name: 'Sociology, Anthropology, and Media Studies',
        code: 'SOAN',
        description: 'The Department of Sociology, Anthropology, and Media Studies offers combined BA degrees designed for students with interests in sociology, anthropology, and media studies. It offers multi-disciplinary curriculums based on the social sciences and the humanities.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${soanDept.name} (${soanDept._id})`);
    } else {
      console.log(`Using existing department: ${soanDept.name} (${soanDept._id})`);
    }

    // Define SOAN courses
    const soanCourses = [
      {
        courseNumber: '101',
        name: 'Freshman Sociology',
        department: soanDept._id,
        creditHours: 3,
        description: 'An introduction to the principles and concepts of sociology to prepare students for majoring in sociology. Students who take this course cannot receive credit for SOAN 201.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '103',
        name: 'Reading Other Cultures',
        department: soanDept._id,
        creditHours: 3,
        description: 'An introduction to the study of other cultures drawing on film, ethnographic case studies, and topical debates. This course presents basic concepts in the comparative study of culture, methods of observing and interpreting other cultures, a sense of how knowledge about other cultures is constructed, and tools to develop a critical awareness of one\'s own cultural traditions.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '201',
        name: 'Introduction to Sociology',
        department: soanDept._id,
        creditHours: 3,
        description: 'An introduction to the study of social phenomena. Basic concepts, principles, and methods common to the study of society are employed for the analysis of structure and change in society.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '203',
        name: 'Introduction to Anthropology',
        department: soanDept._id,
        creditHours: 3,
        description: 'An introduction to socio-cultural anthropology. Anthropology offers comparative perspectives on the ways people live in the world. In doing so, it challenges some of our commonly held assumptions about what is natural and universal.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '210',
        name: 'Research Methods',
        department: soanDept._id,
        creditHours: 3,
        description: 'A survey of the basic techniques and designs of social research, including both quantitative and qualitative methods, the relationship between micro and macro approaches to society, and the interplay between theory and research.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '212',
        name: 'History and Theory in Anthropology',
        department: soanDept._id,
        creditHours: 3,
        description: 'A survey of some of the major theoretical perspectives and critical issues of classical and contemporary anthropological theory. Special focus is placed on the intellectual history of the discipline, an analysis of the contexts in which it developed and tools to recognize and critically evaluate different perspectives on culture and society.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '213',
        name: 'Sociological Theory',
        department: soanDept._id,
        creditHours: 3,
        description: 'A survey of some of the major theoretical perspectives and critical issues of classical and contemporary sociological theory. Special focus is placed on four interrelated dimensions: 1) the nature of sociological theory and its intellectual sources, 2) its classic tradition, particularly the legacies of Marx, Durkheim, and Weber, 3) an exploration of salient contemporary perspectives, 4) the emergence of new theories and/or directions, such as post-modernity and global sociology.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '216',
        name: 'Hands-On Anthropology',
        department: soanDept._id,
        creditHours: 3,
        description: 'An introduction to the techniques, theories, and debates concerning ethnographic fieldwork. What do anthropologists actually do and what is unique about anthropological research? This course explores the politics and ethics of research, kinds of observation, effective interviewing strategies, note-taking, ways of \'coding\' or indexing information, data analysis, and approaches to writing.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '220',
        name: 'City and Society',
        department: soanDept._id,
        creditHours: 3,
        description: 'An introduction to some of the leading conceptual and methodological perspectives for the study of transformations in human settlements. The course explores issues associated with the evolution of cities, their spatial and cultural features, and the social production of informal space and the gendering of space. Changing trends and patterns in Third World urbanization are explored with special focus on the Arab World, global, and post-modern cities.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '225',
        name: 'Gender and Culture',
        department: soanDept._id,
        creditHours: 3,
        description: 'An examination of gender holistically and cross-culturally from a social-anthropological perspective. This course examines how meanings of sex variation are constructed and gender is performed by individuals and groups in different societies. It studies the roles of women and men in ritual, in economic and political systems, and in other social arenas.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '237',
        name: 'Arab Culture and Society',
        department: soanDept._id,
        creditHours: 3,
        description: 'A study of contemporary Arab society: its complexity, diversity, and internal dynamics. This course considers social structures, social groups, cultural patterns, and processes and agents of social and cultural change, and examines current debates on major issues in Arab culture and society.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '240',
        name: 'Seminar in Human Rights and Cultural Differences',
        department: soanDept._id,
        creditHours: 3,
        description: 'A seminar that provides students with an introduction to the history, concepts, institutions, and applications of human rights. Although drawn mainly from a Western perspective, applications are canvassed from the Middle East as well.',
        prerequisites: [],
        prefix: 'SOAN'
      },
      {
        courseNumber: '245',
        name: 'Seminar in Transitional Justice',
        department: soanDept._id,
        creditHours: 3,
        description: 'The seminar is an exploration of the strategies and courses of action societies confront as they consider legacies of past human rights abuses or atrocities. It examines the ways in which states and the international community attempt to achieve justice in periods of political transition.',
        prerequisites: [],
        prefix: 'SOAN'
      }
    ];

    // Define Media and Communication courses
    const mcomCourses = [
      {
        courseNumber: '201',
        name: 'Introduction to Media Studies',
        department: soanDept._id,
        creditHours: 3,
        description: 'An introduction to the field of media studies, its concepts and theories, and the various modern media industries and professions in today\'s world. The course aims to help students become better informed about career options in this field and more discerning media consumers.',
        prerequisites: [],
        prefix: 'MCOM'
      },
      {
        courseNumber: '202',
        name: 'Communication Theory',
        department: soanDept._id,
        creditHours: 3,
        description: 'An overview of the ways in which mass communication has been viewed by social scientists and by practitioners, with a focus on the range of issues studied and questions raised, and the schools, approaches, and trends in the field.',
        prerequisites: [],
        prefix: 'MCOM'
      },
      {
        courseNumber: '203',
        name: 'Arab Media and Society',
        department: soanDept._id,
        creditHours: 3,
        description: 'An in-depth examination of the political, social, economic, and technological effects of old and new Arab media systems on modern Arab society, with an emphasis on Lebanon and the Arab East region. It focuses on probing the development and current state of print, broadcast and new media systems in the region.',
        prerequisites: [],
        prefix: 'MCOM'
      },
      {
        courseNumber: '204',
        name: 'From Telegraph to Twitter: Media History',
        department: soanDept._id,
        creditHours: 3,
        description: 'This course situates the history of communication – from the telegraph to today\'s social media – as more than a history of technology, and discusses the complexity with which the social world is constructed. Both technology and history enter into conversation, opening up points of critical engagement of modern understandings of the world.',
        prerequisites: [],
        prefix: 'MCOM'
      },
      {
        courseNumber: '260',
        name: 'Senior Seminar in Media Studies',
        department: soanDept._id,
        creditHours: 3,
        description: 'A senior undergraduate seminar on the role of media in society. The content areas may change.',
        prerequisites: [],
        prefix: 'MCOM'
      },
      {
        courseNumber: '296',
        name: 'Internship',
        department: soanDept._id,
        creditHours: 3,
        description: 'A summer period of guided work experience supervised by the MCOM Internships and Workshops Coordinator and designed to acquaint students with a specific media/communication profession and help them acquire core values and basic skills necessary for finding future work and succeeding in that profession.',
        prerequisites: [],
        prefix: 'MCOM'
      }
    ];

    // Insert SOAN courses
    for (const course of soanCourses) {
      const existingCourse = await Course.findOne({
        prefix: course.prefix,
        courseNumber: course.courseNumber
      });

      if (!existingCourse) {
        await Course.create(course);
        console.log(`Created course: ${course.prefix} ${course.courseNumber} - ${course.name}`);
      } else {
        console.log(`Course ${course.prefix} ${course.courseNumber} already exists`);
      }
    }

    // Insert MCOM courses
    for (const course of mcomCourses) {
      const existingCourse = await Course.findOne({
        prefix: course.prefix,
        courseNumber: course.courseNumber
      });

      if (!existingCourse) {
        await Course.create(course);
        console.log(`Created course: ${course.prefix} ${course.courseNumber} - ${course.name}`);
      } else {
        console.log(`Course ${course.prefix} ${course.courseNumber} already exists`);
      }
    }
    
    console.log('Sociology, Anthropology, and Media Studies department seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding SOAN data:', error);
    process.exit(1);
  }
};

seedDatabase();