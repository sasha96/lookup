({
    doInit: function (component, event, helper) {

        var lstObject = component.get('v.objectsName').trim();
        var lstObjectsParsed = [];

        var lstIcons = [];
        var iconParam = component.get('v.iconParams').trim();

        var isNextIcon = true;
        while (isNextIcon) {
            if (iconParam.indexOf(';') > -1) {
                lstIcons.push(iconParam.substring(0, iconParam.indexOf(';')));
                iconParam = iconParam.substring(iconParam.indexOf(';') + 1);
            } else {
                isNextIcon = false;
                if (iconParam.length > 0) {
                    lstIcons.push(iconParam);
                }
            }
        }

        var lstObjects = [];
        var isNext = true;
        while (isNext) {
            if (lstObject.indexOf(';') > -1) {
                lstObjects.push(lstObject.substring(0, lstObject.indexOf(';')));
                lstObject = lstObject.substring(lstObject.indexOf(';') + 1);
            } else {
                isNext = false;
                if (lstObject.length > 0) {
                    lstObjects.push(lstObject);
                }
            }
        }

        var objsApiName = component.get('v.objsApiName').trim();
        var lstObjectsApi = [];
        var isNext = true;

        while (isNext) {
            if (objsApiName.indexOf(';') > -1) {
                lstObjectsApi.push(objsApiName.substring(0, objsApiName.indexOf(';')));
                objsApiName = objsApiName.substring(objsApiName.indexOf(';') + 1);
            } else {
                isNext = false;
                if (objsApiName.length > 0) {
                    lstObjectsApi.push(objsApiName);
                }
            }
        }

        for (var i = 0; i < lstObjects.length; i++) {
            lstObjectsParsed.push({
                iconName: lstIcons[i],
                objectName: lstObjects[i],
                objectApiName: lstObjectsApi[i]
            })
        }

        component.set('v.listOfTypes', lstObjectsParsed);
        component.set('v.selectedType', lstObjectsParsed[0]);

        if (lstObjectsParsed.length === 1) {
            component.set('v.iconParams', lstObjectsParsed[0].iconName);
            component.set('v.objsApiName', lstObjectsParsed[0].objectApiName);
        }

        helper.updateObjectshandler(component, event, helper);
    },

    handlerTypes: function (component, event, helper) {

        var focus = function () {
            component.set("v.isDropdownOpen", true);
        }
        var blur = function () {
            component.set("v.isDropdownOpen", false);
        }
        component.find('dropdownUtilType').focus(focus, blur);

    },

    selectTypeHandler: function (component, event, helper) {

        var selectedType = component.get('v.selectedType');
        var newSelectedType = event.currentTarget.dataset.name;
        var allObjects = component.get('v.listOfTypes');
        if (selectedType.ObjectName !== newSelectedType) {
            var newObject;
            for (var i = 0; i < allObjects.length; i++) {
                if (allObjects[i].objectName === newSelectedType) {
                    newObject = allObjects[i];
                }
            }

            component.set('v.selectedType', newObject);
            var newPlaceholder = component.get('v.searchName').substring(0, 7) + newObject.objectName + '...';
            component.set('v.searchName', newPlaceholder);
            component.set('v.objsApiName', newObject.objectApiName);
            helper.doSearchHelper(component, event, helper);
        }

    },

    setFocus: function (component, event, helper) {
        helper.setFocusHendler(component, event, helper);
    },

    clearSearch: function (component, event, helper) {
        component.set("v.searchString", null);
    },

    doSearch: function (component, event, helper) {
        helper.setFocusHendler(component, event, helper);
        helper.doSearchHelper(component, event, helper);
    },

    selectOption: function (component, event, helper) {

        var id = event.currentTarget.dataset.id;
        var lstRecords = component.get("v.lstRecords");
        var selected = lstRecords.filter(function (e) {
            return e.Id == id;
        });

        component.set("v.recordId", id);
        component.set("v.selectedRecord", selected[0]);

        component.set("v.searchString", null);
        component.set("v.lstRecords", []);

    },

    handleRemove: function (component, event, helper) {

        component.set("v.recordId", null);
        component.set("v.selectedRecord", null);

    },

})
