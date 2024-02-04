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

interface Example {
    name: string;
    img: string;
    desc: string;
    init: (world: World) => void;
}

const examples: Example[] = [
    {
        name: "Thick Plane Mirror",
        desc: "A thick plane mirror with a light source.",
        img: "thickmirror.png",
        init: (world: World) => {
            world.addEntity(new Laser({ pos: new Vector(-600, -300), rot: 0.8, intensity: 500 }));
            world.addEntity(new GlassSlab({ size: new Vector(1000, 300) }));
            world.addEntity(new PlaneMirror({ pos: new Vector(0, 149), size: 1000 }));
            Settings.calculateReflectance = true;
            Settings.reflectanceFactor = 2;
        },
    },

    {
        name: "Lenses",
        desc: "A concave and convex lens with a light source.",
        img: "lenses.png",
        init: (world: World) => {
            world.addEntity(new LightBeam({ pos: new Vector(-300, 0) }));
            world.addEntity(new ConcaveLens({ radiusOfCurvature: 500, span: 0.5 }));
            world.addEntity(new ConvexLens({ pos: new Vector(300, 0), radiusOfCurvature: 500, span: 0.5 }));
        },
    },

    {
        name: "Prism Dispersion",
        desc: "A prism with a light source.",
        img: "prismdispersion.png",
        init: (world: World) => {
            Settings.calculateReflectance = true;
            world.addEntity(new Prism({ size: 400 }));
            world.addEntity(new Laser({ pos: new Vector(-600, 100), rot: -0.35, polychromatic: true }));
        },
    },

    {
        name: "Rainbow formation",
        desc: "Formation of rainbow",
        img: "raindropdispersion.png",
        init: (world: World) => {
            world.addEntity(new GlassSphere({ radius: 200, refractiveIndex: 1.333 }));
            world.addEntity(new Laser({ pos: new Vector(-300, -190), polychromatic: true, intensity: 500 }));
            Settings.calculateReflectance = true;
        },
    },

    {
        name: "Spherical Mirrors",
        desc: "Spherical mirrors demo",
        img: "sphericalmirrors.png",
        init: (world: World) => {
            world.addEntity(new PointLight({ pos: new Vector(-150, 0), numRays: 1000, monochromatic: true, wavelength: 550 }));
            world.addEntity(new SphericalMirror({ pos: new Vector(0, 0), radiusOfCurvature: 500 }));
            world.addEntity(new SphericalMirror({ pos: new Vector(-400, -400), rot: 3.5, radiusOfCurvature: 300 }));
            world.addEntity(new SphericalMirror({ pos: new Vector(-400, 400), rot: -3.5, radiusOfCurvature: 300 }));
        },
    },

    {
        name: "Bunch of Lasers",
        desc: "Bunch of lasers",
        img: "bunchoflasers.png",
        init: (world: World) => {
            Settings.calculateReflectance = true;
            world.addEntity(new ConvexLens({ radiusOfCurvature: 400 }));
            for (let i = 0; i < 8; i++) {
                world.addEntity(new Laser({ pos: new Vector(-600, i * 40 - 150), polychromatic: true }));
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
            world.addEntity(new GlassSphere({ pos: new Vector(150, 150) }));
            world.addEntity(new GlassSphere({ pos: new Vector(-150, 150) }));
            world.addEntity(new GlassSphere({ pos: new Vector(-150, -150) }));
            world.addEntity(new GlassSphere({ pos: new Vector(150, -150) }));
        },
    },

    {
        name: "Showcase #2",
        desc: "Showcase number 2",
        img: "showcase2.png",
        init: (world: World) => {
            Settings.calculateReflectance = true;
            Settings.glassOpacity = 0;
            world.addEntity(new PointLight({ pos: new Vector(500, 47), numRays: 500, monochromatic: true, wavelength: 600 }));
            world.addEntity(new GlassSphere({ pos: new Vector(500, 0), radius: 100, refractiveIndex: 2 }));
            world.addEntity(new PointLight({ pos: new Vector(0, 46), numRays: 500, monochromatic: true, wavelength: 530, intensity: 200 }));
            world.addEntity(new GlassSphere({ pos: new Vector(0, 0), radius: 100, refractiveIndex: 2 }));
            world.addEntity(new PointLight({ pos: new Vector(-500, 46), numRays: 500, monochromatic: true, wavelength: 450, intensity: 500 }));
            world.addEntity(new GlassSphere({ pos: new Vector(-500, 0), radius: 100, refractiveIndex: 2 }));
        },
    },
];

export default examples;
