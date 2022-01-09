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
  "Sheet 1": {},
};

let CutOrCopyCells = [];
let CutOrCopy = "";

let SelectedSheet = "Sheet 1";
let TotalSheets = 1;
// The TotalSheets cannot be zero since you cannot delete the original sheet
let LastAddedSheet = 1;

let BookName = "Untitled Book";

async function fetchBookData() {
  const bookId = window.location.href.split("/").at(-1);
  const url = `https://msexcelclone.netlify.app/api/book/data/${bookId}`;
  await fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      // console.log(jsonData);
      BookName = jsonData.bookName;
      CellData = JSON.parse(jsonData.bookData);
      SelectedSheet = jsonData.selectedSheet;
      TotalSheets = jsonData.totalSheets;
      LastAddedSheet = jsonData.lastAddedSheet;
      LoadExistingSheets();
    });
}

async function saveBookData() {
  const bookId = window.location.href.split("/").at(-1);
  const url = `https://msexcelclone.netlify.app/api/book/data/${bookId}`;

  const data = {
    cellData: JSON.stringify(CellData),
    bookName: BookName,
    selectedSheet: SelectedSheet,
    totalSheets: TotalSheets,
    lastAddedSheet: LastAddedSheet,
  };

  // console.log("data before post", data);

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      // console.log(jsonData);
    });
}

