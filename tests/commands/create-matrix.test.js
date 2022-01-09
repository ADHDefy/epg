const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

beforeEach(() => {
  fs.rmdirSync('tests/__data__/output', { recursive: true })
  fs.mkdirSync('tests/__data__/output')
  fs.copyFileSync('tests/__data__/input/channels.db', 'tests/__data__/temp/channels.db')
})

afterEach(() => {
  fs.rmdirSync('tests/__data__/temp', { recursive: true })
  fs.mkdirSync('tests/__data__/temp')
})

it('can create valid matrix', () => {
  const result = execSync('DB_DIR=tests/__data__/temp node scripts/commands/create-matrix.js', {
    encoding: 'utf8'
  })
  expect(result).toBe('::set-output name=matrix::{"cluster_id":[1]}\n')
})
