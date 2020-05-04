// PXPS = pixcels per second
export const MAX_VEL_PXPS = 300;
export const FRICTION_PXPS = MAX_VEL_PXPS / 0.3; // 0.3s to stop
export const MAX_ACC_PXPS = MAX_VEL_PXPS / 0.3 + FRICTION_PXPS; // 0.3s to start and ignore friction when move

export const BULLET_SPEED_PXPS = 2000;
export const BULLET_FALL_INITIAL_VEL = -0.0005;
export const BULLET_FALL_MUL = 1.1;
export const BULLET_SPEED_MUL = -0.1;

export const WEAPON_FIRE_PER_SECOND = 100;
