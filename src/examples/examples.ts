import { Vector } from "polyly";
import Settings from "../core/Settings";
import World from "../core/World";
import ConcaveLens from "../entities/ConcaveLens";
import ConvexLens from "../entities/ConvexLens";
import GlassSlab from "../entities/GlassSlab";
import Laser from "../entities/Laser";
import LightBeam from "../entities/LightBeam";
import PlaneMirror from "../entities/PlaneMirror";
import Prism from "../entities/Prism";
import GlassSphere from "../entities/GlassSphere";
import PointLight from "../entities/PointLight";
import SphericalMirror from "../entities/SphericalMirror";
import TextEntity from "../entities/TextEntity";

interface Example {
    name: string;
    img: string;
    desc: string;
    init: (world: World) => void;
}

const examples: Example[] = [
    {
        name: "Thick Plane Mirror",
        desc: "Second image from a thick plane mirror is the brightest.",
        img: "thickmirror.png",
        init: (world: World) => {
            world.addEntity(new Laser({ pos: new Vector(-300, -150), rot: 0.8, intensity: 500 }));
            world.addEntity(new GlassSlab({ size: new Vector(500, 150) }));
            world.addEntity(new PlaneMirror({ pos: new Vector(0, 74.5), size: 500 }));
            world.addEntity(
                new TextEntity({
                    pos: new Vector(-280, 140),
                    text: "The second reflection from a thick plane mirror is the brightest.",
                    size: 20,
                })
            );
            Settings.calculateReflectance = true;
            Settings.reflectanceFactor = 2;
        },
    },

    {
        name: "Lenses",
        desc: "A concave and convex lens with a light source.",
        img: "lenses.png",
        init: (world: World) => {
            world.addEntity(new LightBeam({ pos: new Vector(-150, 0) }));
            world.addEntity(new ConcaveLens({ radiusOfCurvature: 250, span: 0.5 }));
            world.addEntity(new ConvexLens({ pos: new Vector(150, 0), radiusOfCurvature: 250, span: 0.5 }));
        },
    },

    {
        name: "Prism Dispersion",
        desc: "Dispersion of white light through a prism.",
        img: "prismdispersion.png",
        init: (world: World) => {
            Settings.calculateReflectance = true;
            world.addEntity(new Prism({ size: 200 }));
            world.addEntity(new Laser({ pos: new Vector(-300, 50), rot: -0.35, polychromatic: true }));
        },
    },

    {
        name: "Rainbow formation",
        desc: "Formation of rainbow through raindrops.",
        img: "raindropdispersion.png",
        init: (world: World) => {
            world.addEntity(new GlassSphere({ radius: 100, refractiveIndex: 1.333 }));
            world.addEntity(new Laser({ pos: new Vector(-150, -75), polychromatic: true, intensity: 500, rot: -0.123 }));
            Settings.calculateReflectance = true;
            Settings.reflectanceFactor = 2;
        },
    },

    {
        name: "Chromatic Aberration",
        desc: "Showcasing chromatic aberration due to thick lenses.",
        img: "chromaticaberration.png",
        init: (world: World) => {
            world.addEntity(new ConvexLens({ radiusOfCurvature: 400, refractiveIndex: 1.5 }));
            world.addEntity(new Laser({ pos: new Vector(-300, -150), polychromatic: true, intensity: 500 }));
            world.addEntity(new Laser({ pos: new Vector(-300, 150), polychromatic: true, intensity: 500 }));
            Settings.calculateReflectance = true;
        },
    },

    {
        name: "Spherical Mirrors",
        desc: "Spherical mirrors demo",
        img: "sphericalmirrors.png",
        init: (world: World) => {
            world.addEntity(new PointLight({ pos: new Vector(-75, 0), numRays: 1000, monochromatic: true, wavelength: 550 }));
            world.addEntity(new SphericalMirror({ pos: new Vector(0, 0), radiusOfCurvature: 250 }));
            world.addEntity(new SphericalMirror({ pos: new Vector(-200, -200), rot: 3.5, radiusOfCurvature: 150 }));
            world.addEntity(new SphericalMirror({ pos: new Vector(-200, 200), rot: -3.5, radiusOfCurvature: 150 }));
        },
    },

    {
        name: "Bunch of Lasers",
        desc: "A bunch of lasers.",
        img: "bunchoflasers.png",
        init: (world: World) => {
            Settings.calculateReflectance = true;
            world.addEntity(new ConvexLens({ radiusOfCurvature: 200 }));
            for (let i = 0; i < 8; i++) {
                world.addEntity(new Laser({ pos: new Vector(-300, i * 20 - 75), polychromatic: true }));
            }
        },
    },

    {
        name: "Showcase #1",
        desc: "Showcase number 1",
        img: "showcase1.png",
        init: (world: World) => {
            Settings.calculateReflectance = true;
            world.addEntity(new PointLight({ monochromatic: true, wavelength: 440, intensity: 1000 }));
            world.addEntity(new GlassSphere({ pos: new Vector(75, 75) }));
            world.addEntity(new GlassSphere({ pos: new Vector(-75, 75) }));
            world.addEntity(new GlassSphere({ pos: new Vector(-75, -75) }));
            world.addEntity(new GlassSphere({ pos: new Vector(75, -75) }));
        },
    },

    {
        name: "Showcase #2",
        desc: "Showcase number 2",
        img: "showcase2.png",
        init: (world: World) => {
            Settings.calculateReflectance = true;
            Settings.glassOpacity = 0;
            world.addEntity(new PointLight({ pos: new Vector(250, 23), numRays: 500, monochromatic: true, wavelength: 600 }));
            world.addEntity(new GlassSphere({ pos: new Vector(250, 0), radius: 50, refractiveIndex: 2 }));
            world.addEntity(new PointLight({ pos: new Vector(0, 23), numRays: 500, monochromatic: true, wavelength: 530, intensity: 200 }));
            world.addEntity(new GlassSphere({ pos: new Vector(0, 0), radius: 50, refractiveIndex: 2 }));
            world.addEntity(
                new PointLight({ pos: new Vector(-250, 23), numRays: 500, monochromatic: true, wavelength: 450, intensity: 500 })
            );
            world.addEntity(new GlassSphere({ pos: new Vector(-250, 0), radius: 50, refractiveIndex: 2 }));
        },
    },
];

export default examples;
