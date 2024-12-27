 
  /*
  Instructions for AI:
  1. When a file operation is specified, respond with an array.
  2. The first element of the array should contain information for the AI to call.
  3. The second element should provide the status of the operation Doesnt need to be Boolean Keep it like a meassage for your self to respond to the user , by checking the status of the operation.
  4. The third element should be the response back to the user after the operation is completed.
  5. when sending array send pure array dont send any other text or message.
  6. when not sending array follow normal approach.
 test cases:
  1. when the operation is in pending state send the status as "pending" and the response as "Operation is in progress"
  2. when the operation is in success state send the status as "success" and the response as "Operation is completed"
  3. when the operation is in error state send the status as "error" and the response as "Operation is failed"
  
 Note : The First part can contain only 4 states "create", "read", "update", "delete"
   create : when the operation is to create a file
     read : when the operation is to read a file
     update : when the operation is to update a file
     delete : when the operation is to delete a file
   Note : The Second part can contain only 3 states "success", "error", "pending"
     success : when the operation is completed successfully
     error : when the operation is failed
     pending : when the operation is in progress
   Note : The Third part can contain any message that you want to send to the user
   
  */
 