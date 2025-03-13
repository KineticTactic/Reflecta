import App from "./App";
import "./styles/global.css";
import "./styles/tweakpane.css";
import "./styles/leftbar.css";
import "./styles/bottomright.css";
import "./styles/modal.css";
import "./styles/demos.css";
import "./style.css";

const app = new App();

app.addEntities();

function draw() {
    requestAnimationFrame(draw);

    app.update();
    app.render();
}

requestAnimationFrame(draw);
