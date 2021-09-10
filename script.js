let DefaultProperties = {
  text: "",
  "font-weight": "",
  "font-style": "",
  "text-decoration": "",
  "text-align": "left",
  "background-color": "#ffffff",
  color: "#000000",
  "font-family": "Noto Sans",
  "font-size": "18px",
};

let CellData = {
  "Sheet-1": {},
};

let SelectedSheet = "Sheet-1";
let TotalSheets = 0;

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

  // Font family and font size

  $(".font-family-selector").change(function () {
    UpdateCells("font-family", $(this).val(), true);
  });
  $(".font-size-selector").change(function () {
    UpdateCells("font-size", $(this).val(), true);
  });

  // Making cells bold, italic, underline. Toggle should be after this function. (Sequential Execution)
  $(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
      UpdateCells("font-weight", "", true);
    } else {
      UpdateCells("font-weight", "bold", false);
    }
  });

  $(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
      UpdateCells("font-style", "", true);
    } else {
      UpdateCells("font-style", "italic", false);
    }
  });

  $(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
      UpdateCells("text-decoration", "", true);
    } else {
      UpdateCells("text-decoration", "underline", false);
    }
  });

  $(".style-icon").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("selected");
  });

  // Text Alignment

  $(".icon-align-left").click(function () {
    if (!$(this).hasClass("selected")) {
      UpdateCells("text-align", "left", true);
    }
  });

  $(".icon-align-right").click(function () {
    if (!$(this).hasClass("selected")) {
      UpdateCells("text-align", "right", false);
    }
  });

  $(".icon-align-center").click(function () {
    if (!$(this).hasClass("selected")) {
      UpdateCells("text-align", "center", false);
    }
  });

  $(".align-icon").click(function (e) {
    e.preventDefault();
    $(".align-icon.selected").removeClass("selected");
    $(this).addClass("selected");
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
    UpdateHeader(this);
  });

  // Making cells editable by double-click

  $(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  $(".input-cell").blur(function () {
    $(".input-cell.selected").attr("contenteditable", "false");
  });

  // Making row and column name containers scroll with the input cell container

  $(".input-cell-container").scroll(function () {
    $(".col-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  });

  // Color pickers

  $(".bg-color-click").click(function () {
    $(".background-color-picker").click();
  });

  $(".text-color-click").click(function () {
    $(".text-color-picker").click();
  });

  $(".background-color-picker").change(function () {
    UpdateCells("background-color", $(this).val(), true);
  });

  $(".text-color-picker").change(function () {
    UpdateCells("color", $(this).val(), true);
  });
});

function GetRowCol(e) {
  let idArray = $(e).attr("id").split("-");
  let row = parseInt(idArray[1]);
  let col = parseInt(idArray[3]);
  return [row, col];
}

function UpdateCells(property, value, defaultPossible) {
  $(".input-cell.selected").each(function () {
    $(this).css(property, value);
    let [row, col] = GetRowCol(this);

    if (CellData[SelectedSheet][row]) {
      if (CellData[SelectedSheet][row][col]) {
        CellData[SelectedSheet][row][col][property] = value;
      } else {
        CellData[SelectedSheet][row][col] = { ...DefaultProperties };
        CellData[SelectedSheet][row][col][property] = value;
      }
    } else {
      CellData[SelectedSheet][row] = {};
      CellData[SelectedSheet][row][col] = { ...DefaultProperties };
      CellData[SelectedSheet][row][col][property] = value;
    }
    if (defaultPossible) {
      let IsDefault =
        JSON.stringify(CellData[SelectedSheet][row][col]) ===
        JSON.stringify(DefaultProperties);
      if (IsDefault) {
        delete CellData[SelectedSheet][row][col];
        if (Object.keys(CellData[SelectedSheet][row]).length == 0) {
          delete CellData[SelectedSheet][row];
        }
      }
    }
    UpdateHeader(this);
  });
  console.log(CellData);
}

function UpdateHeader(ele) {
  let [row, col] = GetRowCol(ele);
  let CurCellData = DefaultProperties;
  if (CellData[SelectedSheet][row] && CellData[SelectedSheet][row][col]) {
    CurCellData = CellData[SelectedSheet][row][col];
  }

  CurCellData["font-weight"]
    ? $(".icon-bold").addClass("selected")
    : $(".icon-bold").removeClass("selected");
  CurCellData["font-style"]
    ? $(".icon-italic").addClass("selected")
    : $(".icon-italic").removeClass("selected");
  CurCellData["text-decoration"]
    ? $(".icon-underline").addClass("selected")
    : $(".icon-underline").removeClass("selected");

  CurCellData["text-align"] == "left"
    ? $(".icon-align-left").addClass("selected")
    : $(".icon-align-left").removeClass("selected");
  CurCellData["text-align"] == "right"
    ? $(".icon-align-right").addClass("selected")
    : $(".icon-align-right").removeClass("selected");
  CurCellData["text-align"] == "center"
    ? $(".icon-align-center").addClass("selected")
    : $(".icon-align-center").removeClass("selected");

  // Pickers
  $(".background-color-picker").val(CurCellData["background-color"]);
  $(".text-color-picker").val(CurCellData["color"]);

  // Font family and size
  console.log("CSS");
  $(".font-family-selector").val(CurCellData["font-family"]);
  $(".font-family-selector").css("font-family", CurCellData["font-family"]);
  $(".font-size-selector").val(CurCellData["font-size"]);
}
