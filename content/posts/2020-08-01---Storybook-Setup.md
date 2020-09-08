---
title: 2020 Complete Setup for Storybook, Nextjs, Typescript, SCSS and Jest
date: "2020-08-01T22:40:32.169Z"
template: "post"
draft: false
slug: "storybook-setup"
category: "Tutorial"
tags:
  - "Storybook"
  - "Tutorial"
  - "Web Development"
description: "In this article, I will guide you step by step to set up Storybook with Next, Typescript, SCSS, and Jest."
socialImage: "/media/github.png"
---

In this article, I will guide you step by step to set up Storybook with Next, Typescript, SCSS, and Jest.

Storybook is an open-source tool for developing UI components in isolation. It makes building stunning UIs organized and efficient. However, it can be quite tricky to set up with Nextjs.

### Requirements

- Node.js 10.13 or later
- MacOS, Windows (including WSL), and Linux are supported

### Create Nextjs App

Create a new Next.js app using create-next-app, which sets up everything automatically for you. To create a project, run this command:

```
$ npx create-next-app
✔ What is your project named? … my-app
✔ Pick a template › Default starter app
```

- Enter your project name + hit return
- You will be asked to choose a template: Use arrow key ⬇ to choose a `Default starter app` and hit return

After the installation is complete, to start the development server:

```
cd my-app
yarn run dev
```

You should see this page on localhost:3000
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/d16it50kz4mbrdtjlxi0.png)

### TypeScript

Next, let’s configure Typescript for our Next app

```
$ yarn add -D typescript @types/react @types/node
```

Create a `tsconfig.json` in the root folder — this is where you will put your typescript configurations.

```
/* root folder */
$ touch tsconfig.json
```

And add the following config to the file:

```javascript
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noImplicitAny": false,
    "jsx": "preserve",
    "baseUrl": "./",
    "paths": {
      "@components/*": ["./components/*"]
    }
  },
  "exclude": ["node_modules"],
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

Remove `index.js` and create `index.tsx` file. You can do it manually or use these commands in the root folder

```
/* root folder */
rm -f pages/index.js
touch pages/index.tsx
```

Add the following to `index.tsx`:

```javascript
import React from "react";
import { mount } from "enzyme";
import Home from "../../pages/index";
describe("Pages", () => {
  describe("Home", () => {
    it("should render without throwing an error", function () {
      const wrap = mount(<Home />);
      expect(wrap.find("h1").text()).toBe("Welcome to My Next App!");
    });
  });
});
```

Restart your server and check out your `http://localhost:3000/` by running:

```
$ yarn run dev
```

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/savd3hqjrnphqryhecnx.png)

### Storybook

Next, we’ll configure Nextjs, SCSS, and Typescript for Storybook

```
$ yarn add -D @storybook/react @storybook/preset-typescript
```

Create `.storybook` folder and storybook config files:

```
/* root folder */
mkdir .storybook
cd .storybook
touch .storybook/main.js .storybook/next-preset.js .storybook/preview.js
```

Now we will go over how to configure these files.

#### next-preset.js

In this file, we will configure Typescript and SCSS to work with Storybook

```
$ yarn add -D sass style-loader css-loader sass-loader @babel/core babel-loader babel-preset-react-app
```

Add the following configuration to `next-preset.js`

```javascript
const path = require("path");

module.exports = {
  webpackFinal: async (baseConfig, options) => {
    const { module = {} } = baseConfig;

    const newConfig = {
      ...baseConfig,
      module: {
        ...module,
        rules: [...(module.rules || [])],
      },
    };

    // TypeScript
    newConfig.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [path.resolve(__dirname, "../components")],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["next/babel", require.resolve("babel-preset-react-app")],
            plugins: ["react-docgen"],
          },
        },
      ],
    });
    newConfig.resolve.extensions.push(".ts", ".tsx");

    // SCSS
    newConfig.module.rules.push({
      test: /\.(s*)css$/,
      loaders: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../styles/global.scss"),
    });

    // If you are using CSS Modules, check out the setup from Justin (justincy)
    // Many thanks to Justin for the inspiration
    // https://gist.github.com/justincy/b8805ae2b333ac98d5a3bd9f431e8f70#file-next-preset-js

    return newConfig;
  },
};
```

#### SCSS

Create your style folder in the root and add global scss file.

```
/* root folder */
mkdir styles
touch styles/global.scss
```

```css
html {
  background: #f1f1f1;
  max-width: 100%;
}

body {
  background: linear-gradient(315deg, var(#f1f1f1) 0%, var(#e7e7e7) 100%);
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    system-ui, sans-serif !important;
}
```

#### preview.js

In this file, we configure the “preview” iframe that renders your components. We will import your global scss file here.

```javascript
// Import global css here
import "../styles/global.scss";
```

#### main.js

main.js is the most important config file. This is where we place the main configuration of Storybook.

```javascript
const path = require("path");

module.exports = {
  stories: ["../components/**/*.stories.tsx"],
  addons: ["@storybook/preset-typescript"],
  // Add nextjs preset
  presets: [path.resolve(__dirname, "./next-preset.js")],
};
```

#### Create a story

Let’s create a simple Button component and a story to test our Storybook setup. First, create a components folder and 2 files `Button.tsx` and `Button.stories.tsx` in the folder.

```
/* root folder*/
mkdir components
touch components/Button.tsx components/Button.stories.tsx
```

Then, add the following contents into 2 files:

