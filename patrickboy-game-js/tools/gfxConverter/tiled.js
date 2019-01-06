const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Texture = require("./texture");
const { Tileset, Map } = require("./maps");
const xml2js = require('xml2js');

function findMainLayer(layer) {
	if (Array.isArray(layer)) {
		const result = layer.find(l => l['$'].name === 'MainTileLayer');
		assert(result, `No layer named MainTileLayer in ${JSON.stringify(layer)}`);
		return result;
	}
	return layer;
}

/**
 *
 * @param fileNameBase {string}
 * @param name {string} name of the tileset/map
 * @param palette {Palette} destination palette (can have multiple rows)
 * @returns {Map}
 */
function readTmx(fileNameBase, name, palette) {
	const tmxFileName = `${fileNameBase}.tmx`;
	let resultMap = null;

	new xml2js.Parser().parseString(fs.readFileSync(tmxFileName), (err, result) => {
		const json = result.map;
		//console.dir(json.tileset[0]);
		const mapWidth = parseInt(json['$'].width);
		const mapHeight = parseInt(json['$'].height);
		const tilesetName = json.tileset[0]['$'].name;
		const tileWidth = parseInt(json.tileset[0]['$'].tilewidth);
		const tileHeight = parseInt(json.tileset[0]['$'].tileheight);
		const jsonImage = json.tileset[0].image[0]['$'];
		const layer = findMainLayer(json.layer);
		const imagePath = path.join(path.dirname(fileNameBase), jsonImage.source);
		const tileset = Tileset.fromImage(tilesetName, Texture.fromPng32(imagePath), tileWidth, tileHeight, palette);
		resultMap = Map.blank(name, mapWidth, mapHeight, tileset);

		assert(layer.data[0]['$'].encoding === 'csv', `Only CSV encoding is supported (map ${name})`);
		const layerData = layer.data[0]['_'].split(',');
		let i = 0;
		for (let y = 0; y < mapHeight; y++) {
			for (let x = 0; x < mapWidth; x++) {
				const tileNo = layerData[i++] - 1;
				const paletteFlags = tileset.tiles[tileNo].paletteIndex << 12;
				resultMap.setTile(x, y, tileNo | paletteFlags);
			}
		}
	});
	return resultMap;
}

/**
 * @param fileNameBase {string}
 * @param map {Map}
 */
function writeTmx(fileNameBase, map) {
	/** @type {Tileset} */
	const tileset = map.tileset;
	assert(map.tileset.palette.numRows === 1, 'Only single-palette maps supported for now');
	/** @type {Palette} */
	const palette = map.tileset.palette;
	const tilesetFileName = `${fileNameBase}-til.png`;
	const tmxFileName = `${fileNameBase}.tmx`;

	// Make an image for the tileset
	const destImageIndexed = Texture.blank(tilesetFileName, tileset.usedWidth, tileset.usedHeight, 8);
	tileset.copyToTexture(destImageIndexed, 0, 0);

	// Make a true color version and write it
	const destImageTrueColor = Texture.blank(tilesetFileName, destImageIndexed.width, destImageIndexed.height, 32);
	destImageIndexed.forEachPixel((color, x, y) => {
		destImageTrueColor.setPixel(x, y, palette.colorRows[0][color]);
	});
	destImageTrueColor.writeToPng(tilesetFileName);

	let csvEncodedMap = '';
	map.mapData.forEachPixel((cell, x, y) => {
		csvEncodedMap += `${cell+1},`;
	});
	csvEncodedMap = csvEncodedMap.substring(0, csvEncodedMap.length - 1);

	const tmxData = `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.0" orientation="orthogonal" width="${map.width}" height="${map.height}" tilewidth="${tileset.tileWidth}" tileheight="${tileset.tileHeight}">
	<tileset firstgid="1" name="${tileset.name}" tilewidth="${tileset.tileWidth}" tileheight="${tileset.tileHeight}">
		<image source="${path.basename(tilesetFileName)}" width="${destImageTrueColor.width}" height="${destImageTrueColor.height}"/>
	</tileset>
	<layer name="MainTileLayer" width="${map.width}" height="${map.height}">
		<data encoding="csv">${csvEncodedMap}</data>
	</layer>
</map>`;
	fs.writeFileSync(tmxFileName, tmxData);
}


module.exports = {
	readTmx,
	writeTmx
};
