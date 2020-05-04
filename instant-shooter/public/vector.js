export class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy() {
        return new Vector(this.x, this.y, this.z);
    }
    heading() {
        return Math.atan2(this.y, this.x);
    }
    rotate(a) {
        const newHeading = this.heading() + a;
        const mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }
    normalize() {
        const len = this.mag();
        if (len !== 0) {
            this.multScalar(1 / len);
        }
        return this;
    }
    limit(max) {
        const mSq = this.magSq();
        if (mSq > max * max) {
            this.divScalar(Math.sqrt(mSq)).multScalar(max);
        }
        return this;
    }
    cross(v) {
        const x = this.y * v.z - this.z * v.y;
        const y = this.z * v.x - this.x * v.z;
        const z = this.x * v.y - this.y * v.x;
        return new Vector(x, y, z);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    angleBetween(v) {
        const dotmagmag = this.dot(v) / (this.mag() * v.mag());
        let angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
        angle *= Math.sign(this.cross(v).z || 1);
        return angle;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    divScalar(d) {
        this.x /= d;
        this.y /= d;
        this.z /= d;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    multScalar(m) {
        this.x *= m;
        this.y *= m;
        this.z *= m;
        return this;
    }
    setMag(n) {
        return this.normalize().multScalar(n);
    }
    mag() {
        return Math.sqrt(this.magSq());
    }
    magSq() {
        const { x, y, z } = this;
        return x * x + y * y + z * z;
    }
}
export function createVector(x = 0, y = 0, z = 0) {
    return new Vector(x, y, z);
}
