# projekt3-pzaw
Project allows the user to add messages to a board upon login/signup
All messages are stored in an integrated database
Users can edit and delete their own messages
Admins can edit and delete all messages
Users can create accounts for themselves upon inputting correct data (Username, Display name, Email, Password, Repeated Password)
To make an account an administrator you have to run a query on the database
Users can log into their account with the correct information (Username or email and password)

The project comes with:
    - 2 test messages (1 from an admin test account, 1 from a user test account)
    - 1 admin account (data is in index.js, default info is:
        - username: admin
        - display name: Administrator
        - password: admin123
        - email: admin@admin.admin
    )
    - 1 test account with the following info:
        - username: test
        - display name: Test
        - password: test
        - email: test@test.test

To remove test account and admin account as well as test messages remove the integrated database, a new one will be created upon running index.js
    * If createAdmin() is still in index.js a new admin account with the same info will be created on startup

To run the project open the directory and type "node index.js"