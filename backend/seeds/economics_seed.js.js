// backend/seeds/economics_seed.js
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Course = require('../models/Course');
const connectDB = require('../config/db');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('MongoDB connected for seeding Economics department...');

    // Find or create Economics department
    let econDept = await Department.findOne({ code: 'ECON' });
    
    if (!econDept) {
      econDept = await Department.create({
        name: 'Economics',
        code: 'ECON',
        description: 'The undergraduate program in Economics is a rigorous quantitative program which enhances students\' analytical skills and critical thinking. In addition to broader economic concepts, the understanding of economic issues pertaining to the Middle East and North Africa region is given special attention. The department is committed to a liberal arts philosophy and the development of leadership skills in the field of economics. The Program develops its students\' professional competencies and responsible citizenship skills, and prepares them for a variety of careers in economic research, financial economics, and banking.',
        faculty: 'Arts and Sciences'
      });
      console.log(`Created department: ${econDept.name} (${econDept._id})`);
    } else {
      console.log(`Using existing department: ${econDept.name} (${econDept._id})`);
    }

    // Define Economics courses
    const economicsCoursesData = [
      {
        courseNumber: '101',
        name: 'Introduction to Microeconomics',
        department: econDept._id,
        creditHours: 3,
        description: 'An introductory survey of the principles of microeconomics, designed primarily for freshman students.',
        prerequisites: [],
        prefix: 'ECON'
      },
      {
        courseNumber: '102',
        name: 'Introduction to Macroeconomics',
        department: econDept._id,
        creditHours: 3,
        description: 'An introductory survey of the principles of macroeconomics, designed primarily for freshman students.',
        prerequisites: [],
        prefix: 'ECON'
      },
      {
        courseNumber: '203',
        name: 'Survey of Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'Elementary principles of microeconomics and macroeconomics and applications. Students majoring in economics cannot receive credit for ECON 203. Students who take ECON 203 may not receive credit for either ECON 211 or ECON 212.',
        prerequisites: [],
        prefix: 'ECON'
      },
      {
        courseNumber: '211',
        name: 'Elementary Microeconomic Theory',
        department: econDept._id,
        creditHours: 3,
        description: 'General principles of microeconomics; includes elements of supply and demand, consumer behavior, costs, market structures, and income distribution. Students cannot receive credit for both ECON 211 and AGSC 212; however, the courses will not be treated as equivalent. Students cannot receive credit for ECON 211, AGSC 212 and HMPD 251.',
        prerequisites: [],
        prefix: 'ECON'
      },
      {
        courseNumber: '212',
        name: 'Elementary Macroeconomic Theory',
        department: econDept._id,
        creditHours: 3,
        description: 'General principles of macroeconomics; aggregate supply and demand framework is used to analyze overall movements in prices and national output, inflation and unemployment, and monetary and fiscal policies. Students cannot receive credit for both ECON 203 and ECON 212.',
        prerequisites: [],
        prefix: 'ECON'
      },
      {
        courseNumber: '213',
        name: 'Economic Statistics I',
        department: econDept._id,
        creditHours: 3,
        description: 'Display of data, properties of probability, methods of enumeration, conditional probability and independent events; univariate and bivariate distributions corresponding to both discrete and continuous variables; expectation, variance, covariance and correlation, moment generating functions, independent random samples and the central limit theorem; basics of confidence intervals and hypothesis testing.',
        prerequisites: ['MATH 201'],
        prefix: 'ECON'
      },
      {
        courseNumber: '214',
        name: 'Economic Statistics and Econometrics',
        department: econDept._id,
        creditHours: 3,
        description: 'Classical linear regression model and the multiple regression model in matrix form; the criteria for estimators; multicollinearity, serial correlation, heteroskedasticity; identification and estimation of simultaneous equation models and applications.',
        prerequisites: ['ECON 211 or ECON 212', 'ECON 213 or STAT 230', 'MATH 201'],
        prefix: 'ECON'
      },
      {
        courseNumber: '215',
        name: 'Applied Econometrics',
        department: econDept._id,
        creditHours: 3,
        description: 'A comprehensive treatment of econometric techniques applied in cross-sectional and time series models. Topics include but are not limited to the estimation of bivariate and multiple regression models; validation tests; corrective methods employed when assumptions are violated; regressions with a qualitative dependent variable; logit models; VAR; and cointegration.',
        prerequisites: ['ECON 214'],
        prefix: 'ECON'
      },
      {
        courseNumber: '217',
        name: 'Intermediate Microeconomics',
        department: econDept._id,
        creditHours: 3,
        description: 'Theory of allocation of resources; consumers\' choice and classical demand theory, exchange and welfare; theory of production and cost; price and output determination under alternative market structures; game theory and applications to oligopoly.',
        prerequisites: ['ECON 211', 'MATH 201'],
        prefix: 'ECON'
      },
      {
        courseNumber: '218',
        name: 'Behavioral Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'This course is a continuation of intermediate microeconomics I and offers an introduction to behavioral and experimental economics. It uses neo-classical economics as a benchmark from which psychologically informed models are derived. The course covers the foundations of individual behavior in economics under certainty and uncertainty, the paradoxes of choice, and the study of alternative choice models. It also examines the elements of experimental economics including auctions, bargaining, and simulated markets and the elements of behavioral game theory such as public goods games, dictator games, and ultimatum games.',
        prerequisites: ['ECON 217'],
        prefix: 'ECON'
      },
      {
        courseNumber: '219',
        name: 'Economics of Financial Markets',
        department: econDept._id,
        creditHours: 3,
        description: 'A survey of capital markets and asset pricing models; determination of the link sbetween financial markets monetary policy, and economic growth.',
        prerequisites: ['ECON 227'],
        prefix: 'ECON'
      },
      {
        courseNumber: '221',
        name: 'History of Economic Thought',
        department: econDept._id,
        creditHours: 3,
        description: 'A survey of the history of economic thought, both theory and policy, with an emphasis on contemporary economic thought.',
        prerequisites: ['ECON 217 or ECON 227'],
        prefix: 'ECON'
      },
      {
        courseNumber: '222',
        name: 'Labor Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'A survey of the demand for and supply of labor, investment in human capital, market structure and efficiency of labor markets, collective bargaining, income distribution, and unemployment.',
        prerequisites: ['ECON 217'],
        prefix: 'ECON'
      },
      {
        courseNumber: '223',
        name: 'Economics of the Middle East',
        department: econDept._id,
        creditHours: 3,
        description: 'A study of the resource endowment of the Arab Middle Eastern economies; their development experience, and the general outlook for growth and development.',
        prerequisites: ['ECON 217 or ECON 227', 'ECON 211', 'ECON 212'],
        prefix: 'ECON'
      },
      {
        courseNumber: '226',
        name: 'Public Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'Introduction on the nature and the role of governments in the economy. This course covers market failure and government intervention, government failure and public choice, economic analysis of public policy, inequality and tax policy.',
        prerequisites: ['ECON 217'],
        prefix: 'ECON'
      },
      {
        courseNumber: '227',
        name: 'Intermediate Macroeconomics',
        department: econDept._id,
        creditHours: 3,
        description: 'A study of the aggregate approach to economics, including the determination of output, employment, interest rates, and the price level. Inflation and stabilization policies, budget deficits and the national debt, business cycles, theories of consumption, and investment behavior.',
        prerequisites: ['ECON 211', 'ECON 212', 'MATH 201'],
        corequisites: ['MATH 202'],
        prefix: 'ECON'
      },
      {
        courseNumber: '228',
        name: 'Monetary Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'Central banking and instruments of monetary management, alternative theories of the demand for money, the balance of payments and the processes of its adjustment.',
        prerequisites: ['ECON 227'],
        prefix: 'ECON'
      },
      {
        courseNumber: '230',
        name: 'Economic History',
        department: econDept._id,
        creditHours: 3,
        description: 'Economic development of Europe and other areas up to 1914, with special emphasis on a number of distinct problems in different countries and historical periods.',
        prerequisites: ['ECON 217 or ECON 227', 'ECON 211', 'ECON 212'],
        prefix: 'ECON'
      },
      {
        courseNumber: '232',
        name: 'The Economics of Institutions',
        department: econDept._id,
        creditHours: 3,
        description: 'This course will examine the role played by institutions and political economy considerations in determining overall economic performance. The course aims to describe the role and evolution of institutions in economic growth, to understand basic models of politics, and to introduce the dynamic effects of fiscal and monetary policy.',
        prerequisites: ['ECON 227'],
        prefix: 'ECON'
      },
      {
        courseNumber: '235',
        name: 'International Trade',
        department: econDept._id,
        creditHours: 3,
        description: 'Classical trade model, the Heckscher-Ohlin theorem and subsequent theoretical developments, tariffs, domestic distortions, customs union, trade, and economic growth.',
        prerequisites: ['ECON 217'],
        prefix: 'ECON'
      },
      {
        courseNumber: '236',
        name: 'International Finance',
        department: econDept._id,
        creditHours: 3,
        description: 'A study of macroeconomic equilibrium in an open economy. Topics covered include the interpretation of the national accounts, exchange rate determination, monetary policy in an open economy under fixed and floating exchange rates, balance of payments crises and contagion, and a historical perspective of the international monetary systems.',
        prerequisites: ['ECON 217', 'ECON 227'],
        prefix: 'ECON'
      },
      {
        courseNumber: '237',
        name: 'Economic Development I',
        department: econDept._id,
        creditHours: 3,
        description: 'An introduction to development economics that covers the theory and empirics of development, quality of life, poverty, inequality, and knowledge-based policy making in the context of the challenges faced by developing countries including market-oriented reforms, impact of globalization, urbanization, agricultural development, and gender equality.',
        prerequisites: ['ECON 217 or ECON 227'],
        prefix: 'ECON'
      },
      {
        courseNumber: '239',
        name: 'Introduction to Mathematical Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'Linear algebra, single variable optimization, multi-variable optimization, and constrained optimization- basic theoretical concepts and practical applications- with an emphasis on the use of general functional forms and on comparative statics and with several examples drawn from the economics of uncertainty.',
        prerequisites: ['ECON 217'],
        prefix: 'ECON'
      },
      {
        courseNumber: '240',
        name: 'Economic Development II',
        department: econDept._id,
        creditHours: 3,
        description: 'Models of economic development and growth; macroeconomic planning; policy formulation and implementation in developing countries.',
        prerequisites: ['ECON 227'],
        prefix: 'ECON'
      },
      {
        courseNumber: '241',
        name: 'Industrial Organization',
        department: econDept._id,
        creditHours: 3,
        description: 'Application of microeconomics; analysis of factors affecting market structure, conduct and firm behavior in imperfectly competitive industries; survey of theories relating to intensity of competition and maintenance of market dominance; rationale for antitrust laws.',
        prerequisites: ['ECON 217'],
        prefix: 'ECON'
      },
      {
        courseNumber: '242',
        name: 'Energy Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'This course introduces key aspects of major energy markets including oil, natural gas, coal, electricity, nuclear power, and renewable energy. It focuses on building economic models to analyze the various energy markets and uses these models to explore taxes and social welfare, government regulation and deregulation, public policy, and externalities.',
        prerequisites: ['ECON 217'],
        prefix: 'ECON'
      },
      {
        courseNumber: '243',
        name: 'Introduction to Game Theory and Economic Behavior',
        department: econDept._id,
        creditHours: 3,
        description: 'Basic concepts and methods of game theory with applications to economic problems, Nash equilibrium, mixed strategies, zero sum games, repeated games.',
        prerequisites: ['ECON 217'],
        prefix: 'ECON'
      },
      {
        courseNumber: '290',
        name: 'Special Topics in Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'May be repeated for credit on different topics.',
        prerequisites: [],
        prefix: 'ECON'
      },
      {
        courseNumber: '295',
        name: 'Senior Seminars in Economics',
        department: econDept._id,
        creditHours: 3,
        description: 'Senior level seminar course in Economics.',
        prerequisites: [],
        prefix: 'ECON'
      }
    ];

    // Handle each economics course individually to avoid bulk insert errors
    let addedEconCourses = 0;
    
    for (const courseData of economicsCoursesData) {
      try {
        // Check if course already exists
        const existingCourse = await Course.findOne({
          department: econDept._id,
          courseNumber: courseData.courseNumber,
          prefix: 'ECON'
        });
        
        if (!existingCourse) {
          // Add new course
          await Course.create(courseData);
          addedEconCourses++;
        } else {
          // Optionally update existing course
          await Course.updateOne(
            { _id: existingCourse._id },
            { $set: courseData }
          );
          console.log(`Updated ECON course ${courseData.courseNumber}`);
        }
      } catch (error) {
        console.warn(`Error handling ECON course ${courseData.courseNumber}: ${error.message}`);
      }
    }
    
    console.log(`Added ${addedEconCourses} new ECON courses for the ${econDept.name} department`);
    console.log(`${economicsCoursesData.length - addedEconCourses} ECON courses already existed or were updated`);

    console.log('Economics department data seeding completed successfully!');
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