import { artsCatalog } from './artsCatalog'

export type ArtDefinition =
  | (typeof artsCatalog.mainland)[number]
  | (typeof artsCatalog.faerie)[number]

export function getArtsForSheet(sheetType: 'mainland' | 'faerie'): readonly ArtDefinition[] {
  return artsCatalog[sheetType]
}

export function getMainAttribute(art: ArtDefinition): string {
  return art.attributes.split('+')[2]?.trim() || 'Не указан'
}

export function getArtSummary(art: ArtDefinition): string {
  return [
    `Основной аттрибут: ${getMainAttribute(art)}`,
    `1: ${art.first_stage_name}`,
    `2: ${art.second_stage_name}`,
    `3: ${art.third_stage_name}`,
    `4: ${art.fourth_stage_name}`
  ].join('\n')
}
