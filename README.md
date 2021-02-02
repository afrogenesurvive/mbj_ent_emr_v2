# Mbj_Ent_Emr_v2m

## What is it??

An Electronic Medical Records System built on the MERN (MongoDB, Express w/ graphql, ReactJS, NodeJS) stack.

### Features:
- Store, retrieve and update records for staff, patients, appointments and visits
- Signup, Login and logout w/ bcrypt and jwt
- Signup verification and password reset flows w/ email and encrypted codes
- Create appointments for patients and input visit i.e clinical info when they arrive and are seen
- Calendar views w/ event sharing: iCalendar, Google calendar etc
- Navigate easily between consultants associated appointments, patients, visits back to consultants etc
- Minimal design
- Image & File storage w/ aws s3
- Admin updates and in-app messaging with socket.io
- Generate documents such as Referrals and Prescriptions in PDF format w/ patient info


## Why was it made??

- This project was born out of my mother's need for a medical records system for her practice
- Which was:
  - Customizable to her needs
  - Appropriate for non-United States usage
  - Not cost prohibitive at her scale

## How was it made??

- Made using:
  - Backend
    - Node.Js & Express
    - GraphQL
    - Mongo & Mongoose
    - AWS S3
    - Socket.io
  - Frontend
    - React.js w/ Create React App
    - Bootstrap
    - FullCalendar
  - Dev Notes:
    - This app has gone through several iterations as it has been tested/reviewed along the way.
    The database models and corresponding graphql methods have been expanded significantly since original conception. 



## Try it yourself??

- Download the code or clone the repository
- Have mongodb and nodejs installed
- Run "npm install" in both the root and "frontend" folders
- Specify your database in mongoose connection string in app.js file
- Add an .env file with the following properties
  - APP_SECRET, JWT_TOKEN, PORT, SOCKET_PORT
- Run "npm start" in both the root and frontend folders
