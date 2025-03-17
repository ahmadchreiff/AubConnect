// backend/seeds/remaining_professors_seed.js
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Professor = require('../models/Professor');
const connectDB = require('../config/db');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('MongoDB connected for seeding remaining professors...');

    // Find the Economics department
    let econDept = await Department.findOne({ code: 'ECON' });
    
    if (!econDept) {
      console.log('Economics department not found. Please run the original seed file first.');
      await mongoose.connection.close();
      return { success: false };
    }

    // Find the Mathematics department
    let mathDept = await Department.findOne({ code: 'MATH' });
    
    if (!mathDept) {
      console.log('Mathematics department not found. Please run the original seed file first.');
      await mongoose.connection.close();
      return { success: false };
    }

    // Additional Economics professors data (excluding the ones already added)
    const additionalEconProfessorsData = [
      {
        name: 'Ali Abboud',
        departments: [econDept._id],
        title: 'Assistant Professor',
        email: 'aa234@aub.edu.lb',
        bio: 'Research interests include economic theory and policy analysis.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Muhammed Alparslan Tuncay',
        departments: [econDept._id],
        title: 'Assistant Professor',
        email: 'mt153@aub.edu.lb',
        bio: 'Research interests include econometrics and economic models.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Nadine Yamout',
        departments: [econDept._id],
        title: 'Assistant Professor',
        email: 'ny44@aub.edu.lb',
        bio: 'Research interests include international economics and trade.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Makram Bou Nassar',
        departments: [econDept._id],
        title: 'Lecturer',
        email: 'mb129@aub.edu.lb',
        bio: 'Teaching interests include microeconomics and economic theory.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Usamah H. Ramadan',
        departments: [econDept._id],
        title: 'Lecturer',
        email: 'ur03@aub.edu.lb',
        bio: 'Teaching interests include macroeconomics and monetary theory.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Nora El Baba',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'ne82@aub.edu.lb',
        bio: 'Teaching interests include introductory economics courses.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Dana Hamdan',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'dh102@aub.edu.lb',
        bio: 'Teaching interests include economic statistics and research methods.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Hiba Hamadeh',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'hh173@aub.edu.lb',
        bio: 'Teaching interests include applied economics.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Maya Z. Kanaan',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'mk219@aub.edu.lb',
        bio: 'Teaching interests include economic development.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Ghina Makki',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'gm61@aub.edu.lb',
        bio: 'Teaching interests include financial economics.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Malak Z. Makki',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'mm294@aub.edu.lb',
        bio: 'Teaching interests include economic policy.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Pamela Nader',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'pn19@aub.edu.lb',
        bio: 'Teaching interests include economic analysis.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Sylvia Rebeiz',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'sr129@aub.edu.lb',
        bio: 'Teaching interests include economic theory.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Raja Sabra',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'rs184@aub.edu.lb',
        bio: 'Teaching interests include applied economics.',
        office: 'College Hall',
        avgRating: 0
      },
      {
        name: 'Farah Siblini',
        departments: [econDept._id],
        title: 'Instructor',
        email: 'fs82@aub.edu.lb',
        bio: 'Teaching interests include economic development and policy.',
        office: 'College Hall',
        avgRating: 0
      }
    ];

    // Additional Mathematics professors data (excluding the ones already added)
    const additionalMathProfessorsData = [
      {
        name: 'Nabil R. Nassif',
        departments: [mathDept._id],
        title: 'Professor',
        email: 'nn03@aub.edu.lb',
        bio: 'Research interests include numerical analysis and computational mathematics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Wissam V. Raji',
        departments: [mathDept._id],
        title: 'Professor',
        email: 'wr07@aub.edu.lb',
        bio: 'Research interests include number theory and computational mathematics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Bassam H. Shayya',
        departments: [mathDept._id],
        title: 'Professor',
        email: 'bs23@aub.edu.lb',
        bio: 'Research interests include analysis and differential equations.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Abbas M. Alhakim',
        departments: [mathDept._id],
        title: 'Associate Professor',
        email: 'aa145@aub.edu.lb',
        bio: 'Research interests include probability and statistics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Giuseppe A. Della Sala',
        departments: [mathDept._id],
        title: 'Associate Professor',
        email: 'gd51@aub.edu.lb',
        bio: 'Research interests include geometric analysis.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Sabine S. El Khoury',
        departments: [mathDept._id],
        title: 'Associate Professor',
        email: 'se56@aub.edu.lb',
        bio: 'Research interests include mathematical statistics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Tamer M. Tlas',
        departments: [mathDept._id],
        title: 'Associate Professor',
        email: 'tt89@aub.edu.lb',
        bio: 'Research interests include applied mathematics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Rafael B. Andrist',
        departments: [mathDept._id],
        title: 'Assistant Professor',
        email: 'ra233@aub.edu.lb',
        bio: 'Research interests include complex analysis.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Stefano Monni',
        departments: [mathDept._id],
        title: 'Assistant Professor',
        email: 'sm248@aub.edu.lb',
        bio: 'Research interests include mathematical physics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Sophie M. Moufawad',
        departments: [mathDept._id],
        title: 'Assistant Professor',
        email: 'sm262@aub.edu.lb',
        bio: 'Research interests include numerical linear algebra and high-performance computing.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Tristan Cyrus Roy',
        departments: [mathDept._id],
        title: 'Assistant Professor',
        email: 'tr15@aub.edu.lb',
        bio: 'Research interests include algebraic geometry.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Ahmad A. Sabra',
        departments: [mathDept._id],
        title: 'Assistant Professor',
        email: 'as253@aub.edu.lb',
        bio: 'Research interests include differential geometry.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Siamak Taati',
        departments: [mathDept._id],
        title: 'Assistant Professor',
        email: 'st72@aub.edu.lb',
        bio: 'Research interests include dynamical systems and probability theory.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Dolly J. Fayyad',
        departments: [mathDept._id],
        title: 'Lecturer',
        email: 'df08@aub.edu.lb',
        bio: 'Teaching interests include calculus and linear algebra.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Fatima K. Mroue',
        departments: [mathDept._id],
        title: 'Lecturer',
        email: 'fm33@aub.edu.lb',
        bio: 'Teaching interests include statistics and probability.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Hossam A. Yamani',
        departments: [mathDept._id],
        title: 'Lecturer',
        email: 'hy19@aub.edu.lb',
        bio: 'Teaching interests include applied mathematics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Alice N. Ashkar',
        departments: [mathDept._id],
        title: 'Instructor',
        email: 'aa176@aub.edu.lb',
        bio: 'Teaching interests include introductory mathematics courses.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Michella J. Bou Eid',
        departments: [mathDept._id],
        title: 'Instructor',
        email: 'mb134@aub.edu.lb',
        bio: 'Teaching interests include calculus and analytical mathematics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Najwa S. Fleihan',
        departments: [mathDept._id],
        title: 'Instructor',
        email: 'nf12@aub.edu.lb',
        bio: 'Teaching interests include algebra and discrete mathematics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Maha S. Itani-Hatab',
        departments: [mathDept._id],
        title: 'Instructor',
        email: 'mi49@aub.edu.lb',
        bio: 'Teaching interests include statistics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Zadour A. Khachadourian',
        departments: [mathDept._id],
        title: 'Instructor',
        email: 'zk15@aub.edu.lb',
        bio: 'Teaching interests include calculus and mathematical analysis.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Rana G. Nassif',
        departments: [mathDept._id],
        title: 'Instructor',
        email: 'rn53@aub.edu.lb',
        bio: 'Teaching interests include introductory mathematics.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Lina A. Rahhal',
        departments: [mathDept._id],
        title: 'Instructor',
        email: 'lr12@aub.edu.lb',
        bio: 'Teaching interests include mathematics for non-majors.',
        office: 'Bliss Hall',
        avgRating: 0
      },
      {
        name: 'Joumana A. Tannous',
        departments: [mathDept._id],
        title: 'Instructor',
        email: 'jt15@aub.edu.lb',
        bio: 'Teaching interests include mathematical applications.',
        office: 'Bliss Hall',
        avgRating: 0
      }
    ];

    // Handle each professor individually to avoid bulk insert errors
    let addedEconProfs = 0;
    let addedMathProfs = 0;
    
    // Add additional Economics professors
    for (const profData of additionalEconProfessorsData) {
      try {
        // Check if professor already exists
        const existingProf = await Professor.findOne({
          name: profData.name,
          departments: { $in: [econDept._id] }
        });
        
        if (!existingProf) {
          // Add new professor
          await Professor.create(profData);
          addedEconProfs++;
        } else {
          // Skip if already exists
          console.log(`Skipping existing ECON professor ${profData.name}`);
        }
      } catch (error) {
        console.warn(`Error handling ECON professor ${profData.name}: ${error.message}`);
      }
    }

    // Add additional Mathematics professors
    for (const profData of additionalMathProfessorsData) {
      try {
        // Check if professor already exists
        const existingProf = await Professor.findOne({
          name: profData.name,
          departments: { $in: [mathDept._id] }
        });
        
        if (!existingProf) {
          // Add new professor
          await Professor.create(profData);
          addedMathProfs++;
        } else {
          // Skip if already exists
          console.log(`Skipping existing MATH professor ${profData.name}`);
        }
      } catch (error) {
        console.warn(`Error handling MATH professor ${profData.name}: ${error.message}`);
      }
    }
    
    console.log(`Added ${addedEconProfs} new ECON professors`);
    console.log(`Added ${addedMathProfs} new MATH professors`);

    console.log('Remaining professors data seeding completed successfully!');
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