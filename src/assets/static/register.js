document.getElementById("register-btn").addEventListener("click", () => {
  const name = document.getElementById("user-name");
  const email = document.getElementById("user-email");
  const password = document.getElementById("user-password");

  if (name.value === "") alert("Name cannot be empty");
  else if (email.value === "") alert("Email cannot be empty");
  else if (password.value === "") alert("Password cannot be empty");
  else {
    const url = "http://localhost:5000/register";
    const data = {
      name: name.value,
      email: email.value,
      password: password.value,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 500)
        alert(`ERR ${response.status}: ${response.body.data}`);
      else if (response.status === 409)
        alert(`ERR ${response.status}: ${response.body.error}`);
      else if (response.status === 200) {
        alert("Registration successful. Please log in");
        window.location.href = "/";
      }
    });
  }
});
