[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Planner Tasks

## Description

A React application to view and visualise the status of tasks from a Microsoft Planner plan (kanban board).
The application uses MSAL React to sign-in a user and obtain a JWT access token for Microsoft Graph API from Azure AD.

Tasks are grouped by swimlanes, refered to as buckets within MS Planner, and the status of each task wihin a bucket grouped by To-do, Complete, Priority, and Late.

---

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [URL](#url)
4. [Build](#build)
5. [License](#license)
6. [Contributing](#contributing)
7. [Questions](#questions)

## Installation

You can run this application locally by:

1. Create an account on the [Azure Portal](https://portal.azure.com/) if you dont already have one.
1. Create a new App Registration.
   1. Click App Registrations then New Registration
   1. Give the app a name e.g. Planer Tasks
   1. Select Accounts in this organizational directory only.
   1. Click Register.
1. Add a platform and redirect URIs
   1. Select the Authentication blade
   1. Click add a platform
   1. Enter these two redict URIs:
      1. http://localhost:3000/
      1. http://localhost:3000/redirect.html
   1. Click save.
1. Add the Microsoft Graph delegated permissions.
   1. Select the API permissions blade.
   1. Select the Add a permission button.
   1. Select the Add a permission button and then select Microsoft Graph.
   1. In the Delegated permissions section, select the User.Read, Tasks.Read in the list.
   1. Select the Add permissions button at the bottom to save.
1. Record your Application (client) ID and Directory (tenant) ID from the Overview blade.

1. Record the ID of one of your plans from Microsoft Planenr

   1. Create an account on [Microsoft Planner](https://tasks.office.com/) this must be on the same tenant as your Azure Portal account.
   1. Create a new plan.
   1. Open the plan and record the planId from the address bar.

1. Clone this repository `git clone git@github.com:oli-drew/planner-tasks.git`
1. Navigate to inside the repository `cd planner-tasks/`
1. Install the required packages using `npm install`
1. Copy and rename the .env.EXAMPLE file. `cp .env.EXAMPLE .env`
1. Configure your web application environment variables.
   1. Open the .env file you previously created in your IDE.
   1. Enter your Application (client) ID after REACT_APP_AAD_APP_CLIENT_ID= e.g. `REACT_APP_AAD_APP_CLIENT_ID="1234"`
   1. Enter your Directory (tenant) ID after REACT_APP_AAD_APP_TENANT_ID= e.g. `REACT_APP_AAD_APP_TENANT_ID="1234"`
   1. Enter your Planner Plan ID after REACT_APP_AAD_APP_PLAN_ID= e.g. `REACT_APP_AAD_APP_PLAN_ID="1234"`
   1. Save the file.
1. Start the server by running `npm start`

## Usage

1. Navigate to: http://localhost:3000/
2. Click the "Login" button.
3. Sign in with your Microsoft account.
4. Click the "Task Board" button to navigate to the tasks page.
5. This application can be installed as a PWA.

### Screenshots

![Planner Tasks Tasks Page](/readme-files/tasks.png)

## URL

A deployed version of the application is available here: https://tasks.peterdrew.com/

## Build

The following technology stack was used:

- React
- MUI and Emotion
- Microsoft MSAL
- Microsoft Graph
- Recharts
- Dayjs
- Workbox
- Deployed to Azure Static Web Apps

## License

This project is licensed under MIT.

## Contributing

- Oliver Drew

## Questions

If you have any questions please contact me via [GitHub](https://github.com/oli-drew) or [Email](mailto:oli-webdev@protonmail.com)
