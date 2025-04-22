// backend/seeds/pspa_seed.js
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
    console.log('MongoDB connected for seeding Political Studies and Public Administration department...');

    // Find or create the Political Studies and Public Administration Department
    let pspaDept = await Department.findOne({ code: 'PSPA' });
    
    if (!pspaDept) {
      pspaDept = await Department.create({
        name: 'Political Studies and Public Administration',
        code: 'PSPA',
        description: 'The Department of Political Studies and Public Administration (PSPA) offers two major programs: one leading to the degree of Bachelor of Arts in Political Studies and one leading to the degree of Bachelor of Arts in Public Administration.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${pspaDept.name} (${pspaDept._id})`);
    } else {
      console.log(`Using existing department: ${pspaDept.name} (${pspaDept._id})`);
    }

    // Define Political Studies courses
    const pspaCourses = [
      {
        courseNumber: '101',
        name: 'Issues in Contemporary Politics',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course that examines the global context of politics, focusing on the changing world order in the twentieth century. Special attention is given to themes like democratization, civil society, ethnic conflict, human rights, and globalization.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '201',
        name: 'Introduction to Political Science',
        department: pspaDept._id,
        creditHours: 3,
        description: 'An introduction to the study of politics with emphasis on the basic concepts, ideas, and issues relating to the process of government in the modern state.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '202',
        name: 'Introduction to Public Administration',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course on the nature of public administration. Basic concepts, processes, and approaches in the field of public administration are introduced so that the student develops an appreciation for the role of public administration in modern society.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '203',
        name: 'Research Methods',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course that focuses on the problems involved in asking and answering questions about political science and public administration. This course presents the various analytical frameworks and methodological tools used for this purpose with emphasis on empirical approach, data collection, and analysis.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '210',
        name: 'Introduction to Political Thought',
        department: pspaDept._id,
        creditHours: 3,
        description: 'An introduction to the main Western and Islamic traditions in political philosophy and political theory.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '211',
        name: 'Introduction to Comparative Politics',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A survey of concepts and issues in comparative politics. This course acquaints the student with basic theoretical frameworks for the study and analysis of political phenomena, and establishes criteria for comparing political systems.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '212',
        name: 'Contemporary Trends in Public Administration and Management',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course that deals with the contemporary transformation of the public sector and its relationship with government and society. This course evaluates managerialism in the public sector, privatization, and entrepreneurial government.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '213',
        name: 'Introduction to International Politics',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A survey of the basic forces and factors determining relations among states, with special emphasis on the international system, foreign policy, national power, the restraints on determinants of state action, contemporary problems and major issues faced by states, and the patterns of interaction that prevail among states.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '214',
        name: 'Early and Medieval Islamic Thought',
        department: pspaDept._id,
        creditHours: 3,
        description: 'The course is an introduction to early and classical Islamic political thought. It focuses on the history, origins, developments and objectives of Islamic political history, theology, jurisprudence and politics as they relate to the state, society, and relations with non-Muslims.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '215',
        name: 'Modern Islamic Thought',
        department: pspaDept._id,
        creditHours: 3,
        description: 'The course is a survey that focuses on major political and ideological issues in the modern world of Islam and deals analytically with the major doctrines, movements, and trends that have been developed during the 19th and 20th centuries.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '223',
        name: 'Constitutional Law',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course that examines the constitutions and the development of constitutional mechanisms and practices in selected countries, with a focus on the Lebanese constitutional system.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '225',
        name: 'Public International Law I',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course introducing the basics of public international law, including its origins, purpose, sources, subjects, and response to international wrongful acts.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '253',
        name: 'Politics and Government: Middle East',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A survey of political institutions and processes in the Middle East, with an emphasis on social and political development, the policy-making process and international affairs.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '256',
        name: 'Politics in Lebanon',
        department: pspaDept._id,
        creditHours: 3,
        description: 'An overview of Lebanese politics in Mount Lebanon from the mid-nineteenth century to the formation of the Republic of Lebanon. This course deals with the origins, evolution, and workings of the confessional system with emphasis on the period after independence, from the civil war to the present.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '260',
        name: 'Introduction to Policy Analysis',
        department: pspaDept._id,
        creditHours: 3,
        description: 'This is an introductory course to policy analysis. Students should be familiar with the basic concepts and terminology of public policy and public administration.',
        prerequisites: ['PSPA 276'],
        prefix: 'PSPA'
      },
      {
        courseNumber: '273',
        name: 'Human Resources and Personnel Administration',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course that examines theories, practice, and problems relating to human resources and personnel administration. This course focuses on key aspects of human resources, planning, and their implications on public policy.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '276',
        name: 'Public Policy',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course that analyzes the nature, scope, and performance of public policy. This course examines the different approaches and models of public policy as well as the actors, instruments, and problems involved; the course draws on specific case studies.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '277',
        name: 'Public Budgeting',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A survey of the principles and problems of financial organization and management in the public service with emphasis on fiscal planning, formulation and execution of the budget, financial accountability, control, and other aspects related to the role of the budget in development.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '290',
        name: 'Senior Seminar in Social and Political Thought',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A senior seminar course exploring significant theories and issues in social and political thought.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '291',
        name: 'Senior Seminar in Middle Eastern Politics',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A senior seminar course focusing on political developments, structures, and issues in the Middle East region.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '292',
        name: 'Senior Seminar in Comparative Politics',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A senior seminar course investigating comparative approaches to the study of political systems, institutions, and processes.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '293',
        name: 'Senior Seminar in International Politics',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A senior seminar course examining key issues, theories, and developments in international relations and world politics.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '297',
        name: 'Senior Seminar in Organization Theory',
        department: pspaDept._id,
        creditHours: 3,
        description: 'This senior seminar provides an examination of the development, theoretical structure, major concerns, areas of emphasis and debates in the field of organization theory, from its origins to the present.',
        prerequisites: [],
        prefix: 'PSPA'
      },
      {
        courseNumber: '298',
        name: 'Senior Seminar in Public Policy and Administration',
        department: pspaDept._id,
        creditHours: 3,
        description: 'This course focuses on particular public policy issues. It explores the major debates, both theoretical and applied that frame contemporary discussions about public policy.',
        prerequisites: ['PSPA 276'],
        prefix: 'PSPA'
      },
      {
        courseNumber: '299',
        name: 'Internship Program',
        department: pspaDept._id,
        creditHours: 3,
        description: 'A course that explores politics and public administration through a variety of work experiences, both governmental and nongovernmental. Students are expected to perform work for academic credit under the guidance of a full-time PSPA faculty member.',
        prerequisites: [],
        prefix: 'PSPA'
      }
    ];

    // Insert Political Studies courses
    for (const course of pspaCourses) {
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

    console.log('Political Studies and Public Administration department seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding PSPA data:', error);
    process.exit(1);
  }
};

seedDatabase();