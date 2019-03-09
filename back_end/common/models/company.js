'use strict';

module.exports = function(Company) {

  Company.disableRemoteMethodByName('deleteById');

};
