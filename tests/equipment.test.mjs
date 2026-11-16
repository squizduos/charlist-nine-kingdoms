import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
import { createSSRApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { renderToString } from '@vue/server-renderer'

const storage = new Map()
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
}

test('equipment migration, capacity and sixth dots', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  try {
    const { createEmptyCharacter, legacyWornEquipmentSlots } = await server.ssrLoadModule('/src/types/character.ts')
    const { useCharacterStore } = await server.ssrLoadModule('/src/stores/character.ts')
    const Inventory = (await server.ssrLoadModule('/src/components/sections/InventorySection.vue')).default
    const Arts = (await server.ssrLoadModule('/src/components/sections/ArtsSection.vue')).default
    const Connections = (await server.ssrLoadModule('/src/components/sections/ConnectionsSection.vue')).default
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useCharacterStore()
    const legacy = createEmptyCharacter()
    legacy.wornEquipment = legacyWornEquipmentSlots.map(() => ({ name: '', value: 0 }))
    legacy.wornEquipment[0] = { name: 'helmet', value: 6, explanation: 'kept' }
    legacy.wornEquipment[10] = { name: 'ring', value: 2 }
    legacy.equipment[0] = { name: 'old equipment', value: 4 }
    legacy.artifacts[0] = { name: 'artifact', value: 5 }
    assert.equal(store.importFromJSON(JSON.stringify(legacy)), true)
    assert.deepEqual(JSON.parse(JSON.stringify(store.character.wornEquipment)), [
      { name: 'helmet', value: 6, explanation: 'kept', slot: 'Голова' },
      { name: 'ring', value: 2, slot: 'Аксессуар' },
    ])
    assert.equal(store.character.equipment[0].name, 'old equipment')

    const render = component => {
      const app = createSSRApp(component)
      app.use(pinia)
      return renderToString(app)
    }
    let html = await render(Inventory)
    const artifactsBlock = html.split('artifacts-block')[1].split('equipment-block')[0]
    const wornBlock = html.split('worn-equipment-block')[1].split('consumables-block')[0]
    assert.equal((artifactsBlock.match(/optional-dot/g) ?? []).length, 11)
    assert.match(artifactsBlock, /Точка 6 из 6/)
    assert.equal((wornBlock.match(/optional-dot/g) ?? []).length, 2)
    assert.match(wornBlock, /Точка 6 из 6/)
    store.character.artifacts[0].value = 6
    assert.equal(store.importFromJSON(store.exportToJSON()), true)
    assert.equal(store.character.artifacts[0].value, 6)
    let selects = [...html.matchAll(/<select\b[^>]*>(.*?)<\/select>/gs)].map(match => match[1])
    assert.equal(selects.length, 2)
    assert.match(selects[0], /Голова/)
    assert.doesNotMatch(selects[1], /Голова/)
    assert.match(html, /Добавить предмет/)

    store.character.wornEquipment = legacyWornEquipmentSlots.map(slot => ({ slot, name: 'item', value: 1 }))
    html = await render(Inventory)
    selects = [...html.matchAll(/<select\b[^>]*>(.*?)<\/select>/gs)].map(match => match[1])
    assert.equal(selects.length, 14)
    assert.doesNotMatch(html, /Добавить предмет/)
    assert.doesNotMatch(selects[0], /Аксессуар|Оружие/)
    store.character.wornEquipment.splice(0, 1)
    html = await render(Inventory)
    assert.match(html, /Добавить предмет/)
    assert.match(html, /Голова/)

    const saved = store.exportToJSON()
    assert.equal(store.importFromJSON(saved), true)
    assert.equal(store.character.wornEquipment.length, 13)
    assert.equal(store.character.wornEquipment[0].slot, 'Спина')
    const oldWithoutEquipment = createEmptyCharacter()
    delete oldWithoutEquipment.wornEquipment
    storage.clear()
    storage.set('nine-kingdoms-tabs', JSON.stringify({ tabs: [{ id: 'old', name: 'old', character: oldWithoutEquipment }], activeTabId: 'old' }))
    store.loadFromLocalStorage()
    assert.equal(store.character.wornEquipment.length, 0)

    store.character.birthrights[0] = { name: 'birthright', value: 6 }
    store.character.features[0] = { name: 'feature', value: 6 }
    assert.match(await render(Arts), /optional-dot/)
    assert.match(await render(Connections), /optional-dot/)
  } finally {
    await server.close()
  }
})
