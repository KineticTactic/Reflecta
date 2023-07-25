export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static zero = () => new Vector(0, 0);
    static up = () => new Vector(0, -1);
    static down = () => new Vector(0, 1);
    static left = () => new Vector(-1, 0);
    static right = () => new Vector(1, 0);

    add(a: Vector): Vector;
    add(a: number): Vector;
    add(a: number, b: number): Vector;
    add(a: number | Vector, b?: number): Vector {
        if (a instanceof Vector) {
            this.x += a.x;
            this.y += a.y;
        } else if (b) {
            this.x += a;
            this.y += b;
        } else {
            this.x += a;
            this.y += a;
        }
        return this;
    }

    static add(a: Vector, b: Vector) {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    mult(a: Vector): Vector;
    mult(a: number): Vector;
    mult(a: number, b: number): Vector;
    mult(a: number | Vector, b?: number): Vector {
        if (a instanceof Vector) {
            this.x *= a.x;
            this.y *= a.y;
        } else if (b) {
            this.x *= a;
            this.y *= b;
        } else {
            this.x *= a;
            this.y *= a;
        }
        return this;
    }

    static mult(a: Vector, b: number): Vector;
    static mult(a: Vector, b: Vector | number): Vector {
        if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
        else return new Vector(a.x * b, a.y * b);
    }

    sub(a: Vector): Vector;
    sub(a: number): Vector;
    sub(a: number, b: number): Vector;
    sub(a: number | Vector, b?: number): Vector {
        if (a instanceof Vector) {
            this.x -= a.x;
            this.y -= a.y;
        } else if (b) {
            this.x -= a;
            this.y -= b;
        } else {
            this.x -= a;
            this.y -= a;
        }
        return this;
    }

    static sub(a: Vector, b: Vector) {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    div(a: Vector): Vector;
    div(a: number): Vector;
    div(a: number, b: number): Vector;
    div(a: number | Vector, b?: number): Vector {
        if (a instanceof Vector) {
            this.x /= a.x;
            this.y /= a.y;
        } else if (b) {
            this.x /= a;
            this.y /= b;
        } else {
            this.x /= a;
            this.y /= a;
        }
        return this;
    }

    static div(a: Vector, b: Vector) {
        return new Vector(a.x / b.x, a.y / b.y);
    }

    set(x: Vector): Vector;
    set(x: number, y: number): Vector;
    set(x: number | Vector, y?: number): Vector {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        } else if (y) {
            this.x = x;
            this.y = y;
        } else {
            this.x = x;
            this.y = x;
        }
        return this;
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static mag(v: Vector): number {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    magSq(): number {
        return this.x * this.x + this.y * this.y;
    }

    static magSq(v: Vector): number {
        return v.x * v.x + v.y * v.y;
    }

    setMag(a: number): Vector {
        let m = this.mag();
        this.x *= a / m;
        this.y *= a / m;
        return this;
    }

    normalize(): Vector {
        this.setMag(1);
        return this;
    }

    limit(a: number): Vector {
        if (this.mag() > a) this.setMag(a);
        return this;
    }

    heading(): number {
        return Math.atan2(this.y, this.x);
    }

    rotate(a: number): Vector {
        let cos = Math.cos(a),
            sin = Math.sin(a),
            nx = cos * this.x - sin * this.y,
            ny = cos * this.y + sin * this.x;
        this.x = nx;
        this.y = ny;
        return this;
    }

    rotateAboutAxis(theta: number, axis: Vector) {
        this.sub(axis).rotate(theta).add(axis);
        return this;
    }

    dot(a: Vector): number {
        return a.x * this.x + a.y * this.y;
    }

    static dot(a: Vector, b: Vector): number {
        return a.x * b.x + a.y * b.y;
    }

    cross(a: Vector): number {
        return this.x * a.y - this.y * a.x;
    }

    static cross(a: Vector, b: Vector): number {
        return a.x * b.y - a.y * b.x;
    }

    dist(a: Vector): number {
        return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2));
    }

    static dist(a: Vector, b: Vector): number {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }

    lerp(a: Vector, amt: number): Vector {
        let diffX = a.x - this.x;
        let diffY = a.y - this.y;
        this.x += amt * diffX;
        this.y += amt * diffY;
        return this;
    }

    // angleBetween(a: Vector): number {
    //     return Math.atan2(a.y, a.x) - Math.atan2(this.y, this.x);
    // }

    static angleBetween(a: Vector, b: Vector): number {
        // return Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
        return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }
}
