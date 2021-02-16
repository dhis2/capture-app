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

#### Yarn 

You can install `yarn` on your machine [here](https://classic.yarnpkg.com/en/docs/install/).


### Installing

A step by step series of examples that tell you how to get a development env running.

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

#### 3. Set environment variables for backend communication

The application needs to communicate with a DHIS2 backend instance. The `.env.development` file contains default configuration, but you can override it by supplying a `.env.development.local` file in the root folder of the project.

An example of `.env.development`:
```
# Default admin/district authorization for development
REACT_APP_DHIS2_BASE_URL="https://debug.dhis2.org/2.34dev/"
REACT_APP_DHIS2_AUTHORIZATION="Basic c3lzdGVtOlN5c3RlbTEyMw=="
REACT_APP_TRACKER_CAPTURE_APP_PATH="https://debug.dhis2.org/2.34dev/dhis-web-tracker-capture"
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
