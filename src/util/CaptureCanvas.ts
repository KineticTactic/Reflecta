import World from "../core/World";

export class CaptureCanvas {
    static captureFlag: boolean = false;

    static capture(world: World) {
        const image = world.renderer.canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, "data:application/octet-stream");
        const link = document.createElement("a");
        link.href = image;
        link.download = "reflecta_screenshot.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        CaptureCanvas.captureFlag = false;
    }
}
