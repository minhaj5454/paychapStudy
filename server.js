require("dotenv").config(); //Now need to do this when loading in package.json npm start command.
const express = require("express");
const app = express();
const serverless = require('serverless-http');
const morgan = require('morgan');

const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const middleware = require('i18next-http-middleware')

// const createDatabaseConnection = require('./config/db.config');
const prisma = require('./config/prismaClient');

const UsersRoutes = require('./routes/users.routes');
const AdminRoutes = require('./routes/admin.routes')
const PrivilegesRoutes = require('./routes/privilege.routes')

const getPresignedUrl = require('./middlewares/S3/s3-presignedUrl');
getPresignedUrl("adminprofile/1751541952717-download.jfif");

i18next.use(Backend).use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/translation.json'
    }
  });

const cors = require("cors");
const { encryptionFunction, decryptionFunction } = require("./utils/encryptDecrypt");
const port = process.env.PORT || 3001;
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.handle(i18next));
app.use(morgan('dev'));

UsersRoutes(app);
AdminRoutes(app);
PrivilegesRoutes(app);

// Handle 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).send({
    error: 'Page Not Found',
    message: 'The requested resource was not found'
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

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Check database connection and start the server
// commented below code for serverless aws lambda to run
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
// module.exports.handler = async (event, context) => {
//   console.log(JSON.stringify(event));
//   context.callbackWaitsForEmptyEventLoop = false;
//   // createDatabaseConnection();
//   await prisma.$connect();
//   const result = await serverless(app)(event, context);
//   await prisma.$disconnect();
//   return result;
// };
//and run this 
module.exports.handler = serverless(app);



// const data = {
//   "username" : "alex",
//   "email": "alex@yopmail.com",
//   "password": "alex",
//   "confirmPassword" : "alex"
// }
// const encryption = encryptionFunction(data)
// console.log(encryption);




// const encrypt = encryptSingle("Hello, AES Encryption!")
// console.log(encrypt);

// const decypt = decryptSingle("a64d236365df8e6c80bafb00804705fd")
// console.log(decypt);
