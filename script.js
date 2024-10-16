slide = (page) => {
  const pages = document.querySelectorAll(".page");
  pages?.forEach((page) => {
    page.classList?.remove("page-active");
  });
  switch (page) {
    case "dashboard":
      document.querySelector(".dashboard").classList.add("page-active");
      fetchContacts();
      break;
    case "addcontact":
      document.querySelector(".add-contact").classList.add("page-active");
      break;
    case "home":
      document.querySelector(".home").classList.add("page-active");
      break;
    case "favorates":
      document.querySelector(".favorates").classList.add("page-active");
      fetchFavorites();
      break;
    default:
      break;
  }
};

//add contact
window.onload = function () {
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;

      const contactData = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
      };

      fetch("http://127.0.0.1:5000/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Contact added successfully!");
            document.getElementById("contactForm").reset();
          } else {
            alert("Error adding contact.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
};

//view contact

document.addEventListener("DOMContentLoaded", () => {
  fetchContacts();
  fetchFavorites();
});

function fetchContacts() {
  fetch("http://127.0.0.1:5000/contacts")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("contact-table-body");
      tableBody.innerHTML = "";

      data.forEach((contact, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${contact.firstName} ${contact.lastName}</td>
                  <td>${contact.phone}</td>
                  <td>${contact.email}</td>
                  <td>
                      <div>
                          <button class="edit table-button" onclick="editContact(${contact.id}, '${contact.firstName}', '${contact.lastName}', '${contact.phone}', '${contact.email}')">edit</button>
                          <button class="delete table-button" data-id="${
                            contact.id
                          }">delete</button>
                      </div>
                  </td>
                  <td>
                      <img src="Resources/favorate_button.png" alt="favorite" class="favorite-button" data-id="${
                        contact.id
                      }">
                  </td>
              `;

        tableBody.appendChild(row);
      });

      // Attach event listeners for delete buttons
      attachDeleteEventListeners();
      // Attach event listeners for favorite buttons
      attachFavoriteEventListeners();
    })
    .catch((error) => {
      console.error("Error fetching contacts:", error);
    });
}

function editContact(id, firstName, lastName, phone, email) {
  const queryString = `?id=${id}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;
  window.location.href = `edit.html${queryString}`;

}


function attachDeleteEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const contactId = e.target.getAttribute("data-id");
      deleteContact(contactId);
    });
  });
}

function attachFavoriteEventListeners() {
  const favoriteButtons = document.querySelectorAll(".favorite-button");
  favoriteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const contactId = e.target.getAttribute("data-id");
      addFavorite(contactId, e.target);
    });
  });
}

function addFavorite(contactId, imgElement) {
  fetch(`http://127.0.0.1:5000/favorites/${contactId}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Contact ${contactId} added to favorites successfully`);
        alert("Contact added to favorites successfully!");
        // Change the image source to 'favorated.png'
        imgElement.src = "Resources/favorated.png";
        imgElement.alt = "Resources/favorited";
      } else {
        console.error("Failed to add contact to favorites");
      }
    })
    .catch((error) => {
      console.error("Error adding contact to favorites:", error);
    });
}

function deleteContact(contactId) {
  fetch(`http://127.0.0.1:5000/contacts/${contactId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Contact ${contactId} deleted successfully`);
        fetchContacts();
      } else {
        console.error("Failed to delete contact");
      }
    })
    .catch((error) => {
      console.error("Error deleting contact:", error);
    });
}

//search

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search");

  searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value;
    if (searchQuery) {
      searchContacts(searchQuery);
    } else {
      fetchContacts();
    }
  });
});

function searchContacts(query) {
  fetch(`http://127.0.0.1:5000/contacts/search?search=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("contact-table-body");
      tableBody.innerHTML = "";

      data.forEach((contact, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${contact.firstName} ${contact.lastName}</td>
          <td>${contact.phone}</td>
          <td>${contact.email}</td>
          <td>
            <div>
              <button class="edit table-button">edit</button>
              <button class="delete table-button" data-id="${
                contact.id
              }">delete</button>
            </div>
          </td>
          <td>
              <img src="Resources/favorate_button.png" alt="favorite" class="favorite-button" data-id="${
                contact.id
              }">
          </td>
        `;

        tableBody.appendChild(row);
      });

      const deleteButtons = document.querySelectorAll(".delete");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const contactId = e.target.getAttribute("data-id");
          deleteContact(contactId);
        });
      });
    })
    .catch((error) => {
      console.error("Error searching contacts:", error);
    });
}

//view favorites

function fetchFavorites() {
  fetch("http://127.0.0.1:5000/favorites")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("contact-table-body-favorates");
      tableBody.innerHTML = "";

      data.forEach((contact, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${contact.firstName} ${contact.lastName}</td>
                  <td>${contact.phone}</td>
                  <td>${contact.email}</td>
                  <td>
                      <div>
                          <img src="Resources/cancel_favorate.png" alt="Remove_favorate" id="remove-favorate" data-id="${
                            contact.id
                          }">
                      </div>
                  </td>
              `;

        tableBody.appendChild(row);
      });
      // Add event listeners for the remove buttons
      const removeButtons = document.querySelectorAll("#remove-favorate");
      removeButtons.forEach((button) => {
        button.addEventListener("click", removeFavorite);
      });
    })
    .catch((error) => {
      console.error("Error fetching contacts:", error);
    });
}
//remove favorites

function removeFavorite(event) {
  const contactId = event.target.getAttribute("data-id");

  fetch(`http://127.0.0.1:5000/favorites/${contactId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.msg); // Log success message
      fetchFavorites(); // Refresh the favorites list
    })
    .catch((error) => {
      console.error("Error removing favorite:", error);
    });
}
