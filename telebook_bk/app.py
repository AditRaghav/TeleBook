from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  
app.config['MYSQL_PASSWORD'] = 'Galaxy'  
app.config['MYSQL_DB'] = 'contactsDB'

mysql = MySQL(app)

# Get all contacts
@app.route('/contacts', methods=['GET'])
def get_contacts():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM contacts")
    contacts = cur.fetchall()
    cur.close()

    contacts_list = []
    for contact in contacts:
        contact_data = {
            'id': contact[0],
            'firstName': contact[1],
            'lastName': contact[2],
            'phone': contact[3],
            'email': contact[4],
        }
        contacts_list.append(contact_data)

    return jsonify(contacts_list)


# Add a new contact
@app.route('/contacts', methods=['POST'])
def add_contact():
    data = request.json
    firstName = data['firstName']
    lastName = data['lastName']
    phone = data['phone']
    email = data['email']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO contacts (firstName, lastName, phone, email) VALUES (%s, %s, %s, %s)",
                (firstName, lastName, phone, email))
    mysql.connection.commit()
    cur.close()

    return jsonify({'msg': 'Contact added successfully'}), 201

# Update a contact by ID
@app.route('/contacts/<int:id>', methods=['PUT'])
def update_contact(id):
    data = request.json
    firstName = data['firstName']
    lastName = data['lastName']
    phone = data['phone']
    email = data['email']

    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE contacts SET firstName = %s, lastName = %s, phone = %s, email = %s 
        WHERE id = %s
    """, (firstName, lastName, phone, email, id))
    mysql.connection.commit()
    cur.close()

    return jsonify({'msg': 'Contact updated successfully'})

# Delete a contact by ID
@app.route('/contacts/<int:id>', methods=['DELETE'])
def delete_contact(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM contacts WHERE id = %s", [id])
    mysql.connection.commit()
    cur.close()

    return jsonify({'msg': 'Contact deleted successfully'})

# Add contact to favorites
@app.route('/favorites/<int:contact_id>', methods=['POST'])
def add_favorite(contact_id):
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO favorites (contact_id) VALUES (%s)", [contact_id])
    mysql.connection.commit()
    cur.close()

    return jsonify({'msg': 'Contact added to favorites'})

# Get all favorite contacts
@app.route('/favorites', methods=['GET'])
def get_favorites():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT contacts.id, contacts.firstName, contacts.lastName, contacts.phone, contacts.email 
        FROM contacts JOIN favorites ON contacts.id = favorites.contact_id
    """)
    favorites = cur.fetchall()
    cur.close()

    favorites_list = []
    for contact in favorites:
        contact_data = {
            'id': contact[0],
            'firstName': contact[1],
            'lastName': contact[2],
            'phone': contact[3],
            'email': contact[4],
        }
        favorites_list.append(contact_data)

    return jsonify(favorites_list)

# Remove contact from favorites
@app.route('/favorites/<int:contact_id>', methods=['DELETE'])
def remove_favorite(contact_id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM favorites WHERE contact_id = %s", [contact_id])
    mysql.connection.commit()
    cur.close()

    return jsonify({'msg': 'Contact removed from favorites'})

# Search contacts by first name, last name, phone, or email
@app.route('/contacts/search', methods=['GET','POST'])
def search_contact():
    search_query = request.args.get('search')
    search_term = f"%{search_query}%"

    cur = mysql.connection.cursor()
    query = """
        SELECT * FROM contacts 
        WHERE firstName LIKE %s OR lastName LIKE %s OR phone LIKE %s OR email LIKE %s
    """
    cur.execute(query, (search_term, search_term, search_term, search_term))
    contacts = cur.fetchall()
    cur.close()

    contacts_list = []
    for contact in contacts:
        contact_data = {
            'id': contact[0],
            'firstName': contact[1],
            'lastName': contact[2],
            'phone': contact[3],
            'email': contact[4],
        }
        contacts_list.append(contact_data)

    return jsonify(contacts_list)

if __name__ == '__main__':
    app.run(debug=True)
