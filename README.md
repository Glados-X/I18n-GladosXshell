# GladosXshell i18n language packs

Templates, current-version packs and a validator for [GladosXshell](https://github.com/0Abdumalik/GladosXshell)
language packs. A pack translates the interface into one language; it works like a Cheat Engine
`.lng` file — English source text is the key, and anything a pack does not cover falls back to
English.

## Pack format

```json
{
  "meta": {
    "code": "fr",
    "name": "French",
    "nativeName": "Français",
    "rtl": false,
    "version": "1.0.0"
  },
  "translations": {
    "Ready": "Prêt",
    "Connect": "Se connecter"
  }
}
```

- `meta.code` — a [BCP 47](https://en.wikipedia.org/wiki/IETF_language_tag) tag written in
  **lower case**: lowercase letters, digits and hyphens, with at least one letter
  (`fr`, `ja`, `zh-cn`, `pt-br` …). A language plus a region is fine, but always lower case.
- `meta.name` — the language name in English, shown alongside the native name.
- `meta.nativeName` — the language name in itself (`Français`, `日本語` …), shown first in the picker.
- `meta.rtl` — `true` for a right-to-left script (the built-in Uyghur pack uses it).
- `meta.version` — the pack version, e.g. `1.2.0`. Bump it every time you update a translation so
  users and tools can tell the old pack from the new one. The app shows it in the language picker.
- `translations` — maps **English source text exactly as it appears in the app** to your
  language. Keys missing from your pack show in English, so you can translate as much or as
  little as you like.

## Repository layout

| Path | Purpose |
|---|---|
| `content/` | The packs that ship inside the current GladosXshell version: `en`, `zh-cn`, `ug`. They are generated from the app source with `scripts/extract-i18n.mjs` in the main repository and their `meta.version` tracks the app version. |
| `packs/` | Community-contributed packs (one file per language, named `<code>.json`). |
| `template.full.json` | Ready-to-fill template with every English key (the app's full string list). |
| `example.fr.json` | A short, valid example pack. |
| `scripts/check-pack.mjs` | The validator used locally and by the CI workflow. |
| `.github/workflows/` | Automatic format checks on every push and pull request. |

## Making a pack

1. Copy [`template.full.json`](template.full.json) — it already lists every English string the
   app uses, with values equal to their keys.
2. Fill in the `meta` block (give it a `version`, start at `1.0.0`) and translate as many
   `translations` values as you can.
3. Validate locally:

   ```sh
   node scripts/check-pack.mjs your-language.json
   ```

4. Install it in GladosXshell: **Settings → Language → Import language pack…**, pick the file,
   restart the app. The pack is stored under `<data>/Language/<code>.json` and its version
   shows in the language picker. A contributed pack can also be dropped straight into
   `content/` on a build machine and it ships with the next version.

## Contributing a pack (pull requests)

1. Fork this repository.
2. Add your pack as **`packs/<code>.json`** (for example `packs/pt-br.json`), or update an
   existing pack there or in `content/` for the built-in languages.
3. Keep `meta.nativeName` in the language itself, write `meta.code` in lower case, and bump
   `meta.version` with each change.
4. Open a pull request. **GitHub Actions validates the format automatically** — the workflow
   runs `scripts/check-pack.mjs` over every pack in `content/` and `packs/` and fails the
   check if any file has a problem (bad JSON, missing `meta` fields, an invalid `code`,
   non-string translation values, or an empty `translations` object).

## Built-in languages

English (`en`), Chinese (`zh-cn`) and Uyghur (`ug`) ship inside GladosXshell. Imported or
contributed packs override or extend them.

## Validator

`node scripts/check-pack.mjs <pack.json> [...]` checks JSON syntax, the `meta` fields
(including the required `version`), the code shape and that every translation value is a
string. It exits non-zero on any problem.
