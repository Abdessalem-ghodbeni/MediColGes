// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract contractApi {
    struct Response {
        string formId;  // Maintenant un string pour correspondre aux IDs MongoDB ou similaires
        address respondent;
        string responseData;  // Les données de réponse stockées sous forme de chaîne de caractères ou en hash.
    }

    Response[] private responses;

    // Modification des événements pour utiliser string pour formId
    event ResponseAdded(string indexed formId, address indexed respondent, string responseData);
    event ResponseUpdated(uint256 indexed responseId, string newResponseData);
    event ResponseDeleted(uint256 indexed responseId);

    // Modificateur pour restreindre l'accès aux seuls répondants ayant créé la réponse
    modifier onlyRespondent(uint256 _responseId) {
        require(_responseId < responses.length, "Response ID out of bounds");
        require(responses[_responseId].respondent == msg.sender, "Unauthorized");
        _;
    }

    // Ajouter une réponse
    function addResponse(string memory _formId, string memory _responseData) public {
        responses.push(Response({
            formId: _formId,
            respondent: msg.sender,
            responseData: _responseData
        }));
        emit ResponseAdded(_formId, msg.sender, _responseData);
    }

    // Mettre à jour une réponse
    function updateResponse(uint256 _responseId, string memory _newResponseData) public onlyRespondent(_responseId) {
        responses[_responseId].responseData = _newResponseData;
        emit ResponseUpdated(_responseId, _newResponseData);
    }

    // Supprimer une réponse
    function deleteResponse(uint256 _responseId) public onlyRespondent(_responseId) {
        delete responses[_responseId];
        emit ResponseDeleted(_responseId);
    }

    // Obtenir une réponse spécifique par son ID
    function getResponse(uint256 _responseId) public view returns (Response memory) {
        require(_responseId < responses.length, "Response ID out of bounds");
        return responses[_responseId];
    }

    // Obtenir toutes les réponses pour un formulaire donné
    function getResponsesByForm(string memory _formId) public view returns (Response[] memory) {
        uint count = 0;
        // Compter les réponses correspondantes
        for (uint i = 0; i < responses.length; i++) {
            if (keccak256(abi.encodePacked(responses[i].formId)) == keccak256(abi.encodePacked(_formId))) {
                count++;
            }
        }

        // Allouer un tableau de la bonne taille pour stocker les résultats
        Response[] memory formResponses = new Response[](count);
        uint index = 0;

        // Collecter les réponses correspondantes
        for (uint i = 0; i < responses.length; i++) {
            if (keccak256(abi.encodePacked(responses[i].formId)) == keccak256(abi.encodePacked(_formId))) {
                formResponses[index] = responses[i];
                index++;
            }
        }
        return formResponses;
    }

    // Obtenir toutes les réponses
    function getAllResponses() public view returns (Response[] memory) {
        return responses;
    }

    // Nouvelle fonction pour obtenir toutes les réponses par utilisateur
    function getResponsesByUser(address _respondent) public view returns (Response[] memory) {
        uint count = 0;
        for (uint i = 0; i < responses.length; i++) {
            if (responses[i].respondent == _respondent) {
                count++;
            }
        }

        Response[] memory userResponses = new Response[](count);
        uint index = 0;
        for (uint i = 0; i < responses.length; i++) {
            if (responses[i].respondent == _respondent) {
                userResponses[index] = responses[i];
                index++;
            }
        }
        return userResponses;
    }
}
