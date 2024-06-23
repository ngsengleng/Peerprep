# PeerPrep

This project was originally from a module during the school term to elaborate the usefulness of microservices; I intend to do a rehash of the original project with nicer UI as well as a more concurrent backend with Golang instead of node.js, as well as include some CI/CD processes so that I can host it via free hosting services

this project uses the plugin [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) ([SWC](https://swc.rs/)) for Fast Refresh

### Installation

- run `yarn install` in the `/frontend` directory
- run `go mod tidy` in the `/*-server` directories

### Running the dev environment

- run `yarn dev` in the `/frontend` directory
- run `go run .` in the rest of the `/*-server` directories

### File structure

- stylesheets are written with `sass` using the 7-1 architecture design pattern with a main file that imports all relevant stylesheets
- Each application page has its own file with shared components extracted out to a common component folder

### Progress:

- Most pages have the UI implemented already
- websocket servers for chat and code editor have been written
- auth server is being written
- some implementations on the frontend may change depending on how endpoints are written; currently alot of dynamic elements are hardcoded

### Todo:

- can refer to the issues section in the repository on what is to be implemented
- ideally API contracts are drawn up using Protobuf
