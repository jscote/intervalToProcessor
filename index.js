/**
 * Created by jean-sebastiencote on 2/11/15.
 */
(function(_, serviceMessage, processor){
    'use strict';

    var intervals = {};

    //Configure intervals for processor
    var configure = function configure(intervalConfigs) {

        if(_.isUndefined(intervalConfigs) || _.isUndefined(intervalConfigs.schedules) || !_.isArray(intervalConfigs.schedules)) {
            throw Error("Configuration is not valid");
        }

        for (var iIdx = 0; iIdx < intervalConfigs.schedules.length; iIdx++) {
            (function (schedule) {
                intervals[schedule.alias] = setInterval(function () {
                    processor.Processor.getProcessor(schedule.processorName).then(function (processor) {
                        var request = new serviceMessage.ServiceMessage();
                        request.data = {interval: schedule.interval};

                        processor.execute(request);
                    }).fail(function(error) {
                        console.log(error);
                    });
                }, schedule.interval);
            })(intervalConfigs.schedules[iIdx]);
        }
    };

    module.exports.Configure = configure;

})(require('lodash'), require('jsai-servicemessage'), require('jsai-jobprocessor'));