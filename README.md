# Repack for large scale React Native apps

Re.pack has been around for a while and is solving a big problem for large-scale apps - it brings code splitting, module federation and multi-bundle support to React Native. Here we will have a look at what Re.pack has to offer for React Native apps and also a small experiment of its super cool features.

## Bundling JS and React Native

Bundlers serve as a cornerstone technology for all JavaScript apps. So is the case for React Native apps; as we develop more sophisticated apps in React Native, ideas began to emerge about efficiently bundling our tons of JS. Meta invested in the metro and has achieved significant results with the community's help. But; for large-scale apps serving tens of modules with tons of features, there was a need for a more dynamic and feature-rich bundler. Where else to look for if you have Webpack? 🙂

Re.pack bring all the good of the Webpack that the community has developed across the decade to React Native, which means we can now leverage modern ideas like Module federation and dynamic code splitting to our React Native apps.

## Re.pack Features


### Better Code Splitting

Code splitting has been the talk of the town since the emergence of SPAs when we started shipping MBs of JS to render even the tinniest of UI. For React Native apps, it's a little different; here, it is about loading only the required JS on the main thread; to keep our apps faster to boot and optimized in memory consumption. Though React Suspense code splitting is now very simple for React apps, it's still a hassle for RN apps.

Re.pack allows the creation of suspense-based chunks of your application, with each chunk only loaded on the main thread when required. We will have a detailed implementation of this feature later in this post.

### Module Federation

Several patterns have emerged in front-end engineering lately, and one of the most prominent is module federation - here is how Webpack defines the concept;

Multiple separate builds should form a single application. These separate builds act like containers and can expose and consume code between builds, creating a unified application.

This enables extensive code re-usability across apps without handling the hassle of package management. Re.pack allows RN apps to use module federation with local and remote chunks, making it super easy to ship bug fixes and upgrades to several apps simultaneously. 

### Plugin Eco-System

Over the past decade, the community has developed tons of plugins around Webpack, bringing some really cool ideas to the bundling arena. Enabling Webpack for React Native bundling means we can leverage those plugins and create more optimized and efficient JS bundles.

## Lets try it out

Lets create a small demo app to test features we discussed above.

### Initializing:

We will begin with setting up a react-native app via CLI with TypeScript template.

```bash
npx react-native init RepackDemo --template react-native-template-typescript
```

### Adding Dependencies:

Once project is up and running add repack related dependencies to our app:

```bash
npm i -D @callstack/repack babel-loader swc-loader terser-webpack-plugin webpack @types/react
```

Or

```bash
yarn add -D @callstack/repack babel-loader swc-loader terser-webpack-plugin webpack @types/react
```

### Configuring Commands:

Using re.pack means we are moving away from the default metro bundler of react native, hence the default `react-native start` command is not useful anymore. Instead we will use `react-native webpack-start` to run our JS server. 

To make this command available in react-native we have to update our `react-native.config.js` with following:

```js
    module.exports = {
     commands: require('@callstack/repack/commands'),
    };
```

This will hook re.pack commands `react-native webpack-start` & `react-native webpack-bundle` with react-native seamlessly. Now, to make our development faster we will update our “start” script in package.json to `react-native webpack-start`

```json
    {
      “scripts”: {
        “start”: “react-native webpack-start”
      }
    }
```

### Configuring Webpack:

To use our new start command, we need a webpack config file. For demo purposes, we use of-the-shelf configs; you can always dive deeper and update configs per your requirements. You can copy these configs from our demo project and place them in `webpack.config.mjs` at the project's root.

### Configure iOS Native

For release build are JS is bundled using Xcode’s build phase tasks. To enable re.pack there we will update the build phase; add following line in `Bundle React Native code and images` task:

```bash
    export BUNDLE_COMMAND=webpack-bundle
```

