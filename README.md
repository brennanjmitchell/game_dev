This is an attempt to learn Three.js and quite frankly any JavaScript programming as a beginner. Neat. This page will be pretty informal for now, but hopefully will shape up as things get going.

We'll be using NPM to create a 'package.json' file, which is a manifest file that holds metadata about the project and its dependencies.

We started by using an 'http-server' (Node.js) to host a simple local server, but switched to 'Vite' to be able to serve node packages. For easy testing, I've gone ahead and made the following simple npm scripts:

npm run dev
  Boots a server with Vite and automatically opens it in chrome. This can be configured by editing vite.config.js if need be.
npm run start
  Boots an http-server with our files that can be found locally at http://localhost:8080
npm run start-dev
  Boots an http-server with our files that can be found locally at http://localhost:8080, but also tries to automatically update our server should files change. Ideally this would make testing things easier.
