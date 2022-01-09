document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("user-email");
  const password = document.getElementById("user-password");

  if (email.value === "") alert("Email cannot be empty");
  else if (password.value === "") alert("Password cannot be empty");
  else {
    const url = "http://localhost:5000/login";
    const data = {
      email: email.value,
      password: password.value,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          window.location.href = "/dashboard";
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) alert(`ERR 401: ${data.error}`);
      });
  }
});
