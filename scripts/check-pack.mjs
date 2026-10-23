#!/usr/bin/env node
// Validate a GladosXshell language pack: meta fields (including the version), a BCP 47-ish
// code and string values.
//
//   node scripts/check-pack.mjs pack.json [...]
//
// A pack maps English source text to another language. Anything it does not cover falls
// back to English, so a pack may translate only the keys it wants to.
import { readFileSync } from 'node:fs'

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('usage: node scripts/check-pack.mjs <pack.json> [...]')
  process.exit(2)
}

let bad = 0
for (const file of files) {
  const problems = []
  let pack
  try {
    pack = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    problems.push(`not valid JSON: ${error.message}`)
  }
  if (pack) {
    const meta = pack.meta
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
      problems.push('missing meta object')
    } else {
      const { code, name, nativeName, rtl, version } = meta
      if (typeof code !== 'string' || !/^[a-z0-9-]+$/.test(code) || !/[a-z]/.test(code)) {
        problems.push('meta.code must be a BCP 47-ish tag: lowercase letters, digits and hyphens, with at least one letter (e.g. "fr", "pt-BR")')
      }
      if (typeof name !== 'string' || name.trim() === '') problems.push('meta.name (the language name in English) is required')
      if (typeof nativeName !== 'string' || nativeName.trim() === '') problems.push('meta.nativeName (the language name in its own language) is required')
      if (typeof rtl !== 'boolean') problems.push('meta.rtl must be true or false')
      if (typeof version !== 'string' || version.trim() === '') {
        problems.push('meta.version is required (e.g. "1.0.0") so pack updates can be tracked')
      }
    }
    const translations = pack.translations
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
      problems.push('translations must be an object mapping English text to your language')
    } else {
      if (Object.keys(translations).length === 0) problems.push('translations is empty (nothing to translate)')
      for (const value of Object.values(translations)) {
        if (typeof value !== 'string') problems.push('every translation value must be a string')
      }
    }
  }
  if (problems.length) {
    bad++
    console.log(`✗ ${file}`)
    for (const problem of problems) console.log(`    ${problem}`)
  } else {
    console.log(`✓ ${file}`)
  }
}
process.exit(bad ? 1 : 0)
