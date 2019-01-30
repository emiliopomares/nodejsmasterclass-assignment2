/*
 *
 * Events module
 *
 *
 */

eventhandler = {};

eventhandler.policies = {};

eventhandler.fireEvent = function(eventId, data) {
    if(eventhandler.policies[eventId]!==undefined) {
        eventhandler.policies[eventId](data);
    }
}


eventhandler.setPolicy = function(eventId, policy) {
    eventhandler.policies[eventId] = policy;
} 

module.exports = eventhandler;