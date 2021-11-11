# Fulcrum-Gateway
The backend API (Fulcrum) and frontend UI (Gateway) for FieFoe.

# <!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#setup">Setup</a>
      <ul>
        <li><a href="#frameworks">Frameworks</a></li>
      </ul>
    </li>
    <li>
      <a href="#git-structure">Git Structure</a>
    </li>
    <li><a href="#directory-structure">Directory Structure</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

# Setup
This project is written in JavaScript/TypeScript.
Here's a rough table of the frameworks used in this project roughly in order of highest to lowest level, 
along with some resources I followed (thank you to the creators of said resources!).

## Frameworks
| Framework | Description | Resources | 
| --- | ----------- | ---------- |
| React Native | Foundation for the frontend stack. We use only functional components and hooks. | https://reactnative.dev/docs/environment-setup |
| NativeBase | UI and component library built on React Native. | https://docs.nativebase.io/install-expo |
| React Native for Web | Supported by all frontend frameworks we're using for optimizing mobile web view. |  | 
| React Navigation | The frontend routing and navigation framework (basically React Router for mobile). | https://reactnavigation.org/docs/getting-started/ | 
| i18next | Used for multi-language support. | https://brainsandbeards.com/blog/i18n-in-react-native-apps |
| Expo | Used for easier cross-platform development. | https://docs.expo.dev/get-started/installation/ | 
| ExpressJS | Used to write our backend API. | https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way |
| NodeJS | To support Express for our backend. |  |
| *database* | N/A | N/A |
| Jest | Our choice of testing framework for both frontend and backend |  |
| Winston | Our choice of logging framework |  |

## Git structure
I use 4 branches to work:
1. `main` is a working version of the project ready for demos.
2. `feature` is the frontend development branch.
3. `backend` is the backend development branch.
4. `hotfix` is for urgent bug fixes and other immediate issues.
5. `intl` is for internationalization/localization of the project.

## Directory structure
### src/
All source code lives in this directory
### ./api/
All code associated with the API.
All backend code lives here, and may one day be sequestered into its own repository to prevent bloat.
### ./assets/
All asset files not provided by CDNs lives here.
### ./components/
All code associated with components lives here.
A component is defined as something that should not be used independently (i.e it must be combined with other components)
Components are categorized in accordance with atomic design principles.
### ./containers/
All screen-based AND page-based items can be placed inside containers, which act as wrappers that provide additional functionality.
Screen overlays, headers, modals, pop-ups, etc. are also stored here.
### ./pages/
Pages are combinations of components that hold state.
### ./screens/
Screens are standalone static sites that may also use components, but hold no state.

# Roadmap
Coming soon!