$(document).ready(function () {
  // fetch bookData and save (test)
  fetchBookData().then(() => saveBookData());
  document.getElementById("save-btn").addEventListener("click", () => {
    // console.log({ CellData });
    saveBookData().then(() => {
      // console.log("saved");
    });
  });
  // Section: Column Code Generation and appending Column Elements to HTML
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
  // Section: Appending Row Elements to HTML
  for (let RowCode = 1; RowCode <= 100; RowCode++) {
    let RowTag = $(
      `<div class="row-name" id="rowId=${RowCode}">${RowCode}</div>`
    );
    $(".row-name-container").append(RowTag);
  }
  // Section: Appending Cells to HTML
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

  // Section: Font family and font size

  $(".font-family-selector").change(function () {
    UpdateCells("font-family", $(this).val(), true);
  });
  $(".font-size-selector").change(function () {
    UpdateCells("font-size", $(this).val(), true);
  });

  // Section: Making cells bold, italic, underline.
  // Code to toggle the selected class should be after
  // these functions since we are interested in checking
  // whether the property is currently selected or not

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

  // Section: Text Alignment

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

  // Section: Cell Selection
  // Selecting cells by single click (Ctrl key must be pressed for multiple cell selection)
  $(".input-cell").click(function (e) {
    if (e.ctrlKey) {
      SurroundingCellAwareness(this);
    } else {
      $(".input-cell.selected").removeClass("selected");
      $(".input-cell.left-cell-selected").removeClass("left-cell-selected");
      $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
      $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
      $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");
    }
    $(this).addClass("selected");

    // Updating the formula editor as per the selected cell
    let Address =
      $(this).attr("class").split(" ")[1].split("-")[1] +
      $(this).attr("id").split("-")[1];
    $(".formula-editor.selected-cell").html(Address);
    UpdateHeader(this);
  });

  // Selecting all cells

  $(".select-triangle").click(function () {
    $(".input-cell").each(function () {
      SurroundingCellAwareness(this);
      $(this).addClass("selected");
    });
  });

  // Making cells editable by double-click

  $(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  // Removing editing ability after blur and detecting text addition in a cell and updating cell data
  $(".input-cell").blur(function () {
    $(".input-cell.selected").attr("contenteditable", "false");
    UpdateCells("text", $(this).text(), true);
  });

  // Section: Scrolling
  // Making row and column name containers scroll with the input cell container

  $(".input-cell-container").scroll(function () {
    $(".col-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  });

  // Section: Color pickers

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

  // Section: Multiple Sheets
  $(".icon-add").click(function () {
    ClearSheet();
    $(".sheet-tab.selected").removeClass("selected");
    let SheetName = "Sheet " + (LastAddedSheet + 1);
    $(".sheet-tab-container").append(
      `<div class="sheet-tab selected">Sheet ${LastAddedSheet + 1}</div>`
    );
    SheetTabWasClicked();
    CellData[SheetName] = {};
    LastAddedSheet++;
    TotalSheets++;
    SelectedSheet = `Sheet ${LastAddedSheet}`;
    UpdateScrollers();
  });

  // Function that defines ALL the behaviour when a sheet tab is clicked / a new sheet tab is added is called
  SheetTabWasClicked();

  // Behaviour of left and right scrollers
  $(".icon-left-scroll").click(function () {
    let index = Object.keys(CellData).indexOf(SelectedSheet);
    if (index > 0) $(".sheet-tab.selected").prev().click();
  });
  $(".icon-right-scroll").click(function () {
    let index = Object.keys(CellData).indexOf(SelectedSheet);
    if (index < TotalSheets - 1) $(".sheet-tab.selected").next().click();
  });

  // Cut Copy Paste
  $(".icon-cut").click(function () {
    CutOrCopyCells = [];
    CutOrCopy = "cut";
    $(".input-cell.selected").each(function () {
      let [row, col] = GetRowCol(this);
      CutOrCopyCells.push([row, col]);
    });
  });

  $(".icon-copy").click(function () {
    CutOrCopyCells = [];
    CutOrCopy = "copy";
    $(".input-cell.selected").each(function () {
      let [row, col] = GetRowCol(this);
      CutOrCopyCells.push([row, col]);
    });
  });

  $(".icon-paste").click(function () {
    // console.log(CutOrCopy);
    // console.log(CutOrCopyCells);

    // Without pressing cut or copy, paste will not work
    if (CutOrCopy != "") {
      // Destination cell (One/Multiple Cells can be selected but paste will begin from the "first" cell selected from detination selects)
      let SelectedCell = $(".input-cell.selected")[0];
      let [row, col] = GetRowCol(SelectedCell);

      // Sorting so that the top left cell of the selected cells will be used for reference
      CutOrCopyCells.sort();
      let dx = row - CutOrCopyCells[0][0];
      let dy = col - CutOrCopyCells[0][1];

      if (CutOrCopy == "cut") {
        ClearSheet();
        for (let i of Object.keys(CutOrCopyCells)) {
          // If the source cell is not defualt properties
          if (
            CellData[SelectedSheet][CutOrCopyCells[i][0]][CutOrCopyCells[i][1]]
          ) {
            // Source cell value
            let value =
              CellData[SelectedSheet][CutOrCopyCells[i][0]][
                CutOrCopyCells[i][1]
              ];
            let newRow = CutOrCopyCells[i][0] + dx;
            let newCol = CutOrCopyCells[i][1] + dy;

            if (CellData[SelectedSheet][newRow]) {
              CellData[SelectedSheet][newRow][newCol] = value;
            } else {
              CellData[SelectedSheet][newRow] = {};
              CellData[SelectedSheet][newRow][newCol] = value;
            }
            delete CellData[SelectedSheet][CutOrCopyCells[i][0]][
              CutOrCopyCells[i][1]
            ];

            // If the row becomes empty, delete it
            if (
              Object.keys(CellData[SelectedSheet][CutOrCopyCells[i][0]])
                .length == 0
            )
              delete CellData[SelectedSheet][CutOrCopyCells[i][0]];

            // After moving the cell, update the coordinates. Helpful in further "pasting"
            CutOrCopyCells[i][0] = newRow;
            CutOrCopyCells[i][1] = newCol;
          }
        }
        LoadSheet();
        // Further "pasting" : Once the source cells are deleted, and paste is clicked multiple times, it should behave as copy
        CutOrCopy = "copy";
      } else if (CutOrCopy == "copy") {
        // Only difference from cut is not deleting from CellData
        ClearSheet();

        for (let i of Object.keys(CutOrCopyCells)) {
          if (
            CellData[SelectedSheet][CutOrCopyCells[i][0]][CutOrCopyCells[i][1]]
          ) {
            let value =
              CellData[SelectedSheet][CutOrCopyCells[i][0]][
                CutOrCopyCells[i][1]
              ];
            let newRow = CutOrCopyCells[i][0] + dx;
            let newCol = CutOrCopyCells[i][1] + dy;

            if (CellData[SelectedSheet][newRow]) {
              CellData[SelectedSheet][newRow][newCol] = value;
            } else {
              CellData[SelectedSheet][newRow] = {};
              CellData[SelectedSheet][newRow][newCol] = value;
            }
          }
        }

        LoadSheet();
      }
    }
  });
});

function GetRowCol(e) {
  let idArray = $(e).attr("id").split("-");
  let row = parseInt(idArray[1]);
  let col = parseInt(idArray[3]);
  return [row, col];
}

function SurroundingCellAwareness(cell) {
  let [row, col] = GetRowCol(cell);
  if (row > 1) {
    let UpperCellSelected = $(`#row-${row - 1}-col-${col}`).hasClass(
      "selected"
    );
    if (UpperCellSelected) {
      $(cell).addClass("top-cell-selected");
      $(`#row-${row - 1}-col-${col}`).addClass("bottom-cell-selected");
    }
  }

  if (col > 1) {
    let LeftCellSelected = $(`#row-${row}-col-${col - 1}`).hasClass("selected");
    if (LeftCellSelected) {
      $(cell).addClass("left-cell-selected");
      $(`#row-${row}-col-${col - 1}`).addClass("right-cell-selected");
    }
  }

  if (col < 100) {
    let RightCellSelected = $(`#row-${row}-col-${col + 1}`).hasClass(
      "selected"
    );

    if (RightCellSelected) {
      $(cell).addClass("right-cell-selected");
      $(`#row-${row}-col-${col + 1}`).addClass("left-cell-selected");
    }
  }

  if (row < 100) {
    let BottomCellSelected = $(`#row-${row + 1}-col-${col}`).hasClass(
      "selected"
    );
    if (BottomCellSelected) {
      $(cell).addClass("bottom-cell-selected");
      $(`#row-${row + 1}-col-${col}`).addClass("top-cell-selected");
    }
  }
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
  // console.log(CellData);
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
  $(".font-family-selector").val(CurCellData["font-family"]);
  $(".font-family-selector").css("font-family", CurCellData["font-family"]);
  $(".font-size-selector").val(CurCellData["font-size"]);
}

// Handling Multiple Sheets
// Function to erase all cells currently holding any data
function ClearSheet() {
  let CurSheetData = CellData[SelectedSheet];
  for (let i of Object.keys(CurSheetData)) {
    for (let j of Object.keys(CurSheetData[i])) {
      $(`#row-${i}-col-${j}`).text("");
      $(`#row-${i}-col-${j}`).css("font-weight", "");
      $(`#row-${i}-col-${j}`).css("font-style", "");
      $(`#row-${i}-col-${j}`).css("text-decoration", "");
      $(`#row-${i}-col-${j}`).css("text-align", "left");
      $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
      $(`#row-${i}-col-${j}`).css("color", "#000000");
      $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
      $(`#row-${i}-col-${j}`).css("font-size", "18px");
    }
  }
}

// Function to load existing cell data for a particular sheet
function LoadSheet() {
  let CurSheetData = CellData[SelectedSheet];
  for (let i of Object.keys(CurSheetData)) {
    for (let j of Object.keys(CurSheetData[i])) {
      let CurCellProps = CurSheetData[i][j];
      $(`#row-${i}-col-${j}`).text(CurCellProps["text"]);
      $(`#row-${i}-col-${j}`).css("font-weight", CurCellProps["font-weight"]);
      $(`#row-${i}-col-${j}`).css("font-style", CurCellProps["font-style"]);
      $(`#row-${i}-col-${j}`).css(
        "text-decoration",
        CurCellProps["text-decoration"]
      );
      $(`#row-${i}-col-${j}`).css("text-align", CurCellProps["text-align"]);
      $(`#row-${i}-col-${j}`).css(
        "background-color",
        CurCellProps["background-color"]
      );
      $(`#row-${i}-col-${j}`).css("color", CurCellProps["color"]);
      $(`#row-${i}-col-${j}`).css("font-family", CurCellProps["font-family"]);
      $(`#row-${i}-col-${j}`).css("font-size", CurCellProps["font-size"]);
    }
  }
}

// Function to load all sheets
function LoadExistingSheets() {
  document.getElementById("title-text").innerText = BookName;
  for (let sheetname of Object.keys(CellData)) {
    if (sheetname === SelectedSheet) {
      $(".sheet-tab-container").append(
        `<div class="sheet-tab selected">${sheetname}</div>`
      );
    } else {
      $(".sheet-tab-container").append(
        `<div class="sheet-tab">${sheetname}</div>`
      );
    }
    SheetTabWasClicked();
  }
  LoadSheet();
}

// Function invoked when any sheet tab is clicked
function SheetTabWasClicked() {
  $(".sheet-tab").click(function () {
    if (!$(this).hasClass("selected")) {
      SelectTheSheet(this);
    }
  });

  // When a sheet tab is right clicked
  $(".sheet-tab").contextmenu(function (e) {
    e.preventDefault();

    // If the user right clicks a sheet that is not selected, it should be made selected
    if (!$(this).hasClass("selected")) {
      SelectTheSheet(this);
    }

    // Serves as the value of the rename input field
    let ClickedSheetName = this.innerHTML;

    // Add the right-click menu only if it is not present on screen. length tells the number of occurences of the element in HTML
    if ($(".delete-rename-modal").length == 0) {
      $(".container").append(`<div class="delete-rename-modal">
      <div class="rename-sheet">Rename</div>
      <div class="delete-sheet">Delete</div>
  </div>`);

      //Delete option should be lightened for 1 sheet
      if (TotalSheets == 1) {
        $(".delete-sheet").css("color", "lightgray");
      }

      // Place the modal at the point of right-click
      $(".delete-rename-modal").css("left", e.pageX + "px");

      // Behavior when Rename is clicked
      $(".rename-sheet").click(function () {
        // Add the Rename Box to Container (Outermost Div)
        $(".container").append(`<div class="sheet-rename-modal">
        <h4 class="rename-modal-title">Rename Sheet To:</h4>
        <input type="text" class="new-sheet-name" placeholder="Enter Name" value="${ClickedSheetName}"/>
        <div class="action-buttons">
        <div class="submit-button">Rename</div>
        <div class="cancel-button">Cancel</div>
        </div>
        </div>`);
        // When the rename popup opens, the current sheet name should be present and selected in the input field
        $(".new-sheet-name").select();

        // When Cancel option is clicked, remove the rename-modal
        $(".cancel-button").click(function () {
          $(".sheet-rename-modal").remove();
        });

        // When Rename option is clicked
        $(".submit-button").click(function () {
          let NewSheetName = $(".new-sheet-name").val();

          $(".sheet-rename-modal").remove();

          // .html or .text can change the innerHTML
          $(".sheet-tab.selected").html(NewSheetName);

          // So as to preserve the order of the sheets, the following technique is used. It is useful in finding out which sheet
          // is the next to be selected when the current sheet is deleted.
          if (NewSheetName != SelectedSheet) {
            let TempCellData = {};
            for (let sheetKey in CellData) {
              if (sheetKey != SelectedSheet) {
                TempCellData[sheetKey] = CellData[sheetKey];
              } else {
                TempCellData[NewSheetName] = CellData[sheetKey];
              }
            }
            CellData = TempCellData;
          }

          SelectedSheet = NewSheetName;
          UpdateScrollers();
        });
      });

      // Behaviour when delete is clicked
      $(".delete-sheet").click(function () {
        if (TotalSheets > 1) {
          let index = Object.keys(CellData).indexOf(SelectedSheet);

          let CurSheetName = SelectedSheet;
          let CurSheet = $(".sheet-tab.selected");

          if (index == 0) {
            $(".sheet-tab.selected").next().click();
          } else {
            $(".sheet-tab.selected").prev().click();
          }
          CurSheet.remove();
          delete CellData[CurSheetName];
          TotalSheets--;
          UpdateScrollers();
        }
      });
    } else {
      // If it exists, then shift it to the point of click
      $(".delete-rename-modal").css("left", e.pageX + "px");
    }
  });

  $(".container").click(function () {
    $(".delete-rename-modal").remove();
  });
}

// Function to select a new sheet
function SelectTheSheet(elem) {
  $(".sheet-tab.selected").removeClass("selected");
  $(elem).addClass("selected");
  ClearSheet();
  SelectedSheet = $(elem).text();
  UpdateScrollers();
  LoadSheet();
}

function UpdateScrollers() {
  let LeftIconColor = "lightgray";
  let RightIconColor = "lightgray";
  if (TotalSheets > 1) {
    let index = Object.keys(CellData).indexOf(SelectedSheet);

    if (index == 0) RightIconColor = "#000000";
    else if (index == TotalSheets - 1) LeftIconColor = "#000000";
    else {
      LeftIconColor = "#000000";
      RightIconColor = "#000000";
    }
  }

  // Updating the left and right scroll icons
  $(".icon-left-scroll").css("color", LeftIconColor);
  $(".icon-right-scroll").css("color", RightIconColor);
}
