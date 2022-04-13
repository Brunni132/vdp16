# VDP-16
This repository contains the core library only.

**Recommended for beginners** To start a project with the editor and everything: https://github.com/Brunni132/vdp16-starter

To see what this can do: https://brunni132.github.io/vdp16-samples/

Important: if you use the samples above, you need to copy the files [here](https://github.com/Brunni132/vdp16-samples/tree/gh-pages/build) into your `dist` directory. It contains the sprites, palettes and maps that are referenced by the samples.

Game made using this technology: https://github.com/Brunni132/patrickball

# Building
* Clone the repository, `npm install`
* Running the test game:
    * `npm run dev`
    * Open http://localhost:8080 in your browser
    * Edit the file `src/game-main.js`
* Building the library
    * `npm run build-lib`
    * Copy the files from `lib/` into the `lib` folder of your game (example: `vdp16-starter/lib`).


# Branches
There are two branches. The main one (`master`) runs on the GPU, and the `software-renderer` branch runs on the CPU. For compatibility reasons, I generally use the `software-renderer` one when making demos and workshops, so that I am sure that it will run for everyone, no matter their GPU, VM, etc. Note that iOS still used lossy textures when I tested (around 2019) so it's not really supported, which is a good reason for using the `software-renderer` one. I would appreciate anyone who could help me debug why that happens.

## Software renderer bugs
* Doesn't seem to always fill the background color (cf. VDP logo)
* Doesn't posterize colors properly (cf. fade sample), maybe the same with per-line color swap
* Nevertheless, this branch should become the main one because this project uses little power and runs well on the CPU. Any help in fixing those would be greatly appreciated!

# About the doc
The library should be accompanied with a file vdp-lib.d.ts side-by-side with the library.

This file can be generated automatically by running `npm run regenerate-lib-dts`. But it would be
better that you keep the file in sync yourself, by keeping the methods and properties in sync.

If you need to regenerate the file, be sure to remove the private properties afterwards, to not clog
the editor for people using the lib (typically, strip everything that starts with an underscore).
