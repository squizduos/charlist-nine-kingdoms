/**
 * Character model for Nine Kingdoms RPG
 */
export class Character {
  constructor(data = {}) {
    this.id = data.id || this.generateId()
    this.name = data.name || `Персонаж ${this.id}`
    this.data = {
      characterName: data.characterName || 'Персонаж',
      playerName: data.playerName || 'Иван',
      kitchenName: data.kitchenName || 'Человек',
      concept: data.concept || 'Волшебник',
      age: data.age || '69',
      gameType: data.gameType || 'Материк',
      characterId: data.characterId || '0',
      
      // Social attributes
      charisma: data.charisma || 1,
      manipulation: data.manipulation || 1,
      insight: data.insight || 1,
      deception: data.deception || 1,
      brawling: data.brawling || 1,
      socialSpecialties: data.socialSpecialties || ['', '', '', '', '', '', ''],
      
      // Mental attributes
      attention: data.attention || 1,
      intelligence: data.intelligence || 1,
      sciences: data.sciences || 1,
      culture: data.culture || 1,
      skills: data.skills || 1,
      mentalSpecialties: data.mentalSpecialties || ['', '', '', '', '', '', ''],
      
      // Physical attributes
      physique: data.physique || 1,
      defense: data.defense || 1,
      dexterity: data.dexterity || 1,
      strength: data.strength || 1,
      stamina: data.stamina || 1,
      physicalSpecialties: data.physicalSpecialties || ['', '', '', '', '', '', ''],
      
      // Additional stats
      health: data.health || 2,
      lethal: data.lethal || 0,
      stupid: data.stupid || 0,
      ammo: data.ammo || '16825',
      
      // Resources
      points: data.points || 0,
      strings: data.strings || 0,
      fim: data.fim || 0,
      artifacts: data.artifacts || 0,
      
      // Human figure parts (for injury tracking)
      figureParts: data.figureParts || {
        head: false,
        leftArm: false,
        rightArm: false,
        body: false,
        leftLeg: false,
        rightLeg: false
      },
      
      // Damage tracking
      stupidDamage: data.stupidDamage || 0,
      lethalDamage: data.lethalDamage || 0,
      
      // Mental damage tracking
      mentalDamageBig: data.mentalDamageBig || 0,
      mentalDamageSmall: data.mentalDamageSmall || 0,
      
      // Additional tracking
      permanentWill: data.permanentWill || 0,
      rerolls: data.rerolls || 0,
      
      // Experience tracking
      experience: data.experience || 0,
      
      // Notes
      notes: data.notes || [
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      ]
    }
  }

  /**
   * Generate unique ID for character
   */
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Calculate dot limits based on character attributes
   */
  calculateDotLimits() {
    const limits = {}
    
    // Convert string values to numbers for calculations
    const brawling = parseInt(this.data.brawling) || 0
    const physique = parseInt(this.data.physique) || 0
    const permanentWill = parseInt(this.data.permanentWill) || 0
    
    // lethalDamage and stupidDamage max value = "brawling + physique"
    limits.lethalDamage = brawling + physique
    limits.stupidDamage = brawling + physique
    
    // rerolls max value = permanentWill
    limits.rerolls = permanentWill
    
    return limits
  }

  /**
   * Get character display name
   */
  getDisplayName() {
    return this.data.characterName || this.name
  }

  /**
   * Export character data for storage
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      data: this.data
    }
  }

  /**
   * Create character from JSON data
   */
  static fromJSON(json) {
    return new Character(json)
  }
}
