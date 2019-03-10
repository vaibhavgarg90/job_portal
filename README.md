# Job Portal

This project implements a simple Job Portal that provides bare-minimum functionalities such as:
1. Login for consultant (login credentials are hard-coded in the database).
2. Search for Jobs with following filters:
  a. Status (Open / Closed)
  b. Title (Free text with typeahead capability)
3. Once a search is performed, all the matching jobs are displayed.
4. First job is by default selected and a list of all the shortlisted candidates is shown.
5. The toggle is provided to switch between Selected, Rejected and Pending candidates.
6. When a candidate is selected, his / her details of all the rounds are shown in a separate table.
7. The portal allows for the status of Pending to be updated i.e., Selected, Rejected or Offered.
8. Finally, the logout functionality is also provided.
9. The back-end is implemented using LoopBack framework with MongoDB as primary data source.
10. The front-end is implemented using AngularJS and Bootstrap.

Please run these commands from inside job_portal directory.

----------------------------------------------------------------------------
Database
----------------------------------------------------------------------------
1. cd db_dump
2. sh mongo_import.sh (accepts following optional arguments)
  a. path from where to restore the data
  b. database name in which to restore (default is job_portal_db)
  c. ip address of the mongo server (default is localhost)
  d. port of the mongo server (default is 27017)
3. Please modify the script appropriately if authentication is enabled.

----------------------------------------------------------------------------
Back End
----------------------------------------------------------------------------
1. cd ../back_end
2. npm install
3. npm start
4. The back-end should be running at http://localhost:3000
5. LoopBack API explorer can be accessed from http://localhost:3000/explorer

----------------------------------------------------------------------------
Front End
----------------------------------------------------------------------------
1. cd ../front_end
2. npm install
3. npm start
4. The portal should be accessible at http://localhost:8000

----------------------------------------------------------------------------
DB Schema
----------------------------------------------------------------------------
1. User

| Property  | Type     | Required | Comments           |
|-----------|----------|----------|--------------------|
| id        | ObjectId | Yes      |                    |
| firstName | String   | Yes      |                    |
| lastName  | String   | Yes      |                    |
| companyId | String   | Yes      | References Company |
| username  | String   | Yes      |                    |
| email     | Email    | Yes      |                    |

2. AccessToken

| Property | Type     | Required | Comments        |
|----------|----------|----------|-----------------|
| id       | ObjectId | Yes      |                 |
| ttl      | Number   | Yes      |                 |
| created  | Date     | Yes      |                 |
| userId   | ObjectId | Yes      | References User |

3. Company

| Property | Type     | Required |
|----------|----------|----------|
| id       | ObjectId | Yes      |
| name     | String   | Yes      |
| address  | String   | No       |

4. Employee

| Property   | Type     | Required | Comments            |
|------------|----------|----------|---------------------|
| id         | ObjectId | Yes      |                     |
| firstName  | String   | Yes      |                     |
| lastName   | String   | Yes      |                     |
| position   | String   | Yes      |                     |
| companyId  | ObjectId | Yes      | References Company  |
| experience | Number   | Yes      | In # months         |
| ctc        | Number   | Yes      | Exact figure (p.a.) |

5. Job

| Property  | Type     | Required | Comments                                          |
|-----------|----------|----------|---------------------------------------------------|
| id        | ObjectId | Yes      |                                                   |
| companyId | ObjectId | Yes      | References Company                                |
| title     | String   | Yes      |                                                   |
| date      | Date     | Yes      | The date on which job was posted (default is now) |
| status    | String   | Yes      | Open / Closed                                     |

6. Interview

| Property      | Type     | Required | Comments                                                  |
|---------------|----------|----------|-----------------------------------------------------------|
| id            | ObjectId | Yes      |                                                           |
| jobId         | ObjectId | Yes      | References Job                                            |
| interviewerId | ObjectId | Yes      | References Employee                                       |
| intervieweeId | ObjectId | Yes      | References Employee                                       |
| round         | String   | Yes      | The interview round                                       |
| date          | Date     | Yes      | The date on which interview is conducted (default is now) |
| result        | String   | Yes      | SELECTED / REJECTED / PENDING / OFFERED                   |

----------------------------------------------------------------------------
APIs
----------------------------------------------------------------------------
1. User

| Method   | GET                                                                                                                                                                                                                             | Comments |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Path     | /api/users/signup                                                                                                                                                                                                               |          |
| Payload  | {"firstName" : "Venki","lastName" : "Kumar","companyId" : "5c84b2b88ab6e2f502cfd3c1","username" : "venki@abc.com","password" : "****","email" : "venki@abc.com"}                                                                |          |
| Response | {"firstName": "Venki","lastName": "Kumar","companyId": "5c84b2b88ab6e2f502cfd3c1","createdAt": "2019-03-10T11:22:53.567Z","realm": "web","username": "venki@abc.com","email": "venki@abc.com","id": "5c84f38dc6658c07da30f4fb"} |          |
