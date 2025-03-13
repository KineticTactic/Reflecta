import Blocker from "./Blocker";
import ConcaveLens from "./ConcaveLens";
import ConcaveMirror from "./ConcaveMirror";
import ConvexLens from "./ConvexLens";
import ConvexMirror from "./ConvexMirror";
import GlassSlab from "./GlassSlab";
import GlassSphere from "./GlassSphere";
import IdealConcaveLens from "./IdealConcaveLens";
import IdealConvexLens from "./IdealConvexLens";
import Laser from "./Laser";
import LightBeam from "./LightBeam";
import PlaneMirror from "./PlaneMirror";
import PointLight from "./PointLight";
import Prism from "./Prism";
import Ruler from "./Ruler";
import SphericalMirror from "./SphericalMirror";
import TextEntity from "./TextEntity";

const entityList = [
    Laser.entityData,
    PointLight.entityData,
    LightBeam.entityData,
    GlassSlab.entityData,
    ConvexLens.entityData,
    ConcaveLens.entityData,
    IdealConvexLens.entityData,
    IdealConcaveLens.entityData,
    GlassSphere.entityData,
    SphericalMirror.entityData,
    ConcaveMirror.entityData,
    ConvexMirror.entityData,
    Prism.entityData,
    PlaneMirror.entityData,
    Blocker.entityData,
    TextEntity.entityData,
    Ruler.entityData,
];

export default entityList;
