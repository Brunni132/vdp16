const fs = require('fs');
let code = fs.readFileSync('gfx/packer-main.js', 'utf-8');

const args = process.argv.slice(2);
let convertOnly = false;
args.forEach((v) => {
	if (/help/.test(v)) {
		console.log(`Usage: packer [--convert-only]`);
		process.exit();
	}
	if (/convert-only/.test(v)) convertOnly = true;
});

code = code.replace(/import.*?;/g, '');
code = `(function({conv,currentPalette,currentPaletteMultiple,currentTileset,paletteNamed,spriteNamed,tilesetNamed,mapNamed,addColors,blank,config,image,map,multiPalette,palette,sprite,tileset,tiledMap}){${code}})`;
eval(code)(require('./dsl'));

if (!convertOnly) {
	const express = require('express');
	const app = express();
	const port = 8080;
	app.use(express.static('./'));
	app.listen(port, () => console.log(`Open your browser to: http://localhost:${port}/`));
}
