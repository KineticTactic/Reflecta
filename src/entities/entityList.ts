import ConcaveLens from "./ConcaveLens";
import ConvexLens from "./ConvexLens";
import GlassSlab from "./GlassSlab";
import GlassSphere from "./GlassSphere";
import Laser from "./Laser";
import LightBeam from "./LightBeam";
import PlaneMirror from "./PlaneMirror";
import PointLight from "./PointLight";
import Prism from "./Prism";
import SphericalMirror from "./SphericalMirror";

const entityList = [
    ConcaveLens.entityData,
    ConvexLens.entityData,
    GlassSphere.entityData,
    GlassSlab.entityData,
    Laser.entityData,
    LightBeam.entityData,
    PlaneMirror.entityData,
    PointLight.entityData,
    Prism.entityData,
    SphericalMirror.entityData,
];

export default entityList;
