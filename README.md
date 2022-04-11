# VDP-16
This repository contains the core library only.

**Recommended for beginners** To start a project with the editor and everything: https://github.com/Brunni132/vdp16-starter

To see what this can do: https://brunni132.github.io/vdp16-samples/

Important: if you use the samples above, you need to copy the files [here](https://github.com/Brunni132/vdp16-samples/tree/gh-pages/build) into your `dist` directory. It contains the sprites, palettes and maps that are referenced by the samples.

Game made using this technology: https://github.com/Brunni132/patrickball

# About the doc
The library should be accompanied with a file vdp-lib.d.ts side-by-side with the library.

This file can be generated automatically by running `npm run regenerate-lib-dts`. But it would be
better that you keep the file in sync yourself, by keeping the methods and properties in sync.

If you need to regenerate the file, be sure to remove the private properties afterwards, to not clog
the editor for people using the lib (typically, strip everything that starts with an underscore).

# Software renderer bugs
* Doesn't seem to always fill the background color (cf. VDP logo)
* Doesn't posterize colors properly (cf. fade sample), maybe the same with per-line color swap

