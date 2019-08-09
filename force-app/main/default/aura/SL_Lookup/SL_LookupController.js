({
    doInit: function (component, event, helper) {

        var iconParam = component.get('v.iconParam');
        var isEmptyIcon = iconParam === undefined ? true : false;
        component.set('v.isEmptyIcon', isEmptyIcon);

        var recordId = component.get("v.recordId");
        var searchField = component.get("v.searchField");
        var objectApiName = component.get("v.objApiName");

        if (recordId != null) {
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
                }
            });
            $A.enqueueAction(action);
        }

        var option = component.get("v.selectedRecord");
        if (!option) return;
        option.objName = option[searchField];
        component.set("v.selectedRecord", option);

    },

    setFocus: function (component, event, helper) {

        var focus = function () {
            component.set("v.isDropdownOpen", true);
        }
        var blur = function () {
            component.set("v.isDropdownOpen", false);
        }
        component.find('dropdownUtil').focus(focus, blur);

    },

    clearSearch: function (component, event, helper) {
        component.set("v.searchString", null);
    },

    doSearch: function (component, event, helper) {

        var searchString = component.get("v.searchString");

        if (searchString) {
            searchString = searchString.trim().replace(/\*/g).toLowerCase();
        }

        var objApiName = component.get("v.objApiName");
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
                    'objectName': objApiName,
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
                    }
                });
                action.setStorable();
                $A.enqueueAction(action);
                component.set('v.searchTimeout', null);
            }),
            300
        );
        component.set('v.searchTimeout', searchTimeout);

    },

    selectOption: function (component, event, helper) {

        var id = event.currentTarget.dataset.id;
        var lstRecords = component.get("v.lstRecords");
        var selected = lstRecords.filter(function (e) {
            return e.Id == id;
        });
        component.set("v.recordId", id);
        component.set("v.selectedRecord", selected[0]);
        component.set("v.isEmpty", '');

        component.set("v.searchString", null);
        component.set("v.lstRecords", []);

    },

    handleRemove: function (component, event, helper) {

        component.set("v.recordId", null);
        component.set("v.selectedRecord", null);

    },

})