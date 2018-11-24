
export function drawSprite(vdp, xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd, palNo) {
	const gl = vdp.gl;
	const positions = [
		xStart, yStart, 0, palNo,
		xEnd, yStart, 0, palNo,
		xStart, yEnd, 0, palNo,
		xEnd, yEnd, 0, palNo,
	];

	const textureCoordinates = [
		uStart, vStart,
		uEnd, vStart,
		uStart, vEnd,
		uEnd, vEnd,
	];

	// TODO Florian -- batching, reuse the array instead of creating a new one
	// TODO Florian -- try STREAM_DRAW
	gl.bindBuffer(gl.ARRAY_BUFFER, vdp.spriteProgram.xyzpBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, vdp.spriteProgram.uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

	gl.useProgram(vdp.spriteProgram.program);
	{
		const numComponents = 4;  // pull out 4 values per iteration
		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
		const normalize = false;  // don't normalize
		const stride = 0;         // how many bytes to get from one set of values to the next
															// 0 = use type and numComponents above
		const offset = 0;         // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, vdp.spriteProgram.xyzpBuffer);
		gl.vertexAttribPointer(vdp.spriteProgram.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(vdp.spriteProgram.attribLocations.vertexPosition);
	}
	{
		const num = 2; // every coordinate composed of 2 values
		const type = gl.FLOAT; // the data in the buffer is 32 bit float
		const normalize = false; // don't normalize
		const stride = 0; // how many bytes to get from one set to the next
		const offset = 0; // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, vdp.spriteProgram.uvBuffer);
		gl.vertexAttribPointer(vdp.spriteProgram.attribLocations.textureCoord, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(vdp.spriteProgram.attribLocations.textureCoord);
	}

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, vdp.spriteTexture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, vdp.paletteTexture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(vdp.spriteProgram.uniformLocations.uSamplerSprites, 0);
	gl.uniform1i(vdp.spriteProgram.uniformLocations.uSamplerPalettes, 1);

	// Set the shader uniforms
	gl.uniformMatrix4fv(vdp.spriteProgram.uniformLocations.projectionMatrix, false, vdp.projectionMatrix);
	gl.uniformMatrix4fv(vdp.spriteProgram.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}
