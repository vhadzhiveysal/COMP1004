function changeContent(page) {
    //grabs the <div> element with id 'content', uses it to put html code inside, 'changes page' that way
    var contentDiv = document.getElementById('content');

    //switch case for changing page content to different 'pages'
    switch (page) {
        case 'list':
            contentDiv.innerHTML =
            `
            <nav>
                <ul class="top-list">
                    <li class="sub-title">
                        Your Contacts
                    </li>
                    <li class="nav-button">
                        <button onclick="changeContent('add')">
                            Add New Contact
                        </button>
                    </li>
                </ul>
            </nav>
            <main id="main">
                <div id="contactList">
                
                </div>
                <input type="file" id="fileInput">
                <script src="js.js"></script>
            </main>
            `;
            break;
        
        case 'add':
            contentDiv.innerHTML =
            `
            <nav>
                <ul class="top-list">
                    <li class="nav-button">
                        <button onclick="changeContent('list'); displayContacts();">
                            Back to Contact List
                        </button>
                    </li>
                </ul>
            </nav>
            <form id="create-contact-form">
                <p class="sub-title">Create New Contact</p>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name"
                    placeholder="Enter Name" required>

                <label for="phone">Phone:</label>
                <input type="text" id="phone" name="phone"
                    placeholder="Enter Phone" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email"
                    placeholder="Enter Email" required>

                <label for="birthdate">Birthdate:</label>
                <input type="date" id="birthdate" name="birthdate" required>

                <button type="submit">Create Contact</button>
            </form>
            `;
            var form = document.getElementById("create-contact-form");
            form.addEventListener("submit", handleFormSubmit);
            break;
        
        case 'edit':
            contentDiv.innerHTML =
            `
            <nav>
                <ul class="top-list">
                    <li class="nav-button">
                        <button onclick="changeContent('list'); displayContacts();">
                            Back to Contact List
                        </button>
                    </li>
                </ul>
            </nav>
            <form id="edit-contact-form">
                <p class="sub-title">Edit Contact</p>
                <label for="edit-name">Name:</label>
                <input type="text" id="edit-name" name="name"
                    placeholder="Enter Name" required>

                <label for="edit-phone">Phone:</label>
                <input type="text" id="edit-phone" name="phone"
                    placeholder="Enter Phone" required>

                <label for="edit-email">Email:</label>
                <input type="email" id="edit-email" name="email"
                    placeholder="Enter Email" required>

                <label for="edit-birthdate">Birthdate:</label>
                <input type="date" id="edit-birthdate" name="birthdate" required>

                <button type="submit">Save Changes</button>
            </form>
            <script src="js.js"></script>
            `
            var form = document.getElementById('edit-contact-form');
            form.addEventListener("submit", handleFormEdit);
            break;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}



//following 2 functions serve to save contact information in local storage
//otherwise information gets deleted when page refreshes or closes
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
}

function loadContacts() {
    var savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
        contacts = JSON.parse(savedContacts);
    }
}

var contacts = [];

loadContacts();

//this code handles json file inputs, it parses json data from the file, then it overwrites it to the contacts array
//then it redisplays the contacts list
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const contactsJson = e.target.result;
        const contacts = JSON.parse(contactsJson);

        saveJSONContacts(contacts);
        saveContacts();
        displayContacts();
    };
    reader.readAsText(file);
});

//this function overwrites the current contacts array with the inputted json file
function saveJSONContacts(JSONcontacts) {
    contacts = JSONcontacts;
    console.log("contacts array overwritten:", contacts);
}

//this function adds a new contact to the contacts array and saves it in localStorage
function addContact(contact) {
    contacts.push(contact);
    saveContacts();
}

//defines contact index variable, in other functions this will be used to save the specific contact index for later reference
let editingIndex = null;

//this function populates an edit contact form with existing contact information, information changes depending on which contact it is
//QoL feature for the user basically
function populateEditForm(index) {
    //saves contact index that's being edited
    editingIndex = index;

    changeContent('edit');
    //defines 'contact' variable for the specific contact to be used for adding existing info to edit form
    //better than doing contacts[index].name, etc
    var contact = contacts[index];

    //this saves the the indexed/specific contact's information onto existing html label tags, so it's already written out
    document.getElementById("edit-name").value = contact.name;
    document.getElementById("edit-email").value = contact.email;
    document.getElementById("edit-phone").value = contact.phone;
    document.getElementById("edit-birthdate").value = contact.birthdate;
}

