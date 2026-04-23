// State to track selected customer
let selectedCustomerId = null;

// Get form elements
const form = document.getElementById("manage-form");
const firstNameInput = document.getElementById("first_name");
const lastNameInput = document.getElementById("last_name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const birthDateInput = document.getElementById("birth_date");
const submitBtn = document.getElementById("submit-btn");
const clearBtn = document.getElementById("clear-btn");
const deleteBtn = document.getElementById("delete-btn");

// Load all customers
async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    // Clear placeholder
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    // Create customer cards
    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      div.addEventListener("click", () => {
        selectCustomer(person);
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

// Select a customer and populate the form
function selectCustomer(person) {
  selectedCustomerId = person.id;

  firstNameInput.value = person.first_name;
  lastNameInput.value = person.last_name;
  emailInput.value = person.email;
  phoneInput.value = person.phone || "";
  birthDateInput.value = person.birth_date || "";

  // Update button states
  submitBtn.textContent = "Update Customer";
  deleteBtn.style.display = "inline-block";

  // Highlight selected customer card
  document.querySelectorAll(".customer-card").forEach(card => {
    card.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");

  // Scroll to form
  document.getElementById("customer-form").scrollIntoView({ behavior: "smooth" });
}

// Create or update a customer
async function saveCustomer(e) {
  e.preventDefault();

  const first_name = firstNameInput.value.trim();
  const last_name = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const birth_date = birthDateInput.value || null;

  if (!first_name || !last_name || !email) {
    alert("Please fill in all required fields (First Name, Last Name, Email)");
    return;
  }

  try {
    let url = "/api/persons";
    let method = "POST";
    let body = { first_name, last_name, email, phone: phone || null, birth_date };

    // If editing, use PUT instead
    if (selectedCustomerId !== null) {
      url = `/api/persons/${selectedCustomerId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`Error: ${data.error || "Failed to save customer"}`);
      return;
    }

    alert(selectedCustomerId ? "Customer updated successfully!" : "Customer added successfully!");
    clearForm();
    loadCustomers();

  } catch (err) {
    console.error("Error saving customer:", err);
    alert("Error saving customer. Check console for details.");
  }
}

// Delete a customer
async function deleteCustomer() {
  if (selectedCustomerId === null) {
    alert("Please select a customer to delete");
    return;
  }

  if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
    return;
  }

  try {
    const res = await fetch(`/api/persons/${selectedCustomerId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`Error: ${data.error || "Failed to delete customer"}`);
      return;
    }

    alert("Customer deleted successfully!");
    clearForm();
    loadCustomers();

  } catch (err) {
    console.error("Error deleting customer:", err);
    alert("Error deleting customer. Check console for details.");
  }
}

// Clear form
function clearForm() {
  form.reset();
  selectedCustomerId = null;
  submitBtn.textContent = "Add Customer";
  deleteBtn.style.display = "none";
  document.querySelectorAll(".customer-card").forEach(card => {
    card.classList.remove("selected");
  });
}

// Event listeners
form.addEventListener("submit", saveCustomer);
clearBtn.addEventListener("click", clearForm);
deleteBtn.addEventListener("click", deleteCustomer);

// Run on page load
loadCustomers();
