({
    updateObjectshandler: function (component, event, helper) {

        var iconParam = component.get('v.iconParams');
        var isEmptyIcon = iconParam === undefined ? true : false;
        component.set('v.isEmptyIcon', isEmptyIcon);

        var recordId = component.get("v.recordId");
        var searchField = component.get("v.searchField");
        var objectApiName = component.get("v.selectedType").objectApiName;

        if (recordId !== null && recordId && recordId !== '') {
            var action = component.get("c.getRecord");
            action.setParams({
                'recordId': recordId,
                'objectName': objectApiName,
                'mainField': searchField
            });
            action.setCallback(this, function (response) {
                if (response.getState() == "SUCCESS") {

                    var currentObject = response.getReturnValue();
                    var textField = currentObject[searchField];

                    var wrapperObject = { objName: textField };
                    component.set("v.selectedRecord", wrapperObject);
                } else {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Error Message',
                        message: 'Error happend in init method ',
                        duration: ' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
            });
            $A.enqueueAction(action);
        }

        var selected = component.get("v.valueObjects");
        if (!selected || !selected.length) {
            return;
        }
        selected.map(function (option) {
            option.objName = option[searchField];
            return option;
        })
        component.set("v.valueObjects", selected);

    },

    setFocusHendler: function (component, event, helper) {

        var focus = function () {
            component.set("v.isInputdropdownOpen", true);
        }
        var blur = function () {
            component.set("v.isInputdropdownOpen", false);
        }
        component.find('dropdownUtil').focus(focus, blur);
    },

    doSearchHelper: function (component, event, helper) {
        var searchString = component.get("v.searchString");
        if (searchString) {
            searchString = searchString.trim().replace(/\*/g).toLowerCase();
        }
        var objsApiName = component.get("v.selectedType").objectApiName;
        var searchField = component.get("v.searchField");

        var searchTimeout = component.get('v.searchTimeout');
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = window.setTimeout(
            $A.getCallback(() => {

                var action = component.get("c.search");
                action.setParams({
                    'searchString': searchString,
                    'objectName': objsApiName,
                    'fields': searchField,
                    'soslParams': component.get('v.soslParams'),
                    'limitOfRecords': component.get('v.limitOfRecords')
                });
                action.setCallback(this, function (response) {
                    if (response.getState() == "SUCCESS") {
                        var lstRecords = response.getReturnValue().map(function (option) {
                            option.objName = option[searchField];
                            return option;
                        });
                        component.set("v.lstRecords", lstRecords);
                    } else {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title: 'Error Message',
                            message: 'Error happend in search method',
                            duration: ' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'pester'
                        });
                        toastEvent.fire();
                    }
                });
                action.setStorable();
                $A.enqueueAction(action);
                component.set('v.searchTimeout', null);
            }),
            300
        );
        component.set('v.searchTimeout', searchTimeout);
    }
})
