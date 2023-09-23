# Light Playground

[Check it out here!](https://kinetictactic.github.io/light-playground)

![light-playground](assets/screenshot.png)

A simple and robust sandbox-type program written in JavaScript to simulate light rays reflecting and refracting (in 2D). You can play around with various types of light sources (Point lights, Light Beams) and various objects (Refractive/Reflective surfaces, Lenses, Prisms, Mirrors, etc.).

## Features

**Light Sources**

-   Point light
-   Light Beam
-   Light Ray

**Objects**

-   Prism
-   Lenses (Convex/Concave)
-   Mirrors (Plane/Spherical)
-   Any custom shapes with reflective/refractive/rough surfaces

## To-Do

-   [x] UI for adding new objects and editing object parameters
-   [ ] More objects
-   [ ] Ray diagram markings? Principal axis and stuff
-   [x] Dispersion of rays??
-   [x] Switch to WebGL / WebGPU (i probably won't)

## Screenshots

![light-playground](assets/gif.gif)
![light-playground](assets/dispersion.png)
![light-playground](assets/screenshot2.png)

## Why did i make this?

Its a learning experience for me.

I was really fascinated when I got to learn about Optics in Physics in high school, and I always wanted to make a "sandbox" type of thing where I could play around with lenses and prisms and stuff. That, along with my hunt for simple creative coding projects to work on, led me to build this project.

Other than that, I also like the idea of this being used for educational purposes, like in a classroom, for demonstrating the various light phenomena and image formations, interactively.

### ...this is the 3rd complete rewrite of this project.

The first time I started building this, I scrapped together some code to make a barely-working demo. However I soon realized the codebase was getting way too messy, so I had to scrap it completely and start from scratch. The second time was better, but still nowhere near the quality of code I would have liked it to be. It was a mess, the curved surface collision didnt work half the time, and it was hard to implement new objects.

After taking a break and returning to the project, I realized I didn't understand half of the code I had written. _sigh._

So this is the third time I'm rewriting this :D But I really like codebase this time, and the way I've designed it using Classes and Inheritance. I've also used TypeScript for better type checking.

## External Dependencies

-   Tweakpane [https://cocopon.github.io/tweakpane/](https://cocopon.github.io/tweakpane/)

-   Tweakpane Essentials [https://github.com/tweakpane/plugin-essentials](https://github.com/tweakpane/plugin-essentials)
