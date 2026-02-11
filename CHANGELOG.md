# Changelog

## [10.4.0-beta.1](https://github.com/heroku/heroku-cli-util/compare/heroku-cli-util-v10.4.0-beta.1...heroku-cli-util-v10.4.0-beta.1) (2026-02-11)


### ⚠ BREAKING CHANGES

* Correct database resolver logic and general refactor ([#204](https://github.com/heroku/heroku-cli-util/issues/204))
* reimplement ux functions with oclif v4 and other utilities ([#193](https://github.com/heroku/heroku-cli-util/issues/193))

### reafactor

* reimplement ux functions with oclif v4 and other utilities ([#193](https://github.com/heroku/heroku-cli-util/issues/193)) ([29d9bb9](https://github.com/heroku/heroku-cli-util/commit/29d9bb9440c1de02d24bae6a7e34afd64f9bfa08))


### Features

* add color system ([#253](https://github.com/heroku/heroku-cli-util/issues/253)) ([169725a](https://github.com/heroku/heroku-cli-util/commit/169725a599228370725096819df3002554783b00))
* add oclif table options ([#198](https://github.com/heroku/heroku-cli-util/issues/198)) ([d3331fd](https://github.com/heroku/heroku-cli-util/commit/d3331fddcf57a055e6b800b60c4667c1f4b8a29c))
* adding utility functions from 'heroku-cli-plugin-data-beta' (W-20610130) ([#262](https://github.com/heroku/heroku-cli-util/issues/262)) ([9f5588c](https://github.com/heroku/heroku-cli-util/commit/9f5588ca11cb3713898896f0de22069fc007d918))
* backport changes from v9 branch to main (W-19890189) ([#240](https://github.com/heroku/heroku-cli-util/issues/240)) ([2ad585c](https://github.com/heroku/heroku-cli-util/commit/2ad585ce4ac1dfbe7265bbacda40100efec75b94))
* **colors:** add HEROKU_THEME with heroku and simple (ANSI 8) themes ([#284](https://github.com/heroku/heroku-cli-util/issues/284)) ([373b521](https://github.com/heroku/heroku-cli-util/commit/373b52154b5d92e25dc614b08606512df034ce61))
* export the DatabaseResolver itself ([#207](https://github.com/heroku/heroku-cli-util/issues/207)) ([d8cccf6](https://github.com/heroku/heroku-cli-util/commit/d8cccf68a0e0b7c02fca6d66a463114708b5b156))
* shared confirmCommand refactor (W-20449538) ([#273](https://github.com/heroku/heroku-cli-util/issues/273)) ([8ea6f64](https://github.com/heroku/heroku-cli-util/commit/8ea6f6442ae0092ddfd0e1c8b74303953f906727))
* update color definitions to use ANSI256 codes and add conditional Unicode display ([#274](https://github.com/heroku/heroku-cli-util/issues/274)) ([22a49e8](https://github.com/heroku/heroku-cli-util/commit/22a49e8de2606097afe0d30445c49621e652fdfa))


### Bug Fixes

* bump @heroku-cli/color ([a04ae67](https://github.com/heroku/heroku-cli-util/commit/a04ae670b58523beb07290e08997c4166ce40b67))
* Correct database resolver logic and general refactor ([#204](https://github.com/heroku/heroku-cli-util/issues/204)) ([564d815](https://github.com/heroku/heroku-cli-util/commit/564d8158df86828196b2a942043f29a92f46491c))
* **deps:** bump @oclif/core from 4.5.4 to 4.8.0 ([#250](https://github.com/heroku/heroku-cli-util/issues/250)) ([a9fc936](https://github.com/heroku/heroku-cli-util/commit/a9fc9369ffc193b2de65e9134833752455fcc92d))
* **deps:** bump @oclif/table from 0.4.14 to 0.5.1 ([#269](https://github.com/heroku/heroku-cli-util/issues/269)) ([c6039f4](https://github.com/heroku/heroku-cli-util/commit/c6039f48fcd06897e8805952c7a74477798a0748))
* **deps:** bump ansis from 4.1.0 to 4.2.0 ([#270](https://github.com/heroku/heroku-cli-util/issues/270)) ([a17b0ba](https://github.com/heroku/heroku-cli-util/commit/a17b0baaddbd2f51a5523810d93e4dafb7ddbc7e))
* **deps:** bump lodash from 4.17.21 to 4.17.23 ([#278](https://github.com/heroku/heroku-cli-util/issues/278)) ([c82f524](https://github.com/heroku/heroku-cli-util/commit/c82f52490ae76831dd2ce9694b083c0cef6627cd))
* do not use spinner when TERM=emacs-color ([7729e26](https://github.com/heroku/heroku-cli-util/commit/7729e2694c659736930c589a3ecd897375489bc2))
* ensure that machine is set ([9253345](https://github.com/heroku/heroku-cli-util/commit/9253345f03a75dfa396d90fb8cfc5955cf9d35c8))
* fix a few ux exports ([#179](https://github.com/heroku/heroku-cli-util/issues/179)) ([bea3831](https://github.com/heroku/heroku-cli-util/commit/bea38315b386cff3253a66bf2ffd45d2316577bb))
* Remove test helpers, rely on test-utils package which resolves some issues in downstream packages ([#189](https://github.com/heroku/heroku-cli-util/issues/189)) ([71a1a6f](https://github.com/heroku/heroku-cli-util/commit/71a1a6fae99af10a52c4377e3838fe4bd81fa75d))
* remove unneeded debug statements ([#254](https://github.com/heroku/heroku-cli-util/issues/254)) ([2bb45bf](https://github.com/heroku/heroku-cli-util/commit/2bb45bf26e77987a2240d2cb59f74097780e47c6))
* update @heroku-cli/color ([543a4f4](https://github.com/heroku/heroku-cli-util/commit/543a4f405817ad6f8b47c417fc0cb2c8168f5c84))
* Update how types are exported ([#236](https://github.com/heroku/heroku-cli-util/issues/236)) ([5563b34](https://github.com/heroku/heroku-cli-util/commit/5563b3431c10766ba60ea1f83a22543d793e6b43))
* updated netrc-parser ([ee9eaaf](https://github.com/heroku/heroku-cli-util/commit/ee9eaaf81a6dd04b789a45a18b84723e6994fb14))
* upgrade heroku-client ([f4dcf03](https://github.com/heroku/heroku-cli-util/commit/f4dcf036d4fe43f368fe5310f6ccf3cb85d5f19b))
* use netrc.saveSync ([#116](https://github.com/heroku/heroku-cli-util/issues/116)) ([18bf5da](https://github.com/heroku/heroku-cli-util/commit/18bf5dada9619e0045e01139a77c0c435367c437))
* **W-20270674:** allow getAttachment to find matches via config vars ([#248](https://github.com/heroku/heroku-cli-util/issues/248)) ([0d400a7](https://github.com/heroku/heroku-cli-util/commit/0d400a7b4335f7c6e52ab1d3b869207f96516837))


### Code Refactoring

* update tunnel-ssh ([#220](https://github.com/heroku/heroku-cli-util/issues/220)) ([158a4b5](https://github.com/heroku/heroku-cli-util/commit/158a4b5a731e43109c3134051d4b6ac2858ba2d7))


### Continuous Integration

* adding token for release on push PRs to trigger ci ([#266](https://github.com/heroku/heroku-cli-util/issues/266)) ([1033d2c](https://github.com/heroku/heroku-cli-util/commit/1033d2cfbd0bfc9d39dfb3b5cfb291b60a7793fc))
* include pull_request to trigger ci actions ([#264](https://github.com/heroku/heroku-cli-util/issues/264)) ([1a44291](https://github.com/heroku/heroku-cli-util/commit/1a44291b069247d0ee2004ed17a3da34a2a74882))


### Miscellaneous Chores

* add ability to manually trigger test runs ([#259](https://github.com/heroku/heroku-cli-util/issues/259)) ([8063cdc](https://github.com/heroku/heroku-cli-util/commit/8063cdcf3cc1c319050995443d3ab34c9a283fbb))
* add repository field ([#258](https://github.com/heroku/heroku-cli-util/issues/258)) ([698e0c0](https://github.com/heroku/heroku-cli-util/commit/698e0c098939e3f2ce512b9020f30dbb6b1f59ce))
* **beta:** release heroku-cli-util 10.4.0-beta.0 ([#275](https://github.com/heroku/heroku-cli-util/issues/275)) ([cff0455](https://github.com/heroku/heroku-cli-util/commit/cff0455ad3949da581391ea92f1afbe48f1e4ae4))
* **beta:** release heroku-cli-util 10.4.0-beta.1 ([#277](https://github.com/heroku/heroku-cli-util/issues/277)) ([02fc0af](https://github.com/heroku/heroku-cli-util/commit/02fc0aff41e44713be3d688cac3bfc8335ae0f5d))
* Bump actions/setup-node from 5 to 6 ([#233](https://github.com/heroku/heroku-cli-util/issues/233)) ([18cbd43](https://github.com/heroku/heroku-cli-util/commit/18cbd439fd641355e12d20006f6832e2915fd3a0))
* change package name back to original ([#154](https://github.com/heroku/heroku-cli-util/issues/154)) ([b39b903](https://github.com/heroku/heroku-cli-util/commit/b39b90332f1bafe8bc7703ed385a6e1c706ed2df))
* correct release please manifest version ([#257](https://github.com/heroku/heroku-cli-util/issues/257)) ([e075182](https://github.com/heroku/heroku-cli-util/commit/e0751826a8392f872a536f374721c10a4235c74a))
* **main:** release heroku-cli-util 10.3.0 ([#265](https://github.com/heroku/heroku-cli-util/issues/265)) ([3bd1b40](https://github.com/heroku/heroku-cli-util/commit/3bd1b40581e7a103e789b6c93313e28975a23470))
* **main:** release heroku-cli-util 10.4.0 ([#280](https://github.com/heroku/heroku-cli-util/issues/280)) ([0b03360](https://github.com/heroku/heroku-cli-util/commit/0b03360ce20512e3e480a21293a217749a7d2aef))
* onboard shared workflows ([#247](https://github.com/heroku/heroku-cli-util/issues/247)) ([685a193](https://github.com/heroku/heroku-cli-util/commit/685a193d7c458ec9ded2957928e855ad3e747b8c))
* onboard shared workflows ([#272](https://github.com/heroku/heroku-cli-util/issues/272)) ([c1ff948](https://github.com/heroku/heroku-cli-util/commit/c1ff9487f237cbe7ebb5f2546061ca77781fe83e))
* pass PAT to release-workflow action ([#261](https://github.com/heroku/heroku-cli-util/issues/261)) ([7414f55](https://github.com/heroku/heroku-cli-util/commit/7414f55587f046c1f53f564f222857165e2fd79f))
* release 10.4.0-beta.1 ([d45034f](https://github.com/heroku/heroku-cli-util/commit/d45034f24144ff5e8af41d880efa3f8c4d98c280))
* switch to github actions ([#145](https://github.com/heroku/heroku-cli-util/issues/145)) ([00dbc52](https://github.com/heroku/heroku-cli-util/commit/00dbc52939fa1cbd84725f08ab9a1d4db762819e))
* update heroku-client & bump ci node versions ([#127](https://github.com/heroku/heroku-cli-util/issues/127)) ([0a0ab80](https://github.com/heroku/heroku-cli-util/commit/0a0ab807ce326ee78e4a2137bef503ef1d3cf431))
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
