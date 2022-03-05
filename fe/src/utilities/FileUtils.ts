export function fileNameWithoutExtension (fileName: string) {
  if (!fileName) return fileName
  if (fileName.indexOf('.') === -1) return fileName
  return fileName.split('.').slice(0, -1).join('.')
}
