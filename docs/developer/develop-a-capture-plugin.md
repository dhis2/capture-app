---
sidebar_label: Developing a plugin
title: Developing a Capture plugin
description: Learn how to develop a plugin for the DHIS2 Capture app.
id: develop-a-capture-plugin
---

Developing a capture plugin is almost the same as developing a regular DHIS2 custom app. However, there are some differences in how you structure your plugin and how you configure it to work with the DHIS2 Capture app. These are outlined in the few steps below.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/CkB0aHAuUU8?si=VByG77XN3vnPjdaN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Step 1: Create a new DHIS2 custom app

To create a new DHIS2 custom app, you can use the D2 CLI.

The D2 CLI helps you with many things, such as setting up a new project, building your app, and deploying it to your DHIS2 instance.

Please read our documentation on the [D2 CLI](/docs/quickstart/quickstart-web) to learn more about how to use it. 

```sh
d2 app scripts init my-form-field-plugin
```

## Step 2: Add a plugin entrypoint

To make your custom app a form field plugin, you need to add a plugin entrypoint inside the `d2.config.js` file.

Here is an example of how you can add a plugin entrypoint:

```js
module.exports = {
    type: 'app',
    name: 'Form Field Plugin',
    
    entryPoints: {
        app: './src/App.tsx',
        // highlight-start
        plugin: './src/Plugin.tsx',
        // highlight-end
    },
};
```

## Step 3: Develop your plugin

Develop your plugin using React components. This is the same as developing a regular DHIS2 custom app.

## Step 4: Build and deploy your plugin

After you have developed your plugin, you need to build and deploy it to your DHIS2 instance.

To build your plugin, you can use the provided build script from `d2-app-scripts`.

Run `yarn build` or (`d2-app-scripts build`) to build a production version of your plugin.

After building your plugin, you can deploy it to your DHIS2 instance.
You can do this by uploading the ZIP file to the _App management_ app in your DHIS2 instance, or publishing it to the App Hub.

See [Configuring a Capture plugin](configure-a-capture-plugin) for more information on how to configure your plugin in the DHIS2 Capture app.
