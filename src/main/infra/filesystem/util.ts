import { readdirSync, existsSync } from 'fs'
import fs from 'fs'
import path from 'path'

function getObjectValues(obj: any) {
  const keys = Object.keys(obj)

  if (!keys || keys.length === 0) return []

  return keys.map((k) => obj[k])
}

async function importFile(path: string) {
  const modelObject = await import(path)

  const [model] = getObjectValues(modelObject)

  return [
    model || modelObject,
    'esm'
  ]
}

async function loadFilesOnDirectory(dir: string) {
  if (!existsSync(dir)) return []

  const files = readdirSync(dir, { encoding: 'utf-8' })
  const classes = []
  if (files?.length > 0) {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const [_class] = await importFile(path.join(dir, file))
      classes.push(_class)
    }

    return classes
  }
}

async function writeFileOnDirectory(response: any, directory: string): Promise<void> {
  const writer = fs.createWriteStream(directory)

  response.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log("Arquivo salvo no diretório.")
      resolve()
    })

    writer.on('error', () => {
      reject(null)
    })
  })
}

function deleteFile(path: string): void {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path)
      console.log("Arquivo removido da pasta public")
    }
  } catch (err) {
    console.error("Erro ao tentar remover o arquivo:", err)
  }
}

function deleteAllFiles(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      const folderPath = path.dirname(filePath)
      const files = fs.readdirSync(folderPath)

      for (const file of files) {
        const fullPath = path.join(folderPath, file)

        fs.unlinkSync(fullPath)
      }
    }
    console.log("Arquivos removidos da pasta public")
  } catch (err) {
    console.error("Erro ao tentar remover os arquivos:", err)
  }
}

export {
  loadFilesOnDirectory,
  writeFileOnDirectory,
  deleteFile,
  deleteAllFiles
}
