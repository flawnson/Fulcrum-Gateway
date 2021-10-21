# Fulcrum-Gateway
The backend API (Fulcrum) and frontend UI (Gateway) for the queue app.

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