```javascript
// components/Button.tsx
import * as React from "react";

type Props = {
  text: string,
};

export default ({ text }: Props) => <button>{text}</button>;
```

```javascript
// components/Button.stories.tsx
import { storiesOf } from "@storybook/react";
import Button from "./Button";

storiesOf("Button", module).add("with text", () => {
  return <Button text="Hello World" />;
});

storiesOf("Button", module).add("with emoji", () => {
  return <Button text="😀 😎 👍 💯" />;
});
```

Finally, add npm script to `package.json` to start storybook.

```
{
  ...
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "storybook": "start-storybook -p 6006 -c .storybook"
  }
}
```

Now, let’s run our Storybook.

```
$ yarn storybook
```

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/3mh1s0at8pdu1wiv5smk.png)

You should see our global scss style took affect and 2 stories that we have created earlier to test the Button.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/2jm1deca9qk4hs7una4s.png)

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/19rtxjqz2si740qgcjag.png)

### Jest

Next, we will add `unit tests` and `snapshot tests` in Jest for testing components in Nextjs and Typescript.

First, let’s install these development dependencies for Jest.

```
$ yarn add -D jest @types/jest ts-jest babel-jest @types/enzyme enzyme enzyme-adapter-react-16
```

We’ll need to configure Enzyme to use the adapter, which we can do in Jest’s bootstrap file. Let’s create a config folder and place the setup file in there.

```
/* root folder */
mkdir config
touch config/setup.js
```

```javascript
const enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

enzyme.configure({ adapter: new Adapter() });
```

This code will run also before each test but after the testing framework gets executed:

Now let’s create a config file for jest. If you place your setup file above at a different location then make sure to change your `setupFiles: […]` in `jest.config.js`.

```
/* root folder */
$ touch jest.config.js
```

```javascript
module.exports = {
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/.storybook/**",
    "!**/tests/**",
    "!**/coverage/**",
    "!jest.config.js",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFiles: ["<rootDir>/config/setup.js"],
  preset: "ts-jest",
  testPathIgnorePatterns: [
    "/.next/",
    "/node_modules/",
    "/lib/",
    "/tests/",
    "/coverage/",
    "/.storybook/",
  ],
  testRegex: "(/__test__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  testURL: "http://localhost",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    ".(ts|tsx)": "babel-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
```

#### Config babel.config.json

Lastly, we will add babel configurations. Let’s add these dev dependencies to our package.json by running the following command:

```
yarn add -D @babel/preset-env @babel/preset-react @babel/preset-flow @babel/plugin-transform-runtime babel-plugin-transform-es2015-modules-commonjs
```

In the root folder, create a babel config file. For some reasons, babel.rc does not work and I have to replace it with `babel.config.json`

```
/* root folder */
$ touch babel.config.json
```

```javascript
{
  "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-flow"],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-proposal-class-properties"
  ],
  "env": {
    "development": {
      "plugins": ["transform-es2015-modules-commonjs"]
    },
    "test": {
      "plugins": [
        "transform-es2015-modules-commonjs",
        "@babel/plugin-proposal-class-properties"
      ],
      "presets": ["@babel/preset-react"]
    }
  }
}
```

#### Let’s create a test

Now, let’s run a simple unit test to test the index file that we created earlier to make sure that it has the welcome message “Welcome to My Next App!” as a “h1” element.

First, create a `__test__` folder to keep our test files in one place and create `index.test.tsx` file.

```
/* root folder */
mkdir components/__test__
touch components/__test__/index.test.tsx
```

```javascript
import React from "react";
import { mount } from "enzyme";
import Home from "../../pages/index";
describe("Pages", () => {
  describe("Home", () => {
    it("should render without throwing an error", function () {
      const wrap = mount(<Home />);
      expect(wrap.find("h1").text()).toBe("Welcome to My Next App!");
    });
  });
});
```

#### Snapshot testing

Finally, I will show you how to create a simple snapshot test. We use Snapshot testing to keep a copy of the structure of the UI component or a snapshot so when after we make any changes we can review the changes and update the snapshots. You can read more about Snapshot testing here.

To start, let’s install react-test-renderer, a library that enables you to render React components as JavaScript objects without the need for a DOM.

```
$ yarn add -D react-test-renderer
```

Now, create a file called `Button.snapshot.test.tsx` to test create new snapshots for the Button component.

```
$ touch components/__test__/Button.snapshot.test.tsx
```

```javascript
import React from "react";
import Button from "../Button";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer.create(<Button text="Some Text" />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

Now, add the add npm script to `package.json` to run your tests

```
{
  ...
  "scripts": {
    ...
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Go ahead and run your tests.

```
$ yarn run test
```

You should see 1 unit test and 1 snapshot test are passed

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/eix824pazd836e9u7v7a.png)

If you run into errors such as “`The default export is not a React Component in page: ‘/’`” or “`ReferenceError: regeneratorRuntime is not defined`”, try to delete `package-lock.json`, `node_modules` folder, and `.next` folder and then restart your server, storybook and rerun your test again.

### Conclusion

Thank you for reading 🙏🏻 and let me know in the comment if you run into any problems and if it's helpful for you.

You can also clone the source code here to get started on your development right away: [https://github.com/trinwin/storybook-next-ts-template](https://github.com/trinwin/storybook-next-ts-template)

> Connect with me on [Medium](https://medium.com/@trinwin), [LinkedIn](https://www.linkedin.com/in/trinwin), [Github](https://github.com/trinwin), and [Twitter](https://twitter.com/_trinwin) 🤓.
