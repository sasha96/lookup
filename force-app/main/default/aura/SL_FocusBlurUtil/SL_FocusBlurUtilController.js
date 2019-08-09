({
    setFocus: function (component, event, helper) {
        // get params sent from parent

        var params = event.getParams().arguments;

        // blur event function
        var blurListener = function (e, t) {
            try {
                // if there are exceptions, check if clicked element is not child of excluded elements
                var elem = e.target.tagName ? e.target : (e.path.length ? e.path[0] : null);
                if (params.exceptions && elem &&
                    elem.closest(params.exceptions)) {
                    return;
                }
                // remove event function after running
                window.removeEventListener('click', blurListener);
                window.listenerSet = false;
                // call parent function
                params.blur();

            }
            catch (exc) {
            }
        }
        // close potential previous open dropdowns
        if (window.listenerSet) {
            document.children[0].click();
            /* Added next two lines for polymorph Lookup */
            params.blur();
            return;

        }
        // open doropdown with focus fcn
        params.focus();
        // add event listener
        window.setTimeout(function () {
            window.addEventListener('click', blurListener);
            window.listenerSet = true;
            window.blurListener = blurListener;
        })
    }
})