document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("user-email");
  const password = document.getElementById("user-password");

  if (email.value === "") alert("Email cannot be empty");
  else if (password.value === "") alert("Password cannot be empty");

  const url = "http://localhost:5000/login";
  const data = {
    email: email.value,
    password: password.value,
  };

  email.value = "";
  password.value = "";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
});
