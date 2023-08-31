const fs = require("fs");
const readline = require("readline");

async function processLineByLine() {
  const fileStream = fs.createReadStream("Cigarette-Card-Cords.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let output = [];
  let lua = "local cardCoords = {";

  for await (const line of rl) {
    let name = line.match(/^[A-z].+- /gs);
    let card_number = line.match(/Card(s?) #.+:/gs);
    let coords = line.match(/: (-?)[0-9].+/gs);

    if (coords) {
      let coord_break = coords[0]
        .replaceAll(":", "")
        .replaceAll(" ", "")
        .split(",");

      output.push({
        name: name[0].replaceAll(" - ", ""),
        number: card_number[0].replaceAll(" :", ""),
        raw_number: Number(
          card_number[0]
            .replaceAll(" :", "")
            .replaceAll("Card #", "")
            .replaceAll("Cards #", "")
        ),
        coords: {
          x: coord_break[0],
          y: coord_break[1],
          z: coord_break[2],
          h: coord_break[3],
        },
      });

      lua += `{
            name = "${name[0].replaceAll(" - ", "")}",
            number = "${card_number[0].replaceAll(" :", "")}",
            raw_number = ${Number(
              card_number[0]
                .replaceAll(" :", "")
                .replaceAll("Card #", "")
                .replaceAll("Cards #", "")
            )},
            coords = {
              ["x"] = ${coord_break[0]},
              ["y"] = ${coord_break[1]},
              ["z"] = ${coord_break[2]},
              ["h"] = ${coord_break[3]}
            }
        },
        `;
    } else {
      output.push({
        name: name[0].replaceAll(" - ", ""),
        number: card_number[0].replaceAll(" :", ""),
        raw_number: Number(
          card_number[0]
            .replaceAll(" :", "")
            .replaceAll("Card #", "")
            .replaceAll("Cards #", "")
        ),
        coords: {
          x: null,
          y: null,
          z: null,
          h: null,
        },
        second_coords: {
          x: null,
          y: null,
          z: null,
          h: null,
        },
      });

      lua += `{
            name = "${name[0].replaceAll(" - ", "")}",
            number = "${card_number[0].replaceAll(" :", "")}",
            raw_number = ${Number(
              card_number[0]
                .replaceAll(" :", "")
                .replaceAll("Card #", "")
                .replaceAll("Cards #", "")
            )},
            coords = {
              ["x"] = nil,
              ["y"] = nil,
              ["z"] = nil,
              ["h"] = nil
            }
        },
        `;
    }
  }
  lua += "}";
  fs.writeFile("Cigarette-Card-Cords.lua", lua, function (err) {
    if (err) {
      console.log(err);
    }
  });
  fs.writeFile(
    "Cigarette-Card-Cords.json",
    JSON.stringify(output),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
}

processLineByLine();
