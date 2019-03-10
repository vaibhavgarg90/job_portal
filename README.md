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

| Method   | POST                                                                                                                                                                                                                             |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path     | /api/users/signup                                                                                                                                                                                                               |
| Payload  | {"firstName" : "Venki","lastName" : "Kumar","companyId" : "5c84b2b88ab6e2f502cfd3c1","username" : "venki@abc.com","password" : "****","email" : "venki@abc.com"}                                                                |          |
| Response | {"firstName": "Venki","lastName": "Kumar","companyId": "5c84b2b88ab6e2f502cfd3c1","createdAt": "2019-03-10T11:22:53.567Z","realm": "web","username": "venki@abc.com","email": "venki@abc.com","id": "5c84f38dc6658c07da30f4fb"} |

| Method   | POST                                                                                                                                                                  |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path     | /api/users/login                                                                                                                                                      |
| Payload  | {"username" : "venki@abc.com","password" : "****"}                                                                                                                    |
| Response | {"id": "1kFwAKNuRUHengPZsnTvCDndrGv2fP3AkEKNqKJONDNxTDgbEFidp13wZtVxnUDp","ttl": 1209600,"created": "2019-03-10T11:28:08.103Z","userId": "5c841359748130dc72675382" } |

| Method      | GET                                                                                                                                                                                                                                                                                                                                                        |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path        | /api/users/details                                                                                                                                                                                                                                                                                                                                         |
| Response    | {"firstName": "Venki","lastName": "Kumar","companyId": "5c84b2b88ab6e2f502cfd3c1","createdAt": "2019-03-10T11:30:10.274Z","realm": "web","username": "venki@abc.com","email": "venki@abc.com","emailVerified": false,"id": "5c841359748130dc72675382","company": {"name": "ABC Consultancy","address": "ABC Road, ABC","id": "5c84b2b88ab6e2f502cfd3c1"} } |
| Explanation | Return the details of currently logged in user.                                                                                                                                                                                                                                                                                                           |


| Method      | POST                                               |
|-------------|----------------------------------------------------|
| Path        | /api/users/logout                                  |
| Explanation | Logs the user out. Does not return anything (204). |

2. Company

| Method      | POST                                                   |
|-------------|--------------------------------------------------------|
| Path        | /api/Companies                                         |
| Payload     | {"name":"ABC Consultancies","address":"ABC Road, ABC"} |
| Explanation | Registers a new company.                               |

| Method      | GET                                                                                       |
|-------------|-------------------------------------------------------------------------------------------|
| Path        | /api/Companies                                                                            |
| Response    | [{"name":"ABC Consultancy", "address":"ABC Road, ABC", "id": "5c84b2b88ab6e2f502cfd3c1"}] |
| Explanation | Gets the list of all the companies.                                                       |

3. Job

| Method      | POST                                                                                       |
|-------------|--------------------------------------------------------------------------------------------|
| Path        | /api/Jobs                                                                                  |
| Response    | {"companyId": "5c8344b7e7dbbbba8d6ddc77", "title": "Software Developer", "status": "OPEN"} |
| Explanation | Registers a new job.                                                                       |

| Method      | POST                                                                                                                                                               |
|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path        | /api/Jobs/suggestions                                                                                                                                              |
| Query Param | title=software                                                                                                                                                     |
| Response    | [{"companyId": "5c8344b7e7dbbbba8d6ddc77", "title": "Software Developer", "date": "2019-03-09T04:46:19.503Z", "status": "OPEN", "id": "5c83451be7dbbbba8d6ddc7b"}] |
| Explanation | Returns the suggestions for the job title.                                                                                                                         |

| Method      | POST                                                                                                                                                                                                                                                                 |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path        | /api/Jobs/search                                                                                                                                                                                                                                                     |
| Payload     | {"status": "OPEN", "title": "software developer"}                                                                                                                                                                                                                    |
| Response    | [{"companyId": "5c8344b7e7dbbbba8d6ddc77", "title": "Software Developer", "date": "2019-03-09T04:46:19.503Z", "status": "OPEN", "id": "5c83451be7dbbbba8d6ddc7b", "company": {"name": "Dave Pvt Ltd", "address": "Dave Pvt Ltd", "id": "5c8344b7e7dbbbba8d6ddc77"}}] |
| Explanation | Returns the jobs for specified filter criteria.                                                                                                                                                                                                                      |

| Method      | GET                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path        | /api/Jobs/:id/shortlist                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Response    | [{"jobId":"5c83451be7dbbbba8d6ddc7b","interviewerId":"5c8348a4092c5abaefb9db4b","intervieweeId":"5c8348fd092c5abaefb9db4c","round":"HR ROUND","date":"2019-03-09T05:09:44.471Z","result":"OFFERED","id":"5c834a986a0a33bb07d06e15","interviewee":{"firstName":"Robo","lastName":"Employee","position":"Software Engineer","companyId":"5c8344c7e7dbbbba8d6ddc78","experience":10,"ctc":575000,"id":"5c8348fd092c5abaefb9db4c","company":{"name":"Robo Pvt Ltd","address":"Robo Pvt Ltd","id":"5c8344c7e7dbbbba8d6ddc78"}}}] |
| Explanation | Returns the shortlisted candidates for specified job.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

| Method      | GET                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path        | /api/Jobs/:id/reject                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Response    | [{"jobId":"5c834524e7dbbbba8d6ddc7c","interviewerId":"5c8348a4092c5abaefb9db4b","intervieweeId":"5c84d8e8a52183021140bf4d","round":"ROUND#3","date":"2019-03-10T09:31:27.556Z","result":"REJECTED","id":"5c84d96fa52183021140bf51","interviewee":{"firstName":"Trisha","lastName":"Employee","position":"SDE 2","companyId":"5c8344d0e7dbbbba8d6ddc79","experience":40,"ctc":1000000,"id":"5c84d8e8a52183021140bf4d","company":{"name":"Trisha Pvt Ltd","address":"Trisha Pvt Ltd","id":"5c8344d0e7dbbbba8d6ddc79"}}}] |
| Explanation | Returns the rejected candidates for specified job.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

| Method      | GET                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path        | /api/Jobs/:id/pending                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Response    | [{"jobId":"5c834524e7dbbbba8d6ddc7c","interviewerId":"5c8348a4092c5abaefb9db4b","intervieweeId":"5c84d8e8a52183021140bf4d","round":"ROUND#3","date":"2019-03-10T09:31:27.556Z","result":"PENDING","id":"5c84d96fa52183021140bf51","interviewee":{"firstName":"Trisha","lastName":"Employee","position":"SDE 2","companyId":"5c8344d0e7dbbbba8d6ddc79","experience":40,"ctc":1000000,"id":"5c84d8e8a52183021140bf4d","company":{"name":"Trisha Pvt Ltd","address":"Trisha Pvt Ltd","id":"5c8344d0e7dbbbba8d6ddc79"}}}] |
| Explanation | Returns the rejected candidates for the specified job.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

4. Interview

| Method      | GET                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path        | /api/Interviews/performance                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Query Param | jobId=5c834524e7dbbbba8d6ddc7c                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Query Param | intervieweeId=5c84d8e8a52183021140bf4d                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Response    | [{"jobId":"5c834524e7dbbbba8d6ddc7c","interviewerId":"5c8348a4092c5abaefb9db4b","intervieweeId":"| Method      | POST                                                                                                                                                                                                                                                                                                                                                                                                                  |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Path        | /api/Interviews/performance/update                                                                                                                                                                                                                                                                                                                                                                                    |
| Payload     | {jobId: "5c834524e7dbbbba8d6ddc7c", intervieweeId: "5c84d8e8a52183021140bf4d", round: "ROUND#3", "status": "REJECTED"}                                                                                                                                                                                                                                                                                                |
| Response    | {"jobId":"5c834524e7dbbbba8d6ddc7c","interviewerId":"5c8348a4092c5abaefb9db4b","intervieweeId":"5c84d8e8a52183021140bf4d","round":"ROUND#3","date":"2019-03-10T09:31:27.556Z","result":"REJECTED","id":"5c84d96fa52183021140bf51","interviewee":{"firstName":"Trisha","lastName":"Employee","position":"SDE 2","companyId":"5c8344d0e7dbbbba8d6ddc79","experience":40,"ctc":1000000,"id":"5c84d8e8a52183021140bf4d"}} |
| Explanation | Updates the result of a selected candidate for the specified job.                                                                                                                                                                                                                                                                                                                                                     |","round":"ROUND#1","date":"2019-03-10T09:31:15.600Z","result":"SELECTED","id":"5c84d963a52183021140bf4f","interviewer":{"firstName":"Dave","lastName":"Employee","position":"Software Engineer","companyId":"5c8344b7e7dbbbba8d6ddc77","experience":30,"ctc":325000,"id":"5c8348a4092c5abaefb9db4b"}},{"jobId":"5c834524e7dbbbba8d6ddc7c","interviewerId":"5c8348a4092c5abaefb9db4b","intervieweeId":"5c84d8e8a52183021140bf4d","round":"ROUND#2","date":"2019-03-10T09:31:22.018Z","result":"SELECTED","id":"5c84d96aa52183021140bf50","interviewer":{"firstName":"Dave","lastName":"Employee","position":"Software Engineer","companyId":"5c8344b7e7dbbbba8d6ddc77","experience":30,"ctc":325000,"id":"5c8348a4092c5abaefb9db4b"}},{"jobId":"5c834524e7dbbbba8d6ddc7c","interviewerId":"5c8348a4092c5abaefb9db4b","intervieweeId":"5c84d8e8a52183021140bf4d","round":"ROUND#3","date":"2019-03-10T09:31:27.556Z","result":"REJECTED","id":"5c84d96fa52183021140bf51","interviewer":{"firstName":"Dave","lastName":"Employee","position":"Software Engineer","companyId":"5c8344b7e7dbbbba8d6ddc77","experience":30,"ctc":325000,"id":"5c8348a4092c5abaefb9db4b"}}] |
| Explanation | Returns the performance of a selected candidate for the specified job.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

