# About the doc
The library should be accompanied with a file vdp-lib.d.ts side-by-side with the library.

This file can be generated automatically by running `npm run regenerate-lib-dts`. But it would be
better that you keep the file in sync yourself, by keeping the methods and properties in sync.

If you need to regenerate the file, be sure to remove the private properties afterwards, to not clog
the editor for people using the lib (typically, strip everything that starts with an underscore).


