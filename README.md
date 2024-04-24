# Capture app

The Capture app serves as a replacement for the Event Capture app. In the future, the intention is to incorporate the Tracker Capture app and the Data Entry app into the Capture app.

In the Capture app you register events that occurred at a particular time and place. An event can happen at any given point in time. This stands in contrast to routine data, which can be captured for predefined, regular intervals. Events are sometimes called cases or records. In DHIS2, events are linked to a program. The Capture app lets you select the organisation unit and program and specify a date when a event happened, before entering information for the event.

Find the official documentation of the Capture app [here](https://docs.dhis2.org/master/en/dhis2_user_manual_en/using-the-capture-app.html).
 
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install and how to install them.

#### Node 

You can download and install Node on your machine from [here](https://nodejs.org/en/download/).

#### Git 

You can find a tutorial on how to install `git` on your machine [here](https://www.atlassian.com/git/tutorials/install-git).

#### Yarn 1

You can install `yarn 1` on your machine following the instructions [here](https://classic.yarnpkg.com/en/docs/install/).


### Installing

Step by step instructions for setting up a development environment.

#### 1. Clone the repository

Clone with SSH
```
git clone git@github.com:dhis2/capture-app.git
```

Clone with HTTPS 
```
git clone https://github.com/dhis2/capture-app.git
```

#### 2. Install project dependencies

To install the dependencies you will have to be at the source folder of the cloned repository. Then run:

```
yarn 
```
#### 3. Enable cross-site cookies in your browser (if server is running on a different domain)

Read about cross-site cookies and DHIS2 applications [here](https://dhis2.nu/docs/guides/debug-instance/#disable-samesite-by-default-cookies)

#### 4. Run the application

To start the application locally and interact with it in the browser, run:

```
yarn start
```

`http://localhost:3000` should automatically open in your browser. 

You will be prompted for a path to the server instance, a user name and a password.

The path to the server instance can also be set by supplying a `.env.development.local` file in the root folder of the project. An example of an `.env.development.local` file:

```
REACT_APP_DHIS2_BASE_URL="http://localhost:8080"
```

## Local Cypress testing

To run Cypress tests locally on your own machine, follow the instructions [here](https://github.com/dhis2/capture-app/wiki/Cypress#run-cypress-tests-locally).

## Conditional E2E Test Recording

To record tests in Cypress Cloud, you can use one of the following methods based on your needs:

-   **Commit Message**: Include `[e2e record]` in your commit messages to activate recording.
-   **GitHub Labels**: Apply the `e2e record` label to your pull request to trigger recording.

This setup helps in managing Cypress Cloud credits more efficiently, ensuring recordings are only made when explicitly required.

## Built With

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


## Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) as convention for our commit messages.

## License

This project is licensed under the BSD 2-Clause License - see the [LICENSE.md](LICENSE.md) file for details
