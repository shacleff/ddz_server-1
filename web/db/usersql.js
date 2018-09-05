var UserSQL = {  
    insert:'INSERT INTO User(username,password) VALUES(?,?)', 
    queryAll:'SELECT * FROM User',  
    getUserById:'SELECT * FROM User WHERE id = ? ',
    getUserByUsername:'SELECT * FROM User WHERE username = ? ',
  };
module.exports = UserSQL;