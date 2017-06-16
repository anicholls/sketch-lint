const fs = require('fs');
const JSZip = require('jszip');

fs.readFile('sketch-file.sketch', (err, data) => {
  if (err) throw err;
  JSZip.loadAsync(data).then((zip) => {

    // read the top level page
    // hardcoding page because im lazy ;)
    const pagePath = Object.keys(zip.files)[1];

    zip.file(pagePath)
      .async('string')
      .then(function(str) {
        const json = JSON.parse(str);
        const jsonStr = JSON.stringify(json, null, 2);

        let artboards = json.layers;

        for (var artboard of artboards) {

          console.log(artboard.name);
          let layers = artboard.layers;

          for (var layer of layers) {
            console.log(layer.name);
          }
        }

        fs.writeFile("sketch.json", jsonStr, (err) => {
          if (err) {
            return console.log(err);
          }

          console.log("The file was saved!");
        });
      });
  });
});