/*
this function deletes the specified contact the user wants to delete, ensures the deletion of the unwanted contact,
then displays contacts again to remove unwanted contact from screen
*/
function deleteContact(index) {
    contacts.splice(index, 1);
    saveContacts();
    displayContacts();
}

//saves data from edit contact form into the indexed contact, ensuring edit is successful
function handleFormEdit(event) {
    event.preventDefault();

    var formData = new FormData(event.target);
    var editedContact = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        birthdate: formData.get("birthdate")
    };
    /*
    editingIndex is used to specify the previously defined contact index in other functions
    `contacts[index] = editedContact;` doesn't seem to work, but defining a global variable editingIndex and the other code works
    */
    //saves edited info to contact, 'switches page' to the contact list and runs displayContacts() to display the contact list
    contacts[editingIndex] = editedContact;
    saveContacts();

    changeContent("list");
    displayContacts();
}

//saves user input data from 'add contact' form in 'add' case/'page' to contacts array
function handleFormSubmit(event) {
    //prevents default form submission
    event.preventDefault();

    //gets form data from 'add contact' form
    var formData = new FormData(event.target);
    var name = formData.get("name");
    var email = formData.get("email");
    var phone = formData.get("phone");
    var birthdate = formData.get("birthdate");

    //create new contact object and populate it with grabbed form data
    var contact = {
        name: name,
        email: email,
        phone: phone,
        birthdate: birthdate
    };
    //runs addContact() function, basically pushes the new contact to the array and saves it to localStorage
    addContact(contact);

    event.target.reset();

    changeContent('list');
    displayContacts();
}
//reformats date from 'YYYY-MM-DD' to 'DD/MM/YYYY'
function formatDate(dateString) {
    var dateParts = dateString.split('-');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

//displays contact information in contacts array to page, populating 'contactList' div with the information 
function displayContacts() {
    var contactList = document.getElementById('contactList');

    //exits function if contactList is null, there to show an error with the div
    if (!contactList) {
        console.error("Element with id 'contactList' not found");
        return;
    }

    //checks if downloadDiv <div> element (gets created at bottom of function) already exists
    //if it does, delete it, otherwise it'll create the same element again and again after adding and editing contacts or inputting a json file
    var downloadDiv = document.getElementById('downloadDiv');
    if (downloadDiv) {
        downloadDiv.remove();
    }

    //clears previous content to display updated list
    contactList.innerHTML = "";

    //loops through the contacts array and creates html elements for each contact
    contacts.forEach(function(contact, index) {
        var contactDiv = document.createElement("div");
        var birthdate = formatDate(contact.birthdate);
        var editButton = document.createElement("button");
        var deleteButton = document.createElement("button");

        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";

        editButton.addEventListener("click", function() {
            populateEditForm(index);
        });
        
        deleteButton.addEventListener("click", function() {
            deleteContact(index);
        });

        contactDiv.innerHTML = `
        <h3>${contact.name}</h3>
        <p><span>Email:</span> ${contact.email}</p>
        <p><span>Phone:</span> ${contact.phone}</p>
        <p><span>Birthdate:</span> ${birthdate}</p>
        `;
        contactDiv.appendChild(editButton);
        contactDiv.appendChild(deleteButton);
        contactList.appendChild(contactDiv);
    });
    //code to create a download link for the user to download a json file of the contacts array
    //creates a div with id "downloadDiv" (css purposes), creates <a> tag where the url to download the file is stored
    var mainElement = document.getElementById('main');
    var contactsJson = JSON.stringify(contacts, null, 2); //`null, 2` is there for indentation and readability
    var blob = new Blob([contactsJson], {type: 'application/json'}); //blob = binary large object, contains the raw contacts array data
    var url = URL.createObjectURL(blob); //creates url with blob data
    var downloadDiv = document.createElement('div');
    downloadDiv.setAttribute('id', 'downloadDiv');
    var a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.json'; //creates a new file for user called 'contacts.json' contains the blob/contacts data
    a.textContent = 'Download Contacts';
    mainElement.appendChild(downloadDiv);
    downloadDiv.appendChild(a);
}


//this function is called for first time when page opens or when page refreshes, otherwise no info is displayed
displayContacts();