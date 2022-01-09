let url = "http://localhost:5000/user";
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

    const fetchBooks = `http://localhost:5000/api/book/${_id}`;
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
