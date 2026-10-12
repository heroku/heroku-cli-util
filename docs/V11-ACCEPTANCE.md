# v11.0.0 Acceptance Checklist

Baseline: `10.10.2` (`0ec7cbafcfc3fd2871b2900d30f637b6a162d638`)

## Agreed Changes

- [x] Set the runtime minimum to Node `>=22.12.0`.
- [x] Upgrade the direct `@oclif/core` dependency to v5.
- [x] Declare runtime `@heroku-cli/command` as `^14.0.0-beta.1`, admitting stable v14 while excluding v13. The dev-only test helper still installs its own command v13; it is not part of util's runtime dependency range.
- [x] Align development Node types to v22.
- [x] Preserve core v4 where required by `@heroku-cli/command` and test helpers; validate coexistence without blanket overrides.
- [x] Adapt source only where checks showed an incompatibility: cache command responses by their used `body` shape because command v14 pins `@heroku/http-call@5.5.2` while util uses `5.6.1`.
- [x] Update CI test lanes to Node 22 and 24 on Linux, macOS, and Windows; align main branch required checks (six matrix lanes).
- [ ] Document the runtime minimum, core-v5 upgrade, temporary transitive-v4 exception, beta installation, and stable migration.
- [ ] Preserve all existing public exports, aliases, and unrelated behavior.

## Package Compatibility

- [x] Keep unit tests and existing coverage thresholds passing (454 tests; 88.25% statements, 85.55% branches, 76.25% functions, 89.88% lines).
- [ ] Make catch-only rejection assertions fail on unexpected success.
- [ ] Build the versioned release candidate and inspect its tarball contents.
- [ ] Install the tarball into a clean consumer fixture without workspace links, source aliases, or a Vitest loader.
- [ ] Verify all seven public entrypoints, JS/declaration targets, existing aliases, and native ESM loading.
- [ ] Compile an installed-package TypeScript consumer with Node 22 types, Node-aware resolution, and `skipLibCheck: false`; exercise Config/APIClient-to-resolver type boundaries without `any` casts.
- [x] Build and run all 454 unit tests against command `14.0.0-beta.1`; semver-check that `^14.0.0-beta.1` admits stable v14 and excludes v13.
- [ ] Run a real core-v5 command fixture for discovery/help/flag parsing, representative table/JSON output, controlled errors/exits, stdout, and stderr.
- [ ] Record actual resolved core versions and paths from the fixture, this package, and `@heroku-cli/command`.
- [ ] Fresh-install the published package and run a plain-Node smoke test on exactly Node `22.12.0`.
- [ ] Run build, lint, unit tests, and coverage on Node 22/24 across Linux, macOS, and Windows (CI pending branch push).

## Beta Acceptance

- [ ] Reconcile beta history and release metadata without resetting or force-pushing the beta branch.
- [ ] Generate and inspect an explicit `11.0.0-beta.0` candidate and freeze its inputs.
- [ ] Validate the exact candidate SHA before separately approving beta publication under npm tag `beta`; leave `latest` unchanged.
- [ ] Audit the published beta version, source identity, integrity/provenance where available, and package contents.
- [ ] Repeat installed-package checks against the exact immutable beta version.
- [ ] Run agreed consumer regressions with the exact command v14 beta; treat the current core-v4 CLI repository as supplementary coverage only.
- [ ] Record beta version, source SHA, integrity, resolved dependency graph, toolchain, OS coverage, checklist, and results.
- [ ] Publish a new immutable beta and repeat acceptance after any production-code or dependency change.

## Stable Acceptance

- [ ] Prepare and explicitly generate stable `11.0.0` from accepted production content.
- [ ] Verify beta-to-stable differences contain only reviewed release metadata changes.
- [ ] Revalidate the stable candidate, runtime payload, and fresh consumer dependency resolution.
- [ ] Validate util v11 against stable `@heroku-cli/command` v14; keep v13 unsupported.
- [ ] Obtain separate stable publishing approval before publishing `11.0.0` under `latest`.
- [ ] Finalize release metadata and audit the published stable artifact.
