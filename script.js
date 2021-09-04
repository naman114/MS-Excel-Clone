$(document).ready(function () {
  for (let i = 1; i <= 100; i++) {
    let ColumnCode = "";

    let n = i;

    while (n > 0) {
      let rem = n % 26;
      if (rem == 0) {
        ColumnCode = "Z" + ColumnCode;
        n = Math.floor(n / 26) - 1;
      } else {
        ColumnCode = String.fromCharCode(rem - 1 + 65) + ColumnCode;
        n = Math.floor(n / 26);
      }
    }

    let ColumnTag = $(
      `<div class="col-name colId-${i}" id="col-code-${ColumnCode}">${ColumnCode}</div>`
    );
    $(".col-name-container").append(ColumnTag);
  }

  for (let RowCode = 1; RowCode <= 100; RowCode++) {
    let RowTag = $(
      `<div class="row-name" id="rowId=${RowCode}">${RowCode}</div>`
    );
    $(".row-name-container").append(RowTag);
  }

  for (let i = 1; i <= 100; i++) {
    let CellRow = $(`<div class="cell-row"></div>`);
    for (let j = 1; j <= 100; j++) {
      let ColCode = $(`.colId-${j}`).attr("id").split("-")[2];
      CellRow.append(
        `<div class="input-cell" id="row-${i}-col-${j}-colcode-${ColCode}" contenteditable="true"></div>`
      );
    }
    $(".input-cell-container").append(CellRow);
  }

  $(".align-icon").click(function (e) {
    e.preventDefault();
    $(".align-icon.selected").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".style-icon").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("selected");
  });

  $(".input-cell").click(function (e) {
    e.preventDefault();
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
  });
});
