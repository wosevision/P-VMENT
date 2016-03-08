PA̅VMENT is an longboarding app for plotting elevation and mapping sweet hills built with the [Ionic Framework](http://ionicframework.com/) and Google APIs.

## How to use this app

*This app does not work out of the box*. It is missing the platforms, plugins, dependencies, and libraries.

To use this, use every CLI known to mankind: NPM, Bower, Gulp, Cordova, and of course Ionic (to name a few).

### With the Ionic tool:

Take the name after `ionic-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install
$ sudo bower install
$ ...etc
```

Then, to run it, cd into `pavment` and run:

```bash
$ ionic platform add ios
$ ionic state reset
$ ionic emulate ios
```

Substitute ios for android if not on a Mac, but if you can, the ios development toolchain is a lot easier to work with until you need to do anything custom to Android.

## Issues
Issues have been disabled on this repo, if you do find an issue or have a question consider posting it on the [Ionic Forum](http://forum.ionicframework.com/).  Or else if there is truly an error, follow our guidelines for [submitting an issue](http://ionicframework.com/contribute/#issues) to the main Ionic repository. On the other hand, pull requests are welcome here!
