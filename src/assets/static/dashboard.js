// Event listener for logout
document.getElementById("logout-btn").addEventListener("click", () => {
  window.location.href = "/logout";
});

let url = "https://msexcelclone.netlify.app/user";
fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const { _id, name: username, email: useremail } = data.user;

    let initials = "";
    const name = username.split(" ");
    if (name.length >= 1) initials += name[0][0];
    if (name.length >= 2) initials += name[1][0];

    document.getElementById("user-initials").innerText = initials;

    const fetchBooks = `https://msexcelclone.netlify.app/api/book/${_id}`;
    fetch(fetchBooks)
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        const bookList = document.getElementById("book-list");
        let booksListHTML = "";

        for (let book of jsonData.data) {
          booksListHTML += `<div id="${book._id}" class="list-item-container">
            <div class="list-item">
                <div class="li-logo">
                    <img src="logo.png" alt="">
                </div>

                <div class="li-book-name">
                    <span class="li-text">${book.bookName}</span>
                </div>
                <div class="li-date">
                    <span class="li-text">${getFormattedDate(
                      book.updatedAt
                    )}</span>
                </div>
            </div>
            <hr>
        </div>`;
        }
        bookList.innerHTML = booksListHTML;

        Array.from(
          document.getElementsByClassName("list-item-container")
        ).forEach((elem) => {
          elem.addEventListener("click", () => {
            window.location.href = `/book/${elem.id}`;
          });
        });

        // Event-listener for create book
        document
          .getElementById("nav-item-new")
          .addEventListener("click", () => {
            document.getElementById(
              "container"
            ).innerHTML += `<div class="sheet-rename-modal">
          <h4 class="rename-modal-title">Create New Book</h4>
          <input type="text" class="new-sheet-name" placeholder="Enter Name" value="Untitled Book" autofocus/>
          <div class="action-buttons">
          <div class="submit-button">Create</div>
          <div class="cancel-button">Cancel</div>
          </div>
          </div>`;
            document.querySelector(".new-sheet-name").select();
            document
              .querySelector(".cancel-button")
              .addEventListener("click", () => {
                document.querySelector(".sheet-rename-modal").remove();
              });
            document
              .querySelector(".submit-button")
              .addEventListener("click", () => {
                const bookName =
                  document.querySelector(".new-sheet-name").value;

                const createBookUrl =
                  "https://msexcelclone.netlify.app/api/book";
                const newBookData = {
                  bookName: bookName,
                  userId: _id,
                };

                fetch(createBookUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newBookData),
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then((jsonData) => {
                    window.location.href = `/book/${jsonData.data._id}`;
                  });
              });
          });
      });
  });

function getFormattedDate(updatedAt) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateObj = new Date(updatedAt);
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}
