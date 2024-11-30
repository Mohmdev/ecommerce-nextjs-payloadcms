import * as migration_20241129_151257_initial from './20241129_151257_initial';
import * as migration_20241130_173330_commerce_0 from './20241130_173330_commerce_0';

export const migrations = [
  {
    up: migration_20241129_151257_initial.up,
    down: migration_20241129_151257_initial.down,
    name: '20241129_151257_initial',
  },
  {
    up: migration_20241130_173330_commerce_0.up,
    down: migration_20241130_173330_commerce_0.down,
    name: '20241130_173330_commerce_0'
  },
];
