# Programming web services (winter semester 2023/24)

## Preparing the project to work
1. clone the project from https://gitlab.com/mariusz.jarocki/pws2023
1. install dependencies in the root directory of the project: `npm install`
1. install dependencies in the `frontend` subfolder as above
1. copy `config-example.json` to `config.json` and customize it
1. start the backend: `npm start`
1. from the `frontend` folder, run the work server: `npm run serve`
1. from the browser connect to http://localhost:8080

## Prepare the production version
1. from the frontend directory `npm run build`.
1. from the browser connect to http://localhost:8000 (from configuration)

## Note about Eduroam network
Eduroam wifi network does not allow to connect to the MongoDB cloud (by the protocol mongodb+srv). To use the resource please connect your laptop to other wifi network. Within the faculty building, you can use the WMII wifi network for this purpose, but you must provide your laptop with access to it in advance by filling out the form on the website https://pracownia.math.uni.lodz.pl/index.php?option=com_content&view=article&id=58&Itemid=62 (available locally).

Another solution can be using local installation of MongoDB server (community edition is free, you can download it from https://www.mongodb.com/docs/manual/administration/install-community/ ). You can access databases managed by the server using for example MongoDB Compass ( https://www.mongodb.com/products/tools/compass )

## Crediting extensions
They will appear at the end of the semester....