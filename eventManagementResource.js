// resource for event management API access
app.factory('eventManagementResource', [
    '$resource',
    function ($resource) {
        // for API without action
        var resource = $resource('/api/:controller/:id',
            { controller: '@controller', id: '@id' },
            {
                'list': { method: 'GET', isArray: true },
                'get': { method: 'GET' },
                'save': { method: 'POST' },
                'update': { method: 'PUT' },
                'remove': { method: 'DELETE' },
                'patch': { method: 'PATCH' }
            });

        // for API with action
        var apiWithActionResorce = $resource('/api/:controller/:action/:id',
            { controller: '@controller', action: '@action', id: '@id' },
            {
                'list': { method: 'GET', isArray: true },
                'get': { method: 'GET' },
                'save': { method: 'POST' },
                'update': { method: 'PUT' },
                'remove': { method: 'DELETE' }
            });

        function EventManagementResource() {
            // Not to hardcode ids and actions and 
            // for code optimization purposes
            var ParamsList = function (action, id) {
                this.id = id;
                this.action = action;
                this.controller = 'eventManagement';
            };

            /*
             * get all user events
             * @returns {} api request with promise
             */
            this.getAllUserManagerEvents = function () {
                var params = new ParamsList("getAllUserManagerEvents");
                return apiWithActionResorce.list(params).$promise;
            };

            /*
             * get event participant by event id
             * @param {} id event id
             * @returns {} api request with promise
             */
            this.getEventParticipantsByEventId = function (id) {
                var params = new ParamsList("getParticipants", id);
                return apiWithActionResorce.list(params).$promise;
            };

            /*
            * exclude participant by id
            * @param {} id participant id
            * @returns {} api request with promise
            */
            this.excludeParticipantById = function (id) {
                var params = new ParamsList("excludeParticipant", id);
                return apiWithActionResorce.get(params).$promise;
            };

            /*
            * get event code registration
            * @param {} code event code
            * @returns {} api request with promise
            */
            this.codeRegistration = function (code) {
                var params = new ParamsList("codeRegistration");
                params.code = code;
                return apiWithActionResorce.get(params).$promise;
            };

            /*
            * get event start date
            * @returns {} api request with promise
            */
            this.getEventStartDate = function () {
                var params = new ParamsList("getEventStartDate");
                return apiWithActionResorce.list(params).$promise;
            };

            /*
            * get all timezones
            * @returns {} api request with promise
            */
            this.getTimezone = function () {
                var params = new ParamsList("getTimezone");
                return apiWithActionResorce.list(params).$promise;
            };

            /*
            * save event MSP
            * @param {} data event model
            * @returns {} api request with promise
            */
            this.saveEventMSP = function (data) {
                var params = new ParamsList("saveEventMSP");
                return apiWithActionResorce.save(params, data).$promise;
            };
        };

        // return new instance of management resource
        return new EventManagementResource();
    }
]);
