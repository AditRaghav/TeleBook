# Contacts Management API

This is a Flask-based RESTful API for managing contacts, including functionality to add, update, delete, search, and manage favorite contacts.

## Requirements

- Python 3.x
- Flask
- Flask-MySQLdb
- Flask-CORS
- MySQL Database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/george-ct52/telebook_bk.git
   ```

2. Install dependencies:

   ```bash
   pip install flask flask-mysqldb flask-cors
   ```

3. Set up MySQL database:

   Create a new database `contactsDB` in MySQL and run the following SQL script to create the required tables:

   ```sql
   CREATE DATABASE contactsDB;

   USE contactsDB;

   CREATE TABLE contacts (
       id INT AUTO_INCREMENT PRIMARY KEY,
       firstName VARCHAR(100),
       lastName VARCHAR(100),
       phone VARCHAR(20),
       email VARCHAR(100)
   );

   CREATE TABLE favorites (
       id INT AUTO_INCREMENT PRIMARY KEY,
       contact_id INT,
       FOREIGN KEY (contact_id) REFERENCES contacts(id)
   );
   ```

4. Update the MySQL credentials in `app.py`:

   ```python
   app.config['MYSQL_HOST'] = 'localhost'
   app.config['MYSQL_USER'] = 'root'  # replace with your MySQL username
   app.config['MYSQL_PASSWORD'] = 'password'  # replace with your MySQL password
   app.config['MYSQL_DB'] = 'contactsDB'
   ```

5. Run the Flask application:

   ```bash
   python app.py
   ```

6. The API will be available at `http://127.0.0.1:5000`.

## API Endpoints

### 1. Get All Contacts

**Endpoint**: `/contacts`  
**Method**: `GET`

Retrieve a list of all contacts.

```bash
curl -X GET http://127.0.0.1:5000/contacts
```

### 2. Add a New Contact

**Endpoint**: `/contacts`  
**Method**: `POST`  
**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "email": "john.doe@example.com"
}
```

Add a new contact to the database.

```bash
curl -X POST http://127.0.0.1:5000/contacts -H "Content-Type: application/json" -d '{"firstName": "John", "lastName": "Doe", "phone": "1234567890", "email": "john.doe@example.com"}'
```

### 3. Update a Contact by ID

**Endpoint**: `/contacts/<id>`  
**Method**: `PUT`  
**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0987654321",
  "email": "john.doe@example.com"
}
```

Update the details of a contact with the given `id`.

```bash
curl -X PUT http://127.0.0.1:5000/contacts/1 -H "Content-Type: application/json" -d '{"firstName": "John", "lastName": "Doe", "phone": "0987654321", "email": "john.doe@example.com"}'
```

### 4. Delete a Contact by ID

**Endpoint**: `/contacts/<id>`  
**Method**: `DELETE`

Delete a contact by its `id`.

```bash
curl -X DELETE http://127.0.0.1:5000/contacts/1
```

### 5. Search for Contacts

**Endpoint**: `/contacts/search`  
**Method**: `GET`

Search for contacts using first name, last name, phone, or email.

```bash
curl -X GET "http://127.0.0.1:5000/contacts/search?search=John"
```

### 6. Add a Contact to Favorites

**Endpoint**: `/favorites/<contact_id>`  
**Method**: `POST`

Add a contact to the favorites list using the contact's `id`.

```bash
curl -X POST http://127.0.0.1:5000/favorites/1
```

### 7. Get All Favorite Contacts

**Endpoint**: `/favorites`  
**Method**: `GET`

Retrieve a list of all favorite contacts.

```bash
curl -X GET http://127.0.0.1:5000/favorites
```

### 8. Remove a Contact from Favorites

**Endpoint**: `/favorites/<contact_id>`  
**Method**: `DELETE`

Remove a contact from the favorites list using the contact's `id`.

```bash
curl -X DELETE http://127.0.0.1:5000/favorites/1
```
