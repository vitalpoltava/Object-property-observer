/**
 * Observe object's property without timers (where there is no ability to use Object.observe)
 *
 * @author Vitalii Omelkin
 */
;(function() {
    if('observeProperty' in Object) {
        return;
    }

    Object.prototype.observeProperty = function(propName, callback) {
        var value;
        var that = this;

        if (!propName in this) throw new Error('[' + propName + '] is not in object');
        if (typeof callback !== 'function') throw new Error('Callback is not a function');
        if (typeof Object.defineProperty !== 'function') throw new Error('Object.defineProperty is missing');

        value = this[propName]; // initial assigning

        Object.defineProperty(this, propName, {
            get: function() { return value; },
            set: function(newValue) {
                if (newValue !== value) {
                    try {
                        callback(newValue, value, propName, that);
                        value = newValue;
                    } catch (err) {
                        throw new Error('Property Observer callback triggered an error: ' + err);
                    }
                }
            }
        });
    };
})();