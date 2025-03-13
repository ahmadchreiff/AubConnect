// backend/seeds/physics_seed.js
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Course = require('../models/Course');
const connectDB = require('../config/db');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('MongoDB connected for seeding Physics department...');

    // Find or create Physics department
    let physicsDept = await Department.findOne({ code: 'PHYS' });
    
    if (!physicsDept) {
      physicsDept = await Department.create({
        name: 'Physics',
        code: 'PHYS',
        description: 'The program leading to the Bachelor of Science emphasizes the fundamental concepts and principles of physics and their roles in a variety of disciplines with a liberal arts setting. The educational focus of the Physics Department is to provide the students with high-quality instruction in theoretical and experimental physics.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${physicsDept.name} (${physicsDept._id})`);
    } else {
      console.log(`Using existing department: ${physicsDept.name} (${physicsDept._id})`);
    }

    // Define Physics courses
    const physicsCoursesData = [
      {
        courseNumber: '101',
        name: 'Introductory Physics I',
        department: physicsDept._id,
        creditHours: 4,
        description: 'Measurements, motion in one dimension, vectors, motion in two dimensions, Newton\'s laws with applications, work and energy, circular motion, linear momentum and collisions, rotation and angular momentum, oscillations, gravity, and elements of fluid mechanics.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '101L',
        name: 'Introductory Physics Laboratory I',
        department: physicsDept._id,
        creditHours: 1,
        description: 'Error analysis, measuring devices, speed and acceleration, measurement of gravitational acceleration, forces, friction, circular motion, conservation of momentum, conservation of energy, ballistic pendulum, rotation, and simple harmonic motion.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '200',
        name: 'Understanding the Universe',
        department: physicsDept._id,
        creditHours: 3,
        description: 'An introductory course in astronomy. Basic astronomical tools, properties of the earth, solar system, sun, electromagnetic radiation, properties and evolution of stars, and the Milky Way galaxy. The course is intended for students in the social sciences and the humanities.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '210',
        name: 'Introductory Physics II',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Review of classical mechanics, fluid statics, fluid dynamics, temperature, heat and first law of thermodynamics, kinetic theory of gases, heat engines, entropy and second law of thermodynamics, general properties of waves, sound waves and resonances, light and optics, interference, diffraction, and polarization.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '211',
        name: 'Electricity and Magnetism',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Electrostatics, current, resistance, Ohm\'s law, Kirchhoff\'s laws, RC circuits, magnetic field, Ampere\'s law, Biot-Savart law, Faraday\'s law, LR circuit, RLC circuits, and a qualitative discussion of Maxwell\'s equations.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '212',
        name: 'Modern Physics',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Special theory of relativity, introductory quantum mechanics, atomic physics, nuclear physics, and introduction to elementary particles and cosmology.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '214',
        name: 'Introduction to Vibrations and Waves',
        department: physicsDept._id,
        creditHours: 3,
        description: 'This course aims to introduce students to the physical and mathematical properties shared by wave phenomena across scales and states of matter. It begins with the vibrations of a single particle, whether free or forced, with due consideration for resonances.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '216',
        name: 'Mathematical Methods for Physics',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Vector analysis, tensors, linear operators, Eigenvalue problems, determinants and matrices, Sturm-Liouville problems, special functions, Fourier series and transforms, complex analysis.',
        prerequisites: ['MATH 202'],
        prefix: 'PHYS'
      },
      {
        courseNumber: '217',
        name: 'Mechanics',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Kinematics of particles motion, Newtonian formulation of mechanics, integration of Newtonian equations of motion, Lagrangian formulation of mechanics, Hamilton dynamics, central forces, linear oscillations, nonlinear oscillations and chaos, collisions, noninertial systems, coupled oscillations, and motion of rigid bodies.',
        prerequisites: ['MATH 202'],
        prefix: 'PHYS'
      },
      {
        courseNumber: '220',
        name: 'Electromagnetic Theory',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Electrostatics: electric potential, Gauss\' law, Poisson\'s and Laplace\'s equations, boundary conditions, electric currents, Faraday\'s law, Lenz\'s law, mutual inductance. Maxwell\'s equations and propagation of electromagnetic waves.',
        prerequisites: ['MATH 202'],
        prefix: 'PHYS'
      },
      {
        courseNumber: '221L',
        name: 'Junior Physics Laboratory',
        department: physicsDept._id,
        creditHours: 3,
        description: 'This course is intended to help students acquire basic practical skills that are used in experimental physics. The course introduces students to some of the basic equipment that are used in this discipline. Experiments will cover a range of phenomena, including, electricity and magnetism, mechanics, optics, waves and modern physics.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '222',
        name: 'Computational Physics',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Basics of numerical analysis:Numerical solutions of algebraic and transcendental equations, methods for solving systems of linear and differential equations and scholastic methods. Applications: planetary motion, simple models of stars, nonlinear dynamics and chaos, potentials and fields, waves, random systems, computational fluid dynamics, statistical mechanics, molecular dynamics, and quantum mechanics.',
        prerequisites: ['CMPS 201'],
        prefix: 'PHYS'
      },
      {
        courseNumber: '235',
        name: 'Statistical Physics',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Boltzmann distribution, Gibbs distribution, thermal radiation, heat and work, kinetic theory of gases, entropy and temperature, statistical mechanics of semiconductors, kinetics of chemical reactions, and phase transitions.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '236',
        name: 'Quantum Mechanics',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Fundamental concepts: Bras, Kets, matrix representation of operators, change of basis; quantum dynamics: time evolution of quantum mechanical systems, spin; translational and rotational symmetry: Schrödinger equation in one and three dimensions; spherical symmetric systems: three-dimensional oscillator, hydrogen atom; theory of angular momentum: rotation operator, addition of angular momenta; time-independent perturbation theory, Zeeman effect, Stark effect, spin-orbit coupling, time-dependent perturbation theory, variational methods.',
        prerequisites: ['PHYS 212', 'PHYS 216'],
        prefix: 'PHYS'
      },
      {
        courseNumber: '257L',
        name: 'Advanced Laboratory',
        department: physicsDept._id,
        creditHours: 3,
        description: 'Students perform a selection of six to eight experiments from the following list: transient and steady states of SH-oscillator, coupled oscillators, Frank–Hertz experiment, Planck constant, Currie temperature, magnetic susceptibility, Millikan\'s drop oil experiment, Hall effect, Faraday rotation, Johnson noise, atomic spectroscopy, Zeeman effect, Paramagnetic resonance, pulsed nuclear magnetic resonance, X-ray diffraction, Brownian motion and optical pumping.',
        prerequisites: ['PHYS 221L'],
        prefix: 'PHYS'
      },
      {
        courseNumber: '299A',
        name: 'Physics in Applications',
        department: physicsDept._id,
        creditHours: 1,
        description: 'It is the first course in a series of two courses (PHYS 299A and PHYS 299B), taken in consecutive semesters. This is a capstone course required for Physics Majors and taken in two consecutive semesters. It includes lectures grouped in modules, a seminar, and a project.',
        prerequisites: [],
        prefix: 'PHYS'
      },
      {
        courseNumber: '299B',
        name: 'Physics in Applications',
        department: physicsDept._id,
        creditHours: 2,
        description: 'It is a continuation of PHYS 299A. This is a capstone course required for Physics Majors and taken in two consecutive semesters. It includes lectures grouped in modules, a seminar, and a project.',
        prerequisites: ['PHYS 299A'],
        prefix: 'PHYS'
      }
    ];

    // Handle each physics course individually to avoid bulk insert errors
    let addedPhysCourses = 0;
    
    for (const courseData of physicsCoursesData) {
      try {
        // Check if course already exists
        const existingCourse = await Course.findOne({
          department: physicsDept._id,
          courseNumber: courseData.courseNumber,
          prefix: 'PHYS'
        });
        
        if (!existingCourse) {
          // Add new course
          await Course.create(courseData);
          addedPhysCourses++;
        } else {
          // Optionally update existing course
          await Course.updateOne(
            { _id: existingCourse._id },
            { $set: courseData }
          );
          console.log(`Updated PHYS course ${courseData.courseNumber}`);
        }
      } catch (error) {
        console.warn(`Error handling PHYS course ${courseData.courseNumber}: ${error.message}`);
      }
    }
    
    console.log(`Added ${addedPhysCourses} new PHYS courses for the ${physicsDept.name} department`);
    console.log(`${physicsCoursesData.length - addedPhysCourses} PHYS courses already existed or were updated`);

    console.log('Physics department data seeding completed successfully!');
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