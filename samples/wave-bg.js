const mat3 = glMatrix.mat3;

function *main() {
	let loop = 0;
	while (true) {
		const transformationArray = new vdp.LineTransformationArray();
		const transformationMatrix = mat3.create();

		for (let line = 0; line < vdp.screenHeight; line++) {
			const horizOffset = Math.sin((line + loop) / 20);
			mat3.fromTranslation(transformationMatrix, [horizOffset * 10, line]);
			transformationArray.setLine(line, transformationMatrix);
		}

		vdp.drawBackgroundTilemap('level2', { scrollX: 700, lineTransform: transformationArray });
		loop += 1;
		yield;
	}
}