![](https://paper-attachments.dropboxusercontent.com/s_45436253FA99D9A833AF3BC73DB8BDE3D43E8484C16B035133A7B86C97C6D561_1671999933990_Screenshot+2022-12-26+at+1.25.23+AM.png)

### Configure Android Native

Just like iOS app we will update build command for android app; update following lines in `app/build.gradle` in our project

```groovy
    project.ext.react = [
        enableHermes: true,  // clean and rebuild if changing
        bundleCommand: "webpack-bundle",
    ]
```

🥳 We are now ready to start leveraging re.pack for JS bundling in React Native.


### Code Splitting

Lets start exploring how code splitting works with Re.pack. As discussed in features section above, Re.pack offers both local and remote chunks - to re-iterate; local chunks are the shipped with app while remote chunks are served over the network and aren’t the part of app’s build. For our example we will create a both local and remote chunks for better understanding.

Here is how our app’s repo looks like:

![Apps’ Repo](https://paper-attachments.dropboxusercontent.com/s_45436253FA99D9A833AF3BC73DB8BDE3D43E8484C16B035133A7B86C97C6D561_1672013387441_Screenshot+2022-12-26+at+5.09.30+AM.png)


As seen we have created two modules `LocalModule` & `Remote Module`. Here is how these modules look like:

Here is our module wrapper to encapsulate dynamic loading; this is similar for both local and remote modules:

https://github.com/zsajjad/RepackDemo/blob/main/src/modules/RemoteModule/index.tsx

```tsx
    /**
     * path: src/modules/RemoteModule/index.tsx
     * description:
     *    This is a remote module that is loaded asynchronously.
     *    This file encapsulate React.lazy and React.Suspense over the remote module.
     */
    import React from 'react';
    import { Text } from '../../components/Text';
    const Component = React.lazy(() => import(/* webpackChunkName: "remoteModule" */ './RemoteModule'));
    export default () => (
      <React.Suspense fallback={<Text>Loading Remote Module...</Text>}>
        <Component />
      </React.Suspense>
    );
```

Here is how module’s code looks like:

https://github.com/zsajjad/RepackDemo/blob/main/src/modules/RemoteModule/RemoteModule.tsx
```tsx
    /**
     * path: src/modules/RemoteModule/RemoteModule.tsx
     * description:
     *   This is a remote module that is loaded asynchronously.
     *   This file is the actual module that is loaded asynchronously.
     */
    import React from 'react';
    import { useColorScheme, View } from 'react-native';
    import { Colors } from 'react-native/Libraries/NewAppScreen';
    import { Section } from '../../components/Section';
    import { Text } from '../../components/Text';
    function RemoteModule() {
      const isDarkMode = useColorScheme() === 'dark';
      return (
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Section title="Remote Module">
            <Text>
              This module is loading dynamically for execution and is not shipped with the app. It is a remote module.
            </Text>
          </Section>
          <Section title="Details">
            <Text>
              This will not be part of app's initial bundle size. This will be loaded in app after consuming network
              bandwidth.
            </Text>
          </Section>
        </View>
      );
    }
    export default RemoteModule;
```

Once our modules are ready we will setup our webpack configs, app configs and root files to enable dynamic loading of these modules.

On app configs side we will define modules that we want to load dynamically. For our example we will define following modules:

```json
// app.json
{
  "localChunks": ["src_modules_LocalModule_LocalModule_tsx"],
  "remoteChunks": ["src_modules_RemoteModule_RemoteModule_tsx"],
}
```

Here localChunks are the modules that are shipped with app and remoteChunks are the modules that are loaded dynamically. These modules are passed to webpack configs to enable dynamic loading of these modules.

On webpack configs side we will define entry points for our app. For our example we will define following entry points:

```js
// webpack.config.mjs#222
new Repack.RepackPlugin({
  ...
  extraChunks: [
    {
      include: appJson.localChunks,
      type: 'local',
    },
    {
      include: appJson.remoteChunks,
      type: 'remote',
      outputPath: path.join('build/output', platform, 'remote'),
    },
  ],
  ...
}),
```

Here we have defined two extra chunks beside the main bundle; one for local module and one for remote module. We have also defined output path for remote chunks. This is where remote chunks will be saved at the end of build process.

On root file side we will define how we want to load these modules. For our example we will define following root file:

```js

// index.js
import { AppRegistry, Platform } from 'react-native';
import { ScriptManager, Script } from '@callstack/repack/client';
import App from './src/App';
import { name as appName, localChunks, remoteChunkUrl, remoteChunkPort } from './app.json';

/**
 * We need to set storage for the ScriptManager to enable caching. This enables us to avoid downloading the same script multiple times.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
ScriptManager.shared.setStorage(AsyncStorage);

/**
 * We need to set a resolver for the ScriptManager to enable loading scripts from the remote server.
 * The resolver is a function that takes a scriptId and returns a promise that resolves to a script object.
 * The script object has the following shape:
 */
ScriptManager.shared.addResolver(async (scriptId) => {
  // For development we want to load scripts from the dev server.
  if (__DEV__) {
    return {
      url: Script.getDevServerURL(scriptId),
      cache: false,
    };
  }

  // For production we want to load local chunks from from the file system.
  if (localChunks.includes(scriptId)) {
    return {
      url: Script.getFileSystemURL(scriptId),
    };
  }

  /**
   * For production we want to load remote chunks from the remote server.
   *
   * We have create a small http server that serves the remote chunks.
   * The server is started by the `start:remote` script. It serves the chunks from the `build/output` directory.
   * For customizing server see `./serve-remote-bundles.js`
   */
  const scriptUrl = Platform.select({
    ios: `http://localhost:${remoteChunkPort}/build/output/ios/remote/${scriptId}`,
    android: `${remoteChunkUrl}:${remoteChunkPort}/build/output/android/remote/${scriptId}`,
  });

  return {
    url: Script.getRemoteURL(scriptUrl),
  };
});

