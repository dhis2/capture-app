# Capture app

The Capture app allows you capture, modify and list tracked entity instances with its enrollments and events. The Tracker Capture app works with multiple event-based programs in DHIS2, which handles events linked to registered entities. These programs are suitable for handling disease programmes where multiple visits is required. The Capture app can be used for disease programmes such as tubercolosis and malaria. However the app is not tied to any specific domain and can potentially be utilized for any scenario of multiple event-based information.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install and how to install them.

#### Docker 

You can download and install Docker on your machine from [here](https://docs.docker.com/get-docker/).

#### Node 

You can download and install Node on your machine from [here](https://nodejs.org/en/download/).

#### Git 

You can find a tutorial on how to install `git` on your machine [here](https://www.atlassian.com/git/tutorials/install-git).

#### Yarn 

You can install `yarn` on your machine [here](https://classic.yarnpkg.com/en/docs/install/).

### Installing

A step by step series of examples that tell you how to get a development env running.

#### 1. [`d2 cluster`](https://cli.dhis2.nu/#/getting-started?id=install-the-cli) 

Helps you spin up a DHIS2 instance using docker containers. 

To install the `d2` CLI run: 
```
yarn global add @dhis2/cli
```

To spin up a docker container with development version run: 
```
d2 cluster up 2.32 --channel dev --seed
```

Now you will be having a development instance running in your machine. Visit `http://localhost:8080/` to verify you followed the steps correctly. This instance will be serving our backend API calls while we are developing locally. 

#### 2. Clone the repository

Clone with SSH
```
git clone git@github.com:dhis2/capture-app.git
```

Clone with HTTPS 
```
git clone https://github.com/dhis2/capture-app.git
```

#### 3. Install project dependencies

To install the dependencies you will have to be at the source folder of the cloned repository. Then run:

```
yarn 
```

#### 4. Set up the API base url

For the application to fetch data from the backend we need to set up a base url. Make sure in your `.env.development` file the following is included:

```
REACT_APP_DHIS2_BASE_URL="http://localhost:8080"
```

#### 4. Run the application

To start the application locally and interact with it on the browser, run:

```
yarn start
```

## Built With

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


## Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) as convention for our commit messages.

## License

This project is licensed under the BSD 2-Clause License - see the [LICENSE.md](LICENSE.md) file for details
