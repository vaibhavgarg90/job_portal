'use strict';

module.exports = function(Employee) {

  Employee.disableRemoteMethodByName('deleteById');

};