/**
 * We can also add a listener to the ScriptManager to get notified about the loading process. This is useful for debugging.
 *
 * This is optional and can be removed.
 */
ScriptManager.shared.on('resolving', (...args) => {
  console.log('DEBUG/resolving', ...args);
});

ScriptManager.shared.on('resolved', (...args) => {
  console.log('DEBUG/resolved', ...args);
});

ScriptManager.shared.on('prefetching', (...args) => {
  console.log('DEBUG/prefetching', ...args);
});

ScriptManager.shared.on('loading', (...args) => {
  console.log('DEBUG/loading', ...args);
});

ScriptManager.shared.on('loaded', (...args) => {
  console.log('DEBUG/loaded', ...args);
});

ScriptManager.shared.on('error', (...args) => {
  console.log('DEBUG/error', ...args);
});

/**
 * We need to register the root component of the app with the AppRegistry.
 * Just like in the default React Native setup.
 */
AppRegistry.registerComponent(appName, () => App);
```

This makes our app ready to load remote modules. We can now run our app and see the results. Since modules are loaded from the dev server in debug mode, it's not much different from the default setup. But in production mode, we can see that remote modules are created beside the main bundle and are loaded dynamically. For understanding, we created a release APK and placed it under the APK analysis tool in Android Studio. We can see that the local module is not part of the main bundle while the remote module is nowhere inside the APK; rather, it's created in the `build/output/android/remote` directory in our app's repo.

[Screenshot of APK analysis tool]

We started bundle serving HTTP server for testing purposes and tested our app in production mode. We can see that the remote module is loaded from the HTTP server.

[Screen recording of app running in production mode]

### Multiple entry points

One of the main advantages of webpack is that it allows us to create multiple entry points for our app. This is useful for large-scale and brownfield apps where we want to split our app into multiple bundles. Especially for brownfield apps where React Native is powering certain features, each feature can be treated as a separate bundle with certain native dependencies shared across them. This section will show how we can use Re.pack to create multiple entry points for our app. 

Here in our app, we have created a smaller and simpler entry point, `Bitsy`; it's loaded from a different entry point, `/bitsy.js`.

We updated the webpack config as follows:

```js
    // webpack.config.js#L70
    entry: [
      ...
      path.join(dirname, 'bitsy.js'),
      ...
    ]
```

To launch `Bitsy` from native side you can update `MainActivity.java` as following:

```java
    // MainActivity.java#L15
    @Override
    protected String getMainComponentName() {
        return "RepackBitsy";
    }
```

or `AppDelegate.m` as following:

```Objective-C
    // AppDelegate.m#L47
    UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"RepackBitsy", initProps);
```

Running app will launch `Bitsy` instead of `RepackDemo` app.

## Summarizing It: 

Webpack has been around in frontend development since its inception at the start of the past decade. We have seen many plugins developed around it to solve complex problems in bundling and optimization areas for large-scale apps. Bringing all that power to React Native will help us easily maintain large-scale mobile apps. This can also help RN apps become more secure and performant.

We have a [sample project with Re.pack running](https://github.com/zsajjad/RepackDemo). You might have to tweak webpack configs for your projects to ensure you get the optimal results. Please refer to comments in the configs file and webpack docs for details of each option.
