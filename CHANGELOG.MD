Changelog
=========

## v2.3.0

- Refactor package using Typescript and eslint.

## v2.2.1

- Additional unit tests.

## v2.2.0

- Switch back to previous parsing method as used pre v1.9.4.

## v2.1.0

- Update re2 (for Node 24).
- Migrate to NPM OIDC tokens.
- Add regex for Russian.

## v2.0.1

- Adjust email replies to better handle >.

## v2.0.0

- Split quotes from answers.

## v1.9.4

- Add Italian signature support.

## v1.9.3

- Avoid false positives.

## v1.9.2

- Add Dutch signature regex "Verstuurd vanaf".

## v1.9.1

- Minor improvements.

## v1.9.0

- Make re2 an optional peer dependency.

## v1.8.2

- New test case.

## v1.8.1

- Fix quotes with 11 dashes.

## v1.8.0

- Handle new case for emails sent from Outlook on iOS in French.
- Added German version of From: NAME <EMAIL>.

## v1.7.1

- Fix Fragment.isEmpty().
- Don't override the functions in the constructor.

## v1.7.0

- Bug fixes.

## v1.6.1

- Fix original message test case.

## v1.6.0

- Minor improvements.

## v1.5.4

- Add NPM publish provenance.

## v1.5.3

- Minor improvements.

## v1.5.2

- Test on Node 18 + 20.
- Improve npm publish security.

## v1.4.2

- Add build workflow.
- Normalize test workflow.
- Add missing LICENSE.
- Pull out incompatible Node 8 and lower, due to re2.

## v1.4.0

- Bump test matrix.

## v1.3.2

- Handle new case.

## v1.3.1

- New cases.
- Execute Regexes using Re2.
- Fix backtracking issues.
- Move all regexes to a singleton.

