import App from "./App";
import "./style.css";

const app = new App();

app.addEntities();

function draw() {
    requestAnimationFrame(draw);

    app.update();
    app.render();
}

requestAnimationFrame(draw);
