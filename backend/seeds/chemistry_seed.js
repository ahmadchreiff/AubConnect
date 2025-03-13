// backend/seeds/chemistry_seed.js
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Course = require('../models/Course');
const connectDB = require('../config/db');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('MongoDB connected for seeding Chemistry department...');

    // Find or create Chemistry department
    let chemistryDept = await Department.findOne({ code: 'CHEM' });
    
    if (!chemistryDept) {
      chemistryDept = await Department.create({
        name: 'Chemistry',
        code: 'CHEM',
        description: 'The Chemistry Department provides liberal arts and professional education in chemistry. The undergraduate program at the department is dedicated to teaching, scholarship, research and creative endeavors. Through this program, the department delivers a strong theoretical course of study and practical training in the chemical sciences.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${chemistryDept.name} (${chemistryDept._id})`);
    } else {
      console.log(`Using existing department: ${chemistryDept.name} (${chemistryDept._id})`);
    }

    // Define Chemistry courses
    const chemistryCoursesData = [
      {
        courseNumber: '101',
        name: 'General Chemistry I',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'An introductory course that covers atomic structure, chemical reactions, stoichiometry, gas laws, thermochemistry, periodic relationships among the elements, chemical bonding, and other basic concepts.',
        prerequisites: [],
        prefix: 'CHEM'
      },
      {
        courseNumber: '101L',
        name: 'General Chemistry Laboratory I',
        department: chemistryDept._id,
        creditHours: 1,
        description: 'A laboratory course to accompany CHEM 101. The experiments explore some of the fundamental concepts which deal with measurements, percent composition, chemical reactions, stoichiometry, volumetric analysis, gas laws, and calorimetry.',
        prerequisites: [],
        prefix: 'CHEM'
      },
      {
        courseNumber: '102',
        name: 'General Chemistry II',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'A course that covers solutions, chemical equilibrium, kinetics, acid-base and solubility equilibria, introductory thermodynamics and electrochemistry; surveys common groups in the periodic table; provides an introduction to organic chemistry and nuclear chemistry.',
        prerequisites: ['CHEM 101'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '102L',
        name: 'General Chemistry Laboratory II',
        department: chemistryDept._id,
        creditHours: 1,
        description: 'A laboratory course to accompany CHEM 102. The experiments explore some of the fundamental concepts which deal with physical properties of solutions, chemical equilibrium, acids and bases, solubility equilibria, kinetics and electrochemistry.',
        prerequisites: ['CHEM 101L'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '201',
        name: 'Chemical Principles',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'A theoretical introduction to chemical principles, stressing atomic structure, bonding, stoichiometry, gases, solutions, acids and bases, solution equilibria.',
        prerequisites: ['CHEM 101', 'CHEM 101L'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '201L',
        name: 'Introduction to Chemical Analysis Laboratory',
        department: chemistryDept._id,
        creditHours: 1,
        description: 'Introduces students to chemical analysis in a series of preparatory laboratory experiments. Students acquire knowledge in handling basic tools and equipment, conduct wet chemistry experiments and quantify aqueous solutes using simple laboratory devices.',
        prerequisites: [],
        prefix: 'CHEM'
      },
      {
        courseNumber: '211',
        name: 'Organic Chemistry I',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'An introduction to organic chemistry organized according to functional groups. This course covers synthesis, properties, and reactions of aliphatic and aromatic hydrocarbons and alkyl halides, with emphasis on mechanistic and stereochemical aspects of organic reactions.',
        prerequisites: ['CHEM 201'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '212',
        name: 'Organic Chemistry II',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'A course that covers synthesis, properties, and reactions of organic functional groups, including alcohols and ethers, aldehydes and ketones, carboxylic acids and derivatives, amines, phenols, and aryl halides; chemistry of difunctional compounds and of molecules of biological importance.',
        prerequisites: ['CHEM 211'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '215',
        name: 'Analytical Chemistry',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'A course that covers fundamental analytical processes, including solution equilibria, titrations, electrochemical theory and applications, chromatography and spectrophotometric techniques.',
        prerequisites: ['CHEM 201'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '216',
        name: 'Analytical Chemistry Laboratory',
        department: chemistryDept._id,
        creditHours: 2,
        description: 'Experimental work in related areas of chemical analysis and instrumentation including: complexometric analysis; ion-selective electrodes; spectrophotometric analysis; molecular spectroscopy; atomic spectroscopy; liquid chromatography; ion chromatography, gas chromatography, calibration methods.',
        prerequisites: ['CHEM 201L'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '217',
        name: 'Thermodynamics and Chemical Dynamics',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'A course that covers the basic principles of chemical thermodynamics and chemical dynamics; mathematical machinery of the laws of thermodynamics; heat, work and energy; first, second and third laws of thermodynamics; thermodynamics of chemical reactions, phase transformations and phase equilibria.',
        prerequisites: ['CHEM 201'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '218',
        name: 'Quantum Chemistry',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'A course that covers failures of classical physics, quantum theory, Schrödinger equation, particle in a box, harmonic oscillator, rotational motion, hydrogen atom, atomic orbitals, spin, Pauli exclusion principle, complex atoms, term symbols, molecular structure, hybridization, Hückel theory, rotation, vibration, and electronic spectra.',
        prerequisites: ['CHEM 201'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '220',
        name: 'Physical Chemistry Laboratory',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'Experiments in thermodynamics, kinetics, electrochemistry, spectroscopy, and exercise in computational chemistry.',
        prerequisites: ['CHEM 201L', 'CHEM 217'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '225',
        name: 'Organic Structure Determination',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'Experiments in the techniques of purification, separation, and synthesis of derivatives of organic compounds; theory and practice in the analysis of organic compounds by infrared, ultraviolet-visible spectrophotometry, mass spectrometry, and nuclear magnetic resonance.',
        prerequisites: ['CHEM 201L', 'CHEM 212'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '228',
        name: 'Inorganic Chemistry',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'A course that covers atomic structure, molecular structure (VBT, MOT), molecular shape (VSEPR), symmetry and group theory, the structure of solids (metals, ionic), acids and bases (Brønsted, Lewis, HSAB, solvents).',
        prerequisites: ['CHEM 201'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '229',
        name: 'Coordination Compounds',
        department: chemistryDept._id,
        creditHours: 3,
        description: 'A course that covers d-metal complexes (structures and symmetries, bonding and electronic structure, reactions of complexes); electronic spectra of complexes; reaction mechanisms of d-block complexes (ligand substitution reactions in square-planar and octahedral complexes, redox reactions, photochemical reactions).',
        prerequisites: ['CHEM 228'],
        prefix: 'CHEM'
      },
      {
        courseNumber: '230',
        name: 'Senior Seminar',
        department: chemistryDept._id,
        creditHours: 1,
        description: 'A literature search of a specific topic in chemistry. A written report and oral presentation in a seminar form.',
        prerequisites: [],
        prefix: 'CHEM'
      }
    ];

    // Handle each chemistry course individually to avoid bulk insert errors
    let addedChemCourses = 0;
    
    for (const courseData of chemistryCoursesData) {
      try {
        // Check if course already exists
        const existingCourse = await Course.findOne({
          department: chemistryDept._id,
          courseNumber: courseData.courseNumber,
          prefix: 'CHEM'
        });
        
        if (!existingCourse) {
          // Add new course
          await Course.create(courseData);
          addedChemCourses++;
        } else {
          // Optionally update existing course
          await Course.updateOne(
            { _id: existingCourse._id },
            { $set: courseData }
          );
          console.log(`Updated CHEM course ${courseData.courseNumber}`);
        }
      } catch (error) {
        console.warn(`Error handling CHEM course ${courseData.courseNumber}: ${error.message}`);
      }
    }
    
    console.log(`Added ${addedChemCourses} new CHEM courses for the ${chemistryDept.name} department`);
    console.log(`${chemistryCoursesData.length - addedChemCourses} CHEM courses already existed or were updated`);

    console.log('Chemistry department data seeding completed successfully!');
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