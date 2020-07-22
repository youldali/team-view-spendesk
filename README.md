## Project URL:
https://youldali.github.io/team-view-spendesk/

## Assumptions

 - any user can be an approver
 - a team can only have 1 approval scheme associated (0 to 1 relationship)

### How to run it

 - git clone https://github.com/youldali/team-view-spendesk.git
 - npm install => install the app
 - npm run start => to launch the local web server
 - npm run test => runs the UT

### Tech stack

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Stack:
 - Typescript
 - React / Redux (toolkit) / React-Router
 - Jest
 - Ramda
 - Material UI

### Structure description

 - *src* contains the source code
 - *features* folder contains all the application logic, along with the redux slices and data models
 - *routes* folder contains all the components and everything related to the UI
 - *apis* folder contains functions used to reach the outside world, in this case the logic to perform API calls for the teams and users
 - *utils* folder contains generic util functions

### What use case is handled

 - Teams list table
 - Abitility to create / update an approval scheme for a team 
 - Manages the following errors:
    - errors when modifying an approval scheme (for example: negative number / undefined approver / overlapping thresholds / duplicated approver)
    - handles the case when the user modifies the url manually and land on a non existing team
    - handle the case when resources have failed to load (for example: network error)

### What is missing

 -  Ability to delete a step in an approval scheme:
    I would add a function in the model that receives the step ID to delete, and returns a new array without the index, readapting the others steps thresholds if necessary.

### What would be nice

 - Ability to relaunch the request if a resource fails to load
 - Add a user view
 - Split the *routes/approvalScheme/ApprovalScheme.tsx* file
 - Add lazy loading by route
 - Put all the UI text in a specific file

### Testing

 - The app logic is covered with unit test (features folder)
 - Due to lack of time, the app view is not covered
