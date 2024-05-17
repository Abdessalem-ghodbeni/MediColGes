const reponseControllerBlockchain = require("../controllers/reponseControllerBlockchain");
const route = require("express").Router();
const authentificationMiddleware = require('../middleware/autorisation');

route.post("/add", authentificationMiddleware.autorisation, reponseControllerBlockchain.AjouterResponseBlockchain);
route.get("/get/:userId", reponseControllerBlockchain.getAllResponseBlockchain);
route.get("/getbyIdForm/:formId/:userId", reponseControllerBlockchain.getAllResponseByIdFormBlockchain);

module.exports = route;