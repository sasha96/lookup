/**
*  Class name  :   SL_LookupController
*  Created by  :   Alex Zhurylo
*  Created on  :   08/09/19
*  Description :   controller for Lookup components
**/
public class SL_LookupController {
	@AuraEnabled(cacheable=true)
	public static List<SObject> search(String searchString, String objectName, String fields, 
										String soslParams, Integer limitOfRecords, List<Id> excludeIds) {

		String query = 'SELECT ' + fields + ' FROM ' + objectName + 
					   ' WHERE ' + fields + ' LIKE \'%'+ searchString +'%\' ' ;
		
		if(soslParams != null){
			query += ' AND ' + soslParams;
		}
		
		if(excludeIds.size() > 0){
			query += ' AND Id NOT IN   : excludeIds ';
		}
		query += ' ORDER BY Name LIMIT '  + limitOfRecords;

		List<sObject> resultList = Database.query(query);
		return resultList;  
	}

    @AuraEnabled
	public static SObject getRecord(String recordId, String objectName, String mainField) {
        
		Set<String> fieldsToQuery = new Set<string>();
			fieldsToQuery.add('Id');
			fieldsToQuery.add(mainField);
		
	    String query = 'SELECT ' + String.join(new List<String> (fieldsToQuery), ', ') +  ' FROM ' + objectName + ' WHERE Id = :recordId';
        	
		List<sObject> resultList = Database.query(query);
        return resultList[0];
	}

	@AuraEnabled
	public static List<SObject> getMultiRecords(String recordIds, String objectName, String mainField) {
        List<Id> recordIdsList = (List<Id>)JSON.deserialize(recordIds, List<Id>.class);
		
		List<sObject> resultList = new List<sObject>();

		Set<String> fieldsToQuery = new Set<string>();
			fieldsToQuery.add('Id');
			fieldsToQuery.add(mainField);

		String query = 'SELECT ' + String.join(new List<String> (fieldsToQuery), ', ') +  ' FROM ' + objectName ;
		if(recordIdsList.size()> 0){
			query += ' WHERE Id in :recordIdsList';
		}

		resultList = Database.query(query);
		
        return resultList;
	}    

}