import ConcaveLens from "./ConcaveLens";
import ConvexLens from "./ConvexLens";
import GlassSphere from "./GlassSphere";
import LightBeam from "./LightBeam";
import LightRayEntity from "./LightRayEntity";
import PointLight from "./PointLight";
import Prism from "./Prism";
import SphericalMirror from "./SphericalMirror";

const entityList = [
    ConcaveLens.entityData,
    ConvexLens.entityData,
    GlassSphere.entityData,
    LightBeam.entityData,
    LightRayEntity.entityData,
    PointLight.entityData,
    Prism.entityData,
    SphericalMirror.entityData,
];

export default entityList;
