import * as migration_20241129_151257_initial from './20241129_151257_initial';

export const migrations = [
  {
    up: migration_20241129_151257_initial.up,
    down: migration_20241129_151257_initial.down,
    name: '20241129_151257_initial'
  },
];
