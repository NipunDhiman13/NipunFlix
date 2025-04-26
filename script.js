function openModal() {
    let email = document.getElementById("emailInput").value;

    if (email.trim() === "") {
        alert("Please enter a valid email address.");
    } else {
        document.getElementById("customModal").style.display = "flex";
        document.getElementById("emailInput").value = ""; // Clear input field
    }
}

function closeModal() {
    document.getElementById("customModal").style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    let modal = document.getElementById("customModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
