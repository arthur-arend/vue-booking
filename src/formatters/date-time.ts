export const formatDate = (date: Date | null) => {
  if (date === null) return ''
  const [year, month, day] = date.toISOString().split('T')[0].split('-')
  return `${day}/${month}/${year}`
}
