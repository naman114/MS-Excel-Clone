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
        `<div class="input-cell colcode-${ColCode}" id="row-${i}-col-${j}" contenteditable="false"></div>`
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

  // Selecting cells by single click (Ctrl key must be pressed for multiple cell selection)

  $(".input-cell").click(function (e) {
    if (e.ctrlKey) {
      let [row, col] = GetRowCol(this);
      if (row > 1) {
        let UpperCellSelected = $(`#row-${row - 1}-col-${col}`).hasClass(
          "selected"
        );
        if (UpperCellSelected) {
          $(this).addClass("top-cell-selected");
          $(`#row-${row - 1}-col-${col}`).addClass("bottom-cell-selected");
        }
      }

      if (col > 1) {
        let LeftCellSelected = $(`#row-${row}-col-${col - 1}`).hasClass(
          "selected"
        );
        if (LeftCellSelected) {
          $(this).addClass("left-cell-selected");
          $(`#row-${row}-col-${col - 1}`).addClass("right-cell-selected");
        }
      }

      if (col < 100) {
        let RightCellSelected = $(`#row-${row}-col-${col + 1}`).hasClass(
          "selected"
        );

        if (RightCellSelected) {
          $(this).addClass("right-cell-selected");
          $(`#row-${row}-col-${col + 1}`).addClass("left-cell-selected");
        }
      }

      if (row < 100) {
        let BottomCellSelected = $(`#row-${row + 1}-col-${col}`).hasClass(
          "selected"
        );
        if (BottomCellSelected) {
          $(this).addClass("bottom-cell-selected");
          $(`#row-${row + 1}-col-${col}`).addClass("top-cell-selected");
        }
      }
    } else {
      $(".input-cell.selected").removeClass("selected");
      $(".input-cell.left-cell-selected").removeClass("left-cell-selected");
      $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
      $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
      $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");
    }
    $(this).addClass("selected");
  });

  // Making cells editable by double-click

  $(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  // Making row and column name containers scroll with the input cell container

  $(".input-cell-container").scroll(function () {
    $(".col-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  });
});

function GetRowCol(e) {
  let idArray = $(e).attr("id").split("-");
  let row = parseInt(idArray[1]);
  let col = parseInt(idArray[3]);
  return [row, col];
}
