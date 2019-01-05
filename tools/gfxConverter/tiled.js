const assert = require('assert');
const fs = require('fs');
const path = require('path');
const parser = require('xml2json');
const Texture = require("./texture");
const { Tileset, Map } = require("./maps");

function findMainLayer(layer) {
	if (Array.isArray(layer)) {
		const result = layer.find(l => l.name === 'MainTileLayer');
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
	const json = JSON.parse(parser.toJson(fs.readFileSync(tmxFileName))).map;

	const mapWidth = json.width;
	const mapHeight = json.height;
	const tilesetName = json.tileset.name;
	const tileWidth = json.tileset.tilewidth;
	const tileHeight = json.tileset.tileheight;
	const layer = findMainLayer(json.layer);
	const imagePath = path.join(path.dirname(fileNameBase), json.tileset.image.source);
	const tileset = Tileset.fromImage(tilesetName, Texture.fromPng32(imagePath), tileWidth, tileHeight, palette);
	const map = Map.blank(name, json.width, json.height, tileset);

	assert(layer.data.encoding === 'csv', `Only CSV encoding is supported (map ${name})`);
	const layerData = layer.data['$t'].split(',');
	let i = 0;
	assert(layerData.length, `Length ${layerData.length} is not equal to map size ${mapWidth}*${mapHeight} (${name})`);

	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {
			const tileNo = layerData[i++] - 1;
			const paletteFlags = tileset.tiles[tileNo].paletteIndex << 12;
			map.setTile(x, y, tileNo | paletteFlags);
		}
	}

	return map;
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
