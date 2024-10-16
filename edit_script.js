document.addEventListener("DOMContentLoaded", () => {
    loadContactData();
    
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission
        updateContact();
    });
});

function loadContactData() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");
    const phone = params.get("phone");
    const email = params.get("email");

    // Populate form fields
    document.getElementById("first-name").value = firstName;
    document.getElementById("last-name").value = lastName;
    document.getElementById("phone").value = phone;
    document.getElementById("email").value = email;

    // Store contact ID in the form
    const contactIdInput = document.createElement("input");
    contactIdInput.type = "hidden";
    contactIdInput.id = "contact-id";
    contactIdInput.value = id;
    document.getElementById("contactForm").appendChild(contactIdInput);
}

function updateContact() {
    const id = document.getElementById("contact-id").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    const data = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
    };

    fetch(`http://127.0.0.1:5000/contacts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (response.ok) {
            alert("Contact updated successfully!");
            window.location.href = "index.html"; // Redirect to the first page
        } else {
            console.error("Failed to update contact");
        }
    })
    .catch((error) => {
        console.error("Error updating contact:", error);
    });
}





