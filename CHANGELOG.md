# Changelog

## [10.5.0](https://github.com/heroku/heroku-cli-util/compare/heroku-cli-util-v10.4.0...heroku-cli-util-v10.5.0) (2026-02-12)


### Features

* **colors:** add HEROKU_THEME with heroku and simple (ANSI 8) themes ([#284](https://github.com/heroku/heroku-cli-util/issues/284)) ([373b521](https://github.com/heroku/heroku-cli-util/commit/373b52154b5d92e25dc614b08606512df034ce61))


### Bug Fixes

* **deps:** bump @oclif/core from 4.5.4 to 4.8.0 ([#250](https://github.com/heroku/heroku-cli-util/issues/250)) ([a9fc936](https://github.com/heroku/heroku-cli-util/commit/a9fc9369ffc193b2de65e9134833752455fcc92d))
* **deps:** bump @oclif/table from 0.4.14 to 0.5.1 ([#269](https://github.com/heroku/heroku-cli-util/issues/269)) ([c6039f4](https://github.com/heroku/heroku-cli-util/commit/c6039f48fcd06897e8805952c7a74477798a0748))
* **deps:** bump ansis from 4.1.0 to 4.2.0 ([#270](https://github.com/heroku/heroku-cli-util/issues/270)) ([a17b0ba](https://github.com/heroku/heroku-cli-util/commit/a17b0baaddbd2f51a5523810d93e4dafb7ddbc7e))


### Miscellaneous Chores

* update PR template ([#282](https://github.com/heroku/heroku-cli-util/issues/282)) ([31072c6](https://github.com/heroku/heroku-cli-util/commit/31072c669cce75ddb22392308f6d44f3dfd4010f))

## [10.4.0](https://github.com/heroku/heroku-cli-util/compare/heroku-cli-util-v10.3.0...heroku-cli-util-v10.4.0) (2026-01-29)


### Features

* adding utility functions from 'heroku-cli-plugin-data-beta' (W-20610130) ([#262](https://github.com/heroku/heroku-cli-util/issues/262)) ([9f5588c](https://github.com/heroku/heroku-cli-util/commit/9f5588ca11cb3713898896f0de22069fc007d918))
* shared confirmCommand refactor (W-20449538) ([#273](https://github.com/heroku/heroku-cli-util/issues/273)) ([8ea6f64](https://github.com/heroku/heroku-cli-util/commit/8ea6f6442ae0092ddfd0e1c8b74303953f906727))
* update color definitions to use ANSI256 codes and add conditional Unicode display ([#274](https://github.com/heroku/heroku-cli-util/issues/274)) ([22a49e8](https://github.com/heroku/heroku-cli-util/commit/22a49e8de2606097afe0d30445c49621e652fdfa))


### Bug Fixes

* **deps:** bump lodash from 4.17.21 to 4.17.23 ([#278](https://github.com/heroku/heroku-cli-util/issues/278)) ([c82f524](https://github.com/heroku/heroku-cli-util/commit/c82f52490ae76831dd2ce9694b083c0cef6627cd))


### Continuous Integration

* adding token for release on push PRs to trigger ci ([#266](https://github.com/heroku/heroku-cli-util/issues/266)) ([1033d2c](https://github.com/heroku/heroku-cli-util/commit/1033d2cfbd0bfc9d39dfb3b5cfb291b60a7793fc))


### Miscellaneous Chores

* onboard shared workflows ([#272](https://github.com/heroku/heroku-cli-util/issues/272)) ([c1ff948](https://github.com/heroku/heroku-cli-util/commit/c1ff9487f237cbe7ebb5f2546061ca77781fe83e))

## [10.3.0](https://github.com/heroku/heroku-cli-util/compare/heroku-cli-util-v10.2.0...heroku-cli-util-v10.3.0) (2026-01-09)


### Features

* add color system ([#253](https://github.com/heroku/heroku-cli-util/issues/253)) ([169725a](https://github.com/heroku/heroku-cli-util/commit/169725a599228370725096819df3002554783b00))
* backport changes from v9 branch to main (W-19890189) ([#240](https://github.com/heroku/heroku-cli-util/issues/240)) ([2ad585c](https://github.com/heroku/heroku-cli-util/commit/2ad585ce4ac1dfbe7265bbacda40100efec75b94))


### Bug Fixes

* remove unneeded debug statements ([#254](https://github.com/heroku/heroku-cli-util/issues/254)) ([2bb45bf](https://github.com/heroku/heroku-cli-util/commit/2bb45bf26e77987a2240d2cb59f74097780e47c6))
* Update how types are exported ([#236](https://github.com/heroku/heroku-cli-util/issues/236)) ([5563b34](https://github.com/heroku/heroku-cli-util/commit/5563b3431c10766ba60ea1f83a22543d793e6b43))
* **W-20270674:** allow getAttachment to find matches via config vars ([#248](https://github.com/heroku/heroku-cli-util/issues/248)) ([0d400a7](https://github.com/heroku/heroku-cli-util/commit/0d400a7b4335f7c6e52ab1d3b869207f96516837))


### Continuous Integration

* include pull_request to trigger ci actions ([#264](https://github.com/heroku/heroku-cli-util/issues/264)) ([1a44291](https://github.com/heroku/heroku-cli-util/commit/1a44291b069247d0ee2004ed17a3da34a2a74882))


### Miscellaneous Chores

* add ability to manually trigger test runs ([#259](https://github.com/heroku/heroku-cli-util/issues/259)) ([8063cdc](https://github.com/heroku/heroku-cli-util/commit/8063cdcf3cc1c319050995443d3ab34c9a283fbb))
* add repository field ([#258](https://github.com/heroku/heroku-cli-util/issues/258)) ([698e0c0](https://github.com/heroku/heroku-cli-util/commit/698e0c098939e3f2ce512b9020f30dbb6b1f59ce))
* Bump actions/setup-node from 5 to 6 ([#233](https://github.com/heroku/heroku-cli-util/issues/233)) ([18cbd43](https://github.com/heroku/heroku-cli-util/commit/18cbd439fd641355e12d20006f6832e2915fd3a0))
* correct release please manifest version ([#257](https://github.com/heroku/heroku-cli-util/issues/257)) ([e075182](https://github.com/heroku/heroku-cli-util/commit/e0751826a8392f872a536f374721c10a4235c74a))
* onboard shared workflows ([#247](https://github.com/heroku/heroku-cli-util/issues/247)) ([685a193](https://github.com/heroku/heroku-cli-util/commit/685a193d7c458ec9ded2957928e855ad3e747b8c))
* pass PAT to release-workflow action ([#261](https://github.com/heroku/heroku-cli-util/issues/261)) ([7414f55](https://github.com/heroku/heroku-cli-util/commit/7414f55587f046c1f53f564f222857165e2fd79f))
