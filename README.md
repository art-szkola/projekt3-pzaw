# projekt4-pzaw
Project allows the user to add messages to a board upon login/signup  
All messages and users are stored in an integrated database  
Users can edit and delete their own messages  
Admins can edit and delete all messages  
Users can create accounts for themselves upon inputting correct data (Username, Display name, Email, Password, Repeated Password)  
To make an account an administrator you have to run a query on the database  
Users can log into their account with the correct information (Username or email and password)  
The database is created upon running index.js  
 
The project comes with:  
‎    - 1 admin account (data is in index.js), default info is:  
‎        - username: admin  
‎        - display name: Administrator  
‎        - password: admin123  
‎        - email: admin@admin.admin     
	‎  			‎   
‎				* If createAdmin() is still in index.js a new admin account with the same info will be created on startup  
    ‎  
	    ‎  
Setup:    
‎  	- Install ejs, express, sqlite3, brcyptjs and express-session     
‎  	- To run the project open the project directory in the terminal and type "node index.js", then in your web browser open localhost:8000      
