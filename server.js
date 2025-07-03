// require("dotenv").config(); //Now need to do this when loading in package.json npm start command.
// const express = require("express");
// const app = express();
// const serverless = require('serverless-http');
// const morgan = require('morgan');

// const i18next = require('i18next')
// const Backend = require('i18next-fs-backend')
// const middleware = require('i18next-http-middleware')

// // const createDatabaseConnection = require('./config/db.config');
// const prisma = require('./config/prismaClient');

// const UsersRoutes = require('./routes/users.routes');
// const AdminRoutes = require('./routes/admin.routes')
// const PrivilegesRoutes = require('./routes/privilege.routes')

// // const getPresignedUrl = require('./middlewares/S3/s3-presignedUrl');
// // getPresignedUrl("user/1751462499648-bdcamsetup.exe");

// i18next.use(Backend).use(middleware.LanguageDetector)
//   .init({
//     fallbackLng: 'en',
//     backend: {
//       loadPath: './locales/{{lng}}/translation.json'
//     }
//   });

// const cors = require("cors");
// const { encryptionFunction, decryptionFunction } = require("./utils/encryptDecrypt");
// const port = process.env.PORT || 3001;
// let corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200,
// }

// app.use(cors(corsOptions));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(middleware.handle(i18next));
// app.use(morgan('dev'));

// UsersRoutes(app);
// AdminRoutes(app);
// PrivilegesRoutes(app);

// // Handle 404 (Not Found)
// app.use((req, res, next) => {
//   res.status(404).send({
//     error: 'Page Not Found',
//     message: 'The requested resource was not found'
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(400).send({
//     error: 'Internal Server Error',
//     message: err.name,
//     data: err.message,
//     completeErrorObject: err
//   });
// });

// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });

// // Check database connection and start the server
// // commented below code for serverless aws lambda to run
// async function startServer() {
//   try {
//     // Start the server
//     app.listen(port, () => {
//       console.log(`🚀 Server is running on port ${port}`);
//     });
//     // Attempt to connect to the database
//     await prisma.$connect();
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("Database connection error:", error);
//     process.exit(1); // Exit the process with an error code
//   }
// }

// startServer();

// // createDatabaseConnection();

// module.exports.handler = async (event, context) => {
//   console.log(JSON.stringify(event));
//   context.callbackWaitsForEmptyEventLoop = false;
//   // createDatabaseConnection();
//   await prisma.$connect();
//   const result = await serverless(app)(event, context);
//   await prisma.$disconnect();
//   return result;
// };


// const data = {
//   "username" : "jhon",
//   "email": "john.doe@example.com",
//   "password": "admin",
//   "confirmPassword" : "admin"
// }
// const encryption = encryptionFunction(data)
// console.log(encryption);

// const decryption = decryptionFunction("8e04acf86edfbbab01782a2a73f445c9c9d4b88c9ab6ca56f92a5fd0f413e24a5f20b8835bb8fb22407a50a53135a0f9a58066473cc208688462ab8d5b5882936eb73504733ff079723e4990bd95c8848f46dbb00a164b6310a569b1efba777610a37eae0709dbc65e00cb6a3e9a912fbd029792ccaa79bcd40bf8e90006d6e435e07cddaba536114401cec9f7fabeb5d9eb631a0eda5b826988635f750133dbfe1bff84b84879f51da3b53f0d53fde7ccdc8fd9d06b05420f177bc10e9ce6e982bf1d54dacf24c2772d7a67f8d9cd6bd6c06609a6d193d1512f8b4154215c3e7333e98f2789f67198bf762d869d94ad6a56ae54622990ef4fb0720eadd2c9e16336baa8ae3d60f9cfe2fa82631f3e3aa47451767adcbe7eacf02194d2f74c8f442c3fe16355dcea23f2d72d1ca6e5830aee78620590d8cbffd69732dce500559d3c5ef4a6c499f0fecc1416b94e43f9")
// console.log(decryption);



// aws lambda setup

require("dotenv").config();
const express = require("express");
const app = express();
const serverless = require('serverless-http');
const morgan = require('morgan');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const prisma = require('./config/prismaClient');

const UsersRoutes = require('./routes/users.routes');
const AdminRoutes = require('./routes/admin.routes');
const PrivilegesRoutes = require('./routes/privilege.routes');

const getPresignedUrl = require('./middlewares/S3/s3-presignedUrl');
getPresignedUrl("user/1751462499648-bdcamsetup.exe");

i18next.use(Backend).use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: { loadPath: './locales/{{lng}}/translation.json' }
  });

const cors = require("cors");
let corsOptions = { origin: '*', optionsSuccessStatus: 200 };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.handle(i18next));
app.use(morgan('dev'));

UsersRoutes(app);
AdminRoutes(app);
PrivilegesRoutes(app);

// Handle 404
app.use((req, res, next) => {
  res.status(404).send({
    error: 'Page Not Found',
    message: 'The requested resource was not found updated code 2'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send({
    error: 'Internal Server Error',
    message: err.name,
    data: err.message,
    completeErrorObject: err
  });
});

// ✅ export Lambda handler
module.exports.handler = serverless(app);
