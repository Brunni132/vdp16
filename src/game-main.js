import {startGame, vdp} from "../lib-main";

startGame('#glCanvas', vdp => {
	const { input, mat3, vec2, color } = vdp;
	Object.assign(window, { input, mat3, vec2, color });
	return main();
});

function *main() {
  let loop = 0;

  while (true) {
    vdp.drawObject('level1', 0, loop);
    loop += 0.2;
    yield;
  }
}
