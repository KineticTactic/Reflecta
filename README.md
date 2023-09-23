# Light Playground

[Check it out here!](https://kinetictactic.github.io/light-playground)

![light-playground](assets/screenshot.png)

A simple and robust sandbox-type program written in JavaScript to simulate light rays reflecting and refracting (in 2D). You can play around with various types of light sources (Point lights, Light Beams) and various objects (Refractive/Reflective surfaces, Lenses, Prisms, Mirrors, etc.).

## Features

-   Various light Sources such as Point Lights, Light Rays, Light Beams and Lasers

-   Various objects like Prisms, Lenses, Mirrors, etc. and update their properties in real-time.

-   Uses WebGL2 for rendering.

## Screenshots

![light-playground](assets/gif.gif)

<!-- ![light-playground](assets/dispersion.png) -->

![light-playground](assets/screenshot2.png)

## Running locally / Contributing

To get the project up and running locally,

Clone the git repository

`git clone https://github.com/kinetictactic/light-playground.git`

`cd light-playground`

Install dependencies with pnpm (or npm / yarn)

`pnpm install`

Start the vite development server

`pnpm run dev`

## Things to add

-   [x] UI for adding new objects and editing object parameters
-   [ ] More objects
-   [ ] Ray diagram markings? Principal axis and stuff
-   [x] Dispersion of rays
-   [x] Switch to WebGL

## Why did i make this?

Its a learning experience for me.

I was really fascinated when I got to learn about Optics in Physics in high school, and I always wanted to make a "sandbox" type of thing where I could play around with lenses and prisms and stuff. That, along with my hunt for simple creative coding projects to work on, led me to build this project.

Other than that, I also like the idea of this being used for educational purposes, like in a classroom, for demonstrating the various light phenomena and image formations, interactively.

## External Dependencies

-   [twgl.js](https://twgljs.org/), a WebGL helper library.

-   [Tweakpane](https://cocopon.github.io/tweakpane/), a data-driven UI library.

-   [Tweakpane Essentials](https://github.com/tweakpane/plugin-essentials), plugin for graphs in Tweakpane.
