<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.2.6] - 2025-03-31

### Added
- Add ability to retry fetching scripts

## [v1.2.5] - 2024-10-04

### Fixed
- Set Rollup as peer dependency with `>=3.24.0`

## [v1.2.4] - 2024-09-19

### Changed
- Update dependencies and config

## [v1.2.3] - 2023-10-31

### Fixed
- Caching in `load()` is for content, not URLs... Don't convert to `URL`s

## [v1.2.2] - 2023-10-05

### Changed
- Handle file paths as `file:` URLs to avoid inconsistency

### Fixed
- Fixed handling Windows file paths [shgysk8zer0/npm-utils#19](https://github.com/shgysk8zer0/npm-utils/pull/19)

## [v1.2.1] - 2023-10-02

### Changed
- Update to use `@shgysk8zer0/consts`

## [v1.2.0] - 2023-07-03

### Changed
- Update to node 20.3.1
- Add `--provenance` to publish GH Action
- Update testing and publishing workflows
- Update versioning and lock scripts

## [v1.1.2] - 2023-06-23

### Added
- Add `funding`

## [v1.1.1] - 2023-06-10

### Changed
- Update `@shgysk8zer0/npm-utils` with support for `require()`

## [v1.1.0] - 2023-06-10

### Added
- Add handling of `import.meta.url` and `import.meta.resolve()`
- Added `magic-string` and `dotenv` as dependencies
- Add `@shgysk8zer0/js-utils` as dev dependency

### Removed
- Uninstall `rollup` and `eslint`

### Changed
- Update README with `import.meta.url` and `import.meta.resolve()` notes & instructions

## [v1.0.3] - 2023-06-07

### Fixed
- Re-fix exports

## [v1.0.2] - 2023-06-07

### Fixed
- Bad path for exports (requires `"./"` relative paths)

## [v1.0.1] - 2023-06-07

### Added
- Add `@shgysk8zer0/npm-utils`
- Add `index.cjs` as module for use with `require()`

### Changed
- Use `@shgysk8zer0/npm-utils/importmap` instead of own resolver of specifiers
- Update Action for GitHub Release

### Fixed
- Update GitHub Release Action with correct permissions

## [v1.0.0] - 2023-05-13

### Added
- Add workflow to automate releases on GitHub

### Changed
- Updated README
- Update error messages
- Update description
- Change required node version to `>=18.0.0` (required for `fetch()`)

### Fixed
- Full URLs were being marked as external

## [v0.0.5] - 2023-05-12

### Added
- Handle importing of URLs via `fetch()`

## [v0.0.4] - 2023-05-12

### Added
- Handle mapping mapping by prefixes

### Changed
- Update README

## [v0.0.3] - 2023-05-11

### Fixed
- Do not specify version of RollUp required

## [v0.0.2] - 2023-05-11

### Added
- Add support for YAML import maps

## [v0.0.1] - 2023-05-11
Initial Setup
