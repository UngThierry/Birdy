const express = require('express');
const session = require('express-session');
const DataBase = require('./DataBase').default;
const path = require('path');

const app = express();

app.listen(8080, () => console.log("Server listening on port 8080"));


// Création de la BD en mémoire et initialisation table Users
let dataB = new DataBase(path.resolve(__dirname, './birdyDB.db'));
module.exports = dataB;

app.use(session({ secret: "s3cr3t", resave: false, saveUninitialized: true, cookie: {} }));

/*************************** 
 *   Import des routes     *
****************************/
const router = express.Router();
    // On utilise JSON
router.use(express.json());
router.use((req, res, next) => {
    console.log('API: method %s, path %s', req.method, req.path);
    console.log('Body', req.body);
    next();
});
app.use('/', router);

const userRoute = require('./User/userRouter.js');          // les routes pour les services utilisateurs
app.use('/user', userRoute);

const friendRoute = require('./Amis/friendsRouter.js');     // les routes pour les services amis
app.use('*/friends', friendRoute);

const postsRoute = require('./Message/postsRouter.js');     // les routes pour les services messages
app.use('*/messages', postsRoute);


// Arrivée sur le site
app.get('/', (req, res) => res.redirect('/user/login'));

