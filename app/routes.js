var authController        = require('../controllers/auth');
var userController        = require('../controllers/user');
var signupController      = require('../controllers/signup');
var languageController    = require('../controllers/language');
var translatorController  = require('../controllers/translator');
var translationController = require('../controllers/translation');
var clientController      = require('../controllers/client');
var contractController    = require('../controllers/contract');
var fileController        = require('../controllers/file');

module.exports = function(app, express, passport) {
  // Create our Express router
  var router = express.Router();

  router.get('/', function(req, res) {
    res.json({ message: 'Welcome to Redrob account' });
  });

  require('../controllers/signup.js')(passport);

  //login
  router.post('/login',
    passport.authenticate('local-login', {
      failureRedirect: '/login',
      failureFlash: true
    }), (req, res, next) => {
      req.session.save((err) => {
          if (err) {
              return next(err);
          }
          res.json({ message: 'Logged In' });
      });
  });

  router.get('/logout', function(req, res){
    req.logout();
    req.session.destroy(function() {

      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });

  // --------------------------------------------
  //                  ROUTES
  // --------------------------------------------

  // -- ping
  router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
  });

  router.route('/signup')
    .post(passport.authenticate('local-signup'));

  // -- Create endpoint handlers for /languages
  router.route('/languages')
    .post(isLoggedIn, languageController.postLanguage)
    .get(isLoggedIn, languageController.getLanguages);

  // Create endpoint handlers for /languages/:language_id
  router.route('/languages/:language_id')
    .get(isLoggedIn, languageController.getLanguage)
    .put(isLoggedIn, languageController.putLanguage)
    .delete(isLoggedIn, languageController.deleteLanguage);

   // -- Create endpoint handlers for /translators
  router.route('/translators')
    .post(isLoggedIn, translatorController.postTranslator)
    .get(isLoggedIn, translatorController.getTranslators);

  // Create endpoint handlers for /translators/:translator_id
  router.route('/translators/:translator_id')
    .get(isLoggedIn, translatorController.getTranslator)
    .put(isLoggedIn, translatorController.putTranslator)
    .delete(isLoggedIn, translatorController.deleteTranslator);

  // -- Create endpoint handlers for /clients
  router.route('/clients')
    .post(isLoggedIn, clientController.postClient)
    .get(isLoggedIn, clientController.getClients);

  // Create endpoint handlers for /clients/:client_id
  router.route('/clients/:client_id')
    .get(isLoggedIn, clientController.getClient)
    .put(isLoggedIn, clientController.putClient)
    .delete(isLoggedIn, clientController.deleteClient);

  // Create endpoint handlers for /users
  router.route('/users')
    .get(isLoggedIn, userController.getUsers);

  // -- Create endpoint handlers for /contracts
  router.route('/contracts')
    .post(isLoggedIn, contractController.postContract)
    .get(isLoggedIn, contractController.getContracts);

  // Create endpoint handlers for /contracts/:contract_id
  router.route('/contracts/:contract_id')
    .get(isLoggedIn, contractController.getContract)
    .put(isLoggedIn, contractController.putContract)
    .delete(isLoggedIn, contractController.deleteContract)
    .patch(isLoggedIn,contractController.patchContract);

  // -- Create endpoint handlers for /translations
  router.route('/translations')
    .post(isLoggedIn, translationController.postTranslation)
    .get(isLoggedIn, translationController.getTranslations);

  // Create endpoint handlers for /translations/:translation_id
  router.route('/translations/:translation_id')
    .get(isLoggedIn, translationController.getTranslation)
    .put(isLoggedIn, translationController.putTranslation)
    .delete(isLoggedIn, translationController.deleteTranslation);

  // -- Create endpoint handlers for /files
  router.route('/files')
    .post(isLoggedIn, fileController.postFile)
    .get(isLoggedIn, fileController.getFiles);

  // Create endpoint handlers for /files/:file_id
  router.route('/files/:file_id')
    .get(isLoggedIn, fileController.getFile)
    .put(isLoggedIn, fileController.putFile)
    .delete(isLoggedIn, fileController.deleteFile);
  // --------------------------------------------

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
      return next();

    res.status(401).send();
  }
  // Register all our routes with /api
  app.use('/api', router);
}
