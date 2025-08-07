// Character Manager
class CharacterManager {
    constructor() {
        this.characters = [];
        this.currentCharacterIndex = 0;
        this.nextId = 1;
        
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.renderCharacterTabs();
        this.renderCharacterSheets();
        
        // If no characters exist, create a default one
        if (this.characters.length === 0) {
            this.createNewCharacter();
        } else {
            this.showCharacter(0);
        }
    }
    
    setupEventListeners() {
        // Global control buttons
        document.getElementById('new-character').addEventListener('click', () => this.createNewCharacter());
        document.getElementById('import-data').addEventListener('click', () => this.importData());
        document.getElementById('export-data').addEventListener('click', () => this.exportData());
        document.getElementById('print-character').addEventListener('click', () => this.printCharacter());
        
        // File input for import
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileImport(e));
        
        // Auto-save on input changes
        document.addEventListener('input', () => this.saveToStorage());
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                this.saveToStorage();
            }
        });
    }
    
    createNewCharacter() {
        const character = {
            id: this.nextId++,
            name: `Персонаж ${this.characters.length + 1}`,
            data: this.getDefaultCharacterData()
        };
        
        this.characters.push(character);
        this.currentCharacterIndex = this.characters.length - 1;
        
        this.saveToStorage();
        this.renderCharacterTabs();
        this.renderCharacterSheets();
        this.showCharacter(this.currentCharacterIndex);
    }
    
    getDefaultCharacterData() {
        return {
            characterName: 'Эмма',
            playerName: 'Семён',
            kitchenName: 'Лилиям',
            concept: 'Глупец',
            age: '21',
            income: 'Создатель: Лебиди',
            characterId: '16825',
            
            // Social attributes
            charisma: 0,
            manipulation: 0,
            insight: 0,
            deception: 0,
            brawling: 0,
            socialSpecialties: ['Соблазнитель', 'Твердый характер', 'Оратор'],
            
            // Mental attributes
            attention: 0,
            intelligence: 0,
            sciences: 0,
            culture: 0,
            mentalSpecialties: ['Следопыт', 'Кулинария'],
            
            // Physical attributes
            physique: 0,
            defense: 0,
            dexterity: 0,
            strength: 0,
            stamina: 0,
            physicalSpecialties: ['Меткость', 'Гибкость'],
            
            // Additional stats
            health: 5,
            lethal: 0,
            stupid: 0,
            ammo: '16825',
            
            // Resources
            points: 0,
            strings: 0,
            fim: 0,
            artifacts: 0,
            
            // Human figure parts (for injury tracking)
            figureParts: {
                head: false,
                leftArm: false,
                rightArm: false,
                body: false,
                leftLeg: false,
                rightLeg: false
            },
            
            // Damage tracking
            stupidDamage: 0,
            lethalDamage: 0,
            
            // Mental damage tracking
            mentalDamageBig: 0,
            mentalDamageSmall: 0,
            
            // Additional tracking
            permanentWill: 0,
            rerolls: 0,
            
            // Experience tracking
            experience: 0,
            
            // Notes
            notes: [
                'Фляшка с правилами', 'Медвежья лапа', 'Поддельные водительские права',
                'Номер Илоны', 'Одна кожаная плётка', 'Чёрная маска кошечки',
                'Носки', 'Номер Каварейки', 'Номера всех сотрудников лагеря',
                '10 сим-карт', 'Шмат рыбы и шмат мяса', 'Ключи от BMW Егора Андреевича',
                'Кулон Золотой Раковины', 'Визитка Владика', 'Сигареты Командора',
                '2 костюма Hello Kitty', 'Пуховик Hello Kitty',
                'Записки с именем Антон Градов и номером телефона',
                'Визитка Евгения Олеговича Прокофьева', 'Ключ от квартиры Васи',
                'Железный хуй', 'Прокофьев Евгений Олегович', 'Кристалл из комнаты Алевтины',
                'Пластиковые розы', 'Клеевой пистолет', 'Банка с вареньем и банка с помидорами',
                'Сигареты Бонд Крепкие'
            ]
        };
    }
    
    renderCharacterTabs() {
        const tabsContainer = document.querySelector('.character-tabs');
        tabsContainer.innerHTML = '';
        
        this.characters.forEach((character, index) => {
            const tab = document.createElement('div');
            tab.className = `character-tab ${index === this.currentCharacterIndex ? 'active' : ''}`;
            tab.innerHTML = `
                <span>${character.name}</span>
                <button class="close-tab" onclick="characterManager.closeCharacter(${index})">×</button>
            `;
            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('close-tab')) {
                    this.showCharacter(index);
                }
            });
            tabsContainer.appendChild(tab);
        });
    }
    
    renderCharacterSheets() {
        const container = document.querySelector('.character-sheets-container');
        container.innerHTML = '';
        
        this.characters.forEach((character, index) => {
            const sheet = this.createCharacterSheet(character, index);
            container.appendChild(sheet);
        });
    }
    
    createCharacterSheet(character, index) {
        const sheet = document.createElement('div');
        sheet.className = `character-sheet ${index === this.currentCharacterIndex ? 'active' : ''}`;
        sheet.id = `character-${character.id}`;
        
        sheet.innerHTML = `
            <!-- Header Section -->
            <div class="header">
                <div class="character-info">
                    <label>ПЕРСОНАЖ <input type="text" value="${character.data.characterName}" data-field="characterName"></label>
                    <label>ИГРОК <input type="text" value="${character.data.playerName}" data-field="playerName"></label>
                    <label>КИТЧЕН <input type="text" value="${character.data.kitchenName}" data-field="kitchenName"></label>
                </div>
                <div class="concept">
                    <label>КОНЦЕПЦИЯ <input type="text" value="${character.data.concept}" data-field="concept"></label>
                    <label>ВОЗРАСТ <input type="number" value="${character.data.age}" data-field="age"></label>
                    <label>ДОХОДНОВАНИЕ <input type="text" value="${character.data.income}" data-field="income"></label>
                </div>
                <div class="human-figure-header">
                    <h3>ТЕЛО ПЕРСОНАЖА</h3>
                    <div class="human-figure-container">
                        <svg class="human-figure" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                            <!-- Head -->
                            <circle class="figure-part ${character.data.figureParts.head ? 'injured' : ''}" 
                                    id="head-${character.id}" 
                                    cx="100" cy="30" r="20" 
                                    data-part="head" 
                                    data-character-id="${character.id}"/>
                            
                            <!-- Body -->
                            <rect class="figure-part ${character.data.figureParts.body ? 'injured' : ''}" 
                                  id="body-${character.id}" 
                                  x="80" y="50" width="40" height="80" 
                                  data-part="body" 
                                  data-character-id="${character.id}"/>
                            
                            <!-- Left Arm -->
                            <rect class="figure-part ${character.data.figureParts.leftArm ? 'injured' : ''}" 
                                  id="leftArm-${character.id}" 
                                  x="40" y="60" width="40" height="15" 
                                  data-part="leftArm" 
                                  data-character-id="${character.id}"/>
                            
                            <!-- Right Arm -->
                            <rect class="figure-part ${character.data.figureParts.rightArm ? 'injured' : ''}" 
                                  id="rightArm-${character.id}" 
                                  x="120" y="60" width="40" height="15" 
                                  data-part="rightArm" 
                                  data-character-id="${character.id}"/>
                            
                            <!-- Left Leg -->
                            <rect class="figure-part ${character.data.figureParts.leftLeg ? 'injured' : ''}" 
                                  id="leftLeg-${character.id}" 
                                  x="85" y="130" width="15" height="60" 
                                  data-part="leftLeg" 
                                  data-character-id="${character.id}"/>
                            
                            <!-- Right Leg -->
                            <rect class="figure-part ${character.data.figureParts.rightLeg ? 'injured' : ''}" 
                                  id="rightLeg-${character.id}" 
                                  x="100" y="130" width="15" height="60" 
                                  data-part="rightLeg" 
                                  data-character-id="${character.id}"/>
                        </svg>
                    </div>
                </div>
                <div class="damage-dots">
                    <div class="damage-line">
                        <label>Летальный урон</label>
                        <div class="dots big-dots" data-max="10" data-field="lethalDamage" data-character-id="${character.id}">
                            <span class="dot" data-value="1">⬤</span>
                            <span class="dot" data-value="2">⬤</span>
                            <span class="dot" data-value="3">⬤</span>
                            <span class="dot" data-value="4">⬤</span>
                            <span class="dot" data-value="5">⬤</span>
                            <span class="dot" data-value="6">⬤</span>
                            <span class="dot" data-value="7">⬤</span>
                            <span class="dot" data-value="8">⬤</span>
                            <span class="dot" data-value="9">⬤</span>
                            <span class="dot" data-value="10">⬤</span>
                        </div>
                    </div>
                    <div class="damage-line">
                        <label>Тупой урон</label>
                        <div class="dots" data-max="10" data-field="stupidDamage" data-character-id="${character.id}">
                            <span class="dot" data-value="1">⬤</span>
                            <span class="dot" data-value="2">⬤</span>
                            <span class="dot" data-value="3">⬤</span>
                            <span class="dot" data-value="4">⬤</span>
                            <span class="dot" data-value="5">⬤</span>
                            <span class="dot" data-value="6">⬤</span>
                            <span class="dot" data-value="7">⬤</span>
                            <span class="dot" data-value="8">⬤</span>
                            <span class="dot" data-value="9">⬤</span>
                            <span class="dot" data-value="10">⬤</span>
                        </div>
                    </div>
                    <hr>
                    <div class="damage-line">
                        <label>Постоянная Воля</label>
                        <div class="dots big-dots" data-max="10" data-field="permanentWill" data-character-id="${character.id}">
                            <span class="dot" data-value="1">⬤</span>
                            <span class="dot" data-value="2">⬤</span>
                            <span class="dot" data-value="3">⬤</span>
                            <span class="dot" data-value="4">⬤</span>
                            <span class="dot" data-value="5">⬤</span>
                            <span class="dot" data-value="6">⬤</span>
                            <span class="dot" data-value="7">⬤</span>
                            <span class="dot" data-value="8">⬤</span>
                            <span class="dot" data-value="9">⬤</span>
                            <span class="dot" data-value="10">⬤</span>
                        </div>
                    </div>
                    <hr>
                    <div class="damage-line">
                        <label>Бедламы</label>
                        <div class="dots big-dots" data-max="10" data-field="mentalDamageBig" data-character-id="${character.id}">
                            <span class="dot" data-value="1">⬤</span>
                            <span class="dot" data-value="2">⬤</span>
                            <span class="dot" data-value="3">⬤</span>
                            <span class="dot" data-value="4">⬤</span>
                            <span class="dot" data-value="5">⬤</span>
                            <span class="dot" data-value="6">⬤</span>
                            <span class="dot" data-value="7">⬤</span>
                            <span class="dot" data-value="8">⬤</span>
                            <span class="dot" data-value="9">⬤</span>
                            <span class="dot" data-value="10">⬤</span>
                        </div>
                    </div>
                    <div class="damage-line">
                        <label>Кошмары</label>
                        <div class="dots" data-max="10" data-field="mentalDamageSmall" data-character-id="${character.id}">
                            <span class="dot" data-value="1">⬤</span>
                            <span class="dot" data-value="2">⬤</span>
                            <span class="dot" data-value="3">⬤</span>
                            <span class="dot" data-value="4">⬤</span>
                            <span class="dot" data-value="5">⬤</span>
                            <span class="dot" data-value="6">⬤</span>
                            <span class="dot" data-value="7">⬤</span>
                            <span class="dot" data-value="8">⬤</span>
                            <span class="dot" data-value="9">⬤</span>
                            <span class="dot" data-value="10">⬤</span>
                        </div>
                    </div>
                    <hr>
                    <div class="damage-line">
                        <label>Перебросы</label>
                        <div class="dots" data-max="10" data-field="rerolls" data-character-id="${character.id}">
                            <span class="dot" data-value="1">⬤</span>
                            <span class="dot" data-value="2">⬤</span>
                            <span class="dot" data-value="3">⬤</span>
                            <span class="dot" data-value="4">⬤</span>
                            <span class="dot" data-value="5">⬤</span>   
                            <span class="dot" data-value="6">⬤</span>
                            <span class="dot" data-value="7">⬤</span>
                            <span class="dot" data-value="8">⬤</span>
                            <span class="dot" data-value="9">⬤</span>
                            <span class="dot" data-value="10">⬤</span>
                        </div>
                    </div>
                    <div class="damage-line">
                        <label>Опыт</label>
                        <div class="dots big-dots" data-max="15" data-field="experience" data-character-id="${character.id}">
                            <span class="dot" data-value="1">⬤</span>
                            <span class="dot" data-value="2">⬤</span>
                            <span class="dot" data-value="3">⬤</span>
                            <span class="dot" data-value="4">⬤</span>
                            <span class="dot" data-value="5">⬤</span>
                            <span class="dot" data-value="6">⬤</span>
                            <span class="dot" data-value="7">⬤</span>
                            <span class="dot" data-value="8">⬤</span>
                            <span class="dot" data-value="9">⬤</span>
                            <span class="dot" data-value="10">⬤</span>
                            <span class="dot" data-value="11">⬤</span>
                            <span class="dot" data-value="12">⬤</span>
                            <span class="dot" data-value="13">⬤</span>
                            <span class="dot" data-value="14">⬤</span>
                            <span class="dot" data-value="15">⬤</span>
                        </div>
                    </div>
                </div>
                <h1 class="character-id">ID ${character.data.characterId}</h1>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <button class="tab-button active" onclick="characterManager.openTab(${character.id}, 'attributes')">ХАРАКТЕРИСТИКИ</button>
                <button class="tab-button" onclick="characterManager.openTab(${character.id}, 'additional')">ДОПОЛНИТЕЛЬНО</button>
                <button class="tab-button" onclick="characterManager.openTab(${character.id}, 'notes')">ЗАМЕТКИ</button>
            </div>

            <!-- Tab Content -->
            <div id="attributes-${character.id}" class="tab-content active">
                <!-- Attributes Section -->  
                <div class="attributes">  
                    <div class="attribute-category">  
                        <h2>СОЦИАЛЬНЫЕ</h2>  
                        <div class="attribute">  
                            <label>ХАРИЗМА <div class="dots" data-max="5" data-field="charisma"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>МАНИПУЛИРОВАНИЕ <div class="dots" data-max="5" data-field="manipulation"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>ПРОНИЦАТЕЛЬНОСТЬ <div class="dots" data-max="5" data-field="insight"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>ОБМАН <div class="dots" data-max="5" data-field="deception"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>ХРАБРОСТЬ <div class="dots" data-max="5" data-field="brawling"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                        </div>  
                        <ol>  
                            <li><input type="text" placeholder="Соблазнитель" value="${character.data.socialSpecialties[0] || ''}" data-field="socialSpecialties" data-index="0"></li>  
                            <li><input type="text" placeholder="Твердый характер" value="${character.data.socialSpecialties[1] || ''}" data-field="socialSpecialties" data-index="1"></li>  
                            <li><input type="text" placeholder="Оратор" value="${character.data.socialSpecialties[2] || ''}" data-field="socialSpecialties" data-index="2"></li>  
                        </ol>  
                    </div>  
                    <div class="attribute-category">  
                        <h2>МЕНТАЛЬНЫЕ</h2>  
                        <div class="attribute">  
                            <label>ВНИМАНИЕ <div class="dots" data-max="5" data-field="attention"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>ИНТЕЛЛЕКТ <div class="dots" data-max="5" data-field="intelligence"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>НАУКИ <div class="dots" data-max="5" data-field="sciences"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>КУЛЬТУРА <div class="dots" data-max="5" data-field="culture"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>НАВЫКИ <div class="dots" data-max="5" data-field="skills"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            </div>  
                        <ol>  
                            <li><input type="text" placeholder="Следопыт" value="${character.data.mentalSpecialties[0] || ''}" data-field="mentalSpecialties" data-index="0"></li>  
                            <li><input type="text" placeholder="Кулинария" value="${character.data.mentalSpecialties[1] || ''}" data-field="mentalSpecialties" data-index="1"></li>  
                        </ol>  
                    </div>  
                    <div class="attribute-category">  
                        <h2>ФИЗИЧЕСКИЕ</h2>  
                        <div class="attribute">  
                            <label>ТЕЛОСЛОЖЕНИЕ <div class="dots" data-max="5" data-field="physique"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>ЗАЩИТА <div class="dots" data-max="5" data-field="defense"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>ЛОВКОСТЬ <div class="dots" data-max="5" data-field="dexterity"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>НАПАДЕНИЕ <div class="dots" data-max="5" data-field="strength"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                            <label>СКРЫТНОСТЬ <div class="dots" data-max="5" data-field="stamina"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div></label>  
                        </div>  
                        <ol>  
                            <li><input type="text" placeholder="Меткость" value="${character.data.physicalSpecialties[0] || ''}" data-field="physicalSpecialties" data-index="0"></li>  
                            <li><input type="text" placeholder="Гибкость" value="${character.data.physicalSpecialties[1] || ''}" data-field="physicalSpecialties" data-index="1"></li>  
                        </ol>  
                    </div>  
                </div>  
            </div>

            <div id="additional-${character.id}" class="tab-content">
                <!-- Additional Sections -->  
                <div class="additional-info">  
                    <div class="section">  
                        <h2>ОПЫТ</h2>  
                        <div class="dots experience" data-max="5" data-field="experience"><span class="dot" data-value="1">★</span><span class="dot" data-value="2">★</span><span class="dot" data-value="3">★</span><span class="dot" data-value="4">★</span><span class="dot" data-value="5">★</span></div>  
                    </div>  
                    <div class="section">  
                        <h2>НР</h2>  
                        <div class="dots health" data-max="5" data-field="health"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div>  
                    </div>  
                    <div class="section">  
                        <h2>ЛЕТАЛ</h2>  
                        <div class="dots" data-max="5" data-field="lethal"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div>  
                    </div>  
                    <div class="section">  
                        <h2>ТУПОЙ</h2>  
                        <div class="dots" data-max="5" data-field="stupid"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span><span class="dot" data-value="4">⬤</span><span class="dot" data-value="5">⬤</span></div>  
                    </div>  
                </div>  

                <!-- Other Details -->  
                <div class="other-details">  
                    <div class="section">  
                        <h2>БОЕЗАПАС</h2>  
                        <input type="text" value="${character.data.ammo}" data-field="ammo">  
                    </div>  
                    <div class="section">  
                        <h2>РАСХОДНЫЕ МАТЕРИАЛЫ</h2>  
                        <div class="resources">  
                            <label>ОЧКИ <div class="dots" data-max="3" data-field="points"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span></div></label>  
                            <label>Струны <div class="dots" data-max="3" data-field="strings"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span></div></label>  
                            <label>ФИМ <div class="dots" data-max="3" data-field="fim"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span></div></label>  
                            <label>АРТЕФАКТЫ <div class="dots" data-max="3" data-field="artifacts"><span class="dot" data-value="1">⬤</span><span class="dot" data-value="2">⬤</span><span class="dot" data-value="3">⬤</span></div></label>  
                        </div>  
                    </div>  
                </div>  
            </div>

            <div id="notes-${character.id}" class="tab-content">
                <!-- Right Section: Additional Notes -->  
                <div class="additional-notes">  
                    <h2>ДОПОЛНИТЕЛЬНЫЕ ЗАМЕТКИ</h2>  
                    <ul>  
                        ${character.data.notes.map((note, noteIndex) => 
                            `<li><input type="text" value="${note}" data-field="notes" data-index="${noteIndex}"></li>`
                        ).join('')}
                    </ul>  
                </div>  
            </div>
        `;
        
        // Set initial dot values
        this.setInitialDots(sheet, character);
        
        // Add event listeners for dots
        this.setupDotEventListeners(sheet, character);
        
        return sheet;
    }
    
    setInitialDots(sheet, character) {
        const dotsContainers = sheet.querySelectorAll('.dots');
        
        dotsContainers.forEach(container => {
            const field = container.getAttribute('data-field');
            const value = character.data[field] || 0;
            this.setDotsValue(container, value);
            
            // Apply dot limits for damage and rerolls
            this.applyDotLimits(container, character);
        });
        
        // Set initial figure parts state
        const figureParts = sheet.querySelectorAll('.figure-part');
        figureParts.forEach(part => {
            const partName = part.getAttribute('data-part');
            if (character.data.figureParts && character.data.figureParts[partName]) {
                part.classList.add('injured');
            } else {
                part.classList.remove('injured');
            }
        });
    }
    
    setupDotEventListeners(sheet, character) {
        const dots = sheet.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                // Check if dot is locked
                if (e.target.classList.contains('locked')) {
                    return; // Don't allow interaction with locked dots
                }
                
                const dotsContainer = e.target.parentElement;
                const clickedValue = parseInt(e.target.getAttribute('data-value'));
                const field = dotsContainer.getAttribute('data-field');
                
                // Check limits before allowing the action
                const limits = this.calculateDotLimits(character);
                if (limits[field] !== undefined && clickedValue > limits[field]) {
                    return; // Don't allow interaction beyond the limit
                }
                
                // Update character data
                character.data[field] = clickedValue;
                
                // Update all dots in this container
                const allDots = dotsContainer.querySelectorAll('.dot');
                allDots.forEach((dot, index) => {
                    const dotValue = index + 1;
                    if (dotValue <= clickedValue && !dot.classList.contains('locked')) {
                        dot.classList.add('filled');
                    } else if (!dot.classList.contains('locked')) {
                        dot.classList.remove('filled');
                    }
                });
                
                this.saveToStorage();
            });
            
            // Add right-click event for damage dots
            dot.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Prevent default context menu
                
                // Check if dot is locked
                if (e.target.classList.contains('locked')) {
                    return; // Don't allow interaction with locked dots
                }
                
                const dotsContainer = e.target.parentElement;
                const field = dotsContainer.getAttribute('data-field');
                
                // Only handle damage dots and new tracking dots
                if (field === 'stupidDamage' || field === 'lethalDamage' || field === 'mentalDamageBig' || field === 'mentalDamageSmall' || field === 'permanentWill' || field === 'rerolls' || field === 'experience') {
                    const clickedValue = parseInt(e.target.getAttribute('data-value'));
                    
                    // Check limits before allowing the action
                    const limits = this.calculateDotLimits(character);
                    if (limits[field] !== undefined && clickedValue > limits[field]) {
                        return; // Don't allow interaction beyond the limit
                    }
                    
                    // Update character data - unfill from clicked dot onwards
                    character.data[field] = clickedValue - 1;
                    if (character.data[field] < 0) character.data[field] = 0;
                    
                    // Update all dots in this container
                    const allDots = dotsContainer.querySelectorAll('.dot');
                    allDots.forEach((dot, index) => {
                        const dotValue = index + 1;
                        if (dotValue <= character.data[field] && !dot.classList.contains('locked')) {
                            dot.classList.add('filled');
                        } else if (!dot.classList.contains('locked')) {
                            dot.classList.remove('filled');
                        }
                    });
                    
                    this.saveToStorage();
                }
            });
        });
        
        // Setup human figure part event listeners
        const figureParts = sheet.querySelectorAll('.figure-part');
        figureParts.forEach(part => {
            part.addEventListener('click', (e) => {
                const partName = e.target.getAttribute('data-part');
                const characterId = e.target.getAttribute('data-character-id');
                
                // Find the character
                const characterIndex = this.characters.findIndex(c => c.id == characterId);
                if (characterIndex === -1) return;
                
                const currentCharacter = this.characters[characterIndex];
                
                // Toggle the injured state
                currentCharacter.data.figureParts[partName] = !currentCharacter.data.figureParts[partName];
                
                // Update the visual state
                if (currentCharacter.data.figureParts[partName]) {
                    e.target.classList.add('injured');
                } else {
                    e.target.classList.remove('injured');
                }
                
                this.saveToStorage();
            });
        });
    }
    
    setDotsValue(container, value) {
        const dots = container.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            const dotValue = index + 1;
            if (dotValue <= value) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    // Calculate maximum values for damage dots based on character attributes
    calculateDotLimits(character) {
        const limits = {};
        
        // Convert string values to numbers for calculations
        const brawling = parseInt(character.data.brawling) || 0;
        const physique = parseInt(character.data.physique) || 0;
        const permanentWill = parseInt(character.data.permanentWill) || 0;
        
        // lethalDamage and stupidDamage max value = "brawling + physique"
        limits.lethalDamage = brawling + physique;
        limits.stupidDamage = brawling + physique;
        
        // rerolls max value = permanentWill
        limits.rerolls = permanentWill;
        
        return limits;
    }

    // Apply dot limits to a container
    applyDotLimits(container, character) {
        const field = container.getAttribute('data-field');
        const limits = this.calculateDotLimits(character);
        
        if (limits[field] !== undefined) {
            const dots = container.querySelectorAll('.dot');
            const maxValue = limits[field];
            const currentValue = character.data[field] || 0;
            
            dots.forEach((dot, index) => {
                const dotValue = index + 1;
                
                if (dotValue > maxValue || maxValue === 0) {
                    // Lock dots above the limit or if limit is 0
                    dot.classList.add('locked');
                    dot.classList.add('filled');
                    dot.style.cursor = 'not-allowed';
                    dot.style.color = '#999'; // Gray color for locked dots
                } else {
                    // Unlock dots within the limit
                    dot.classList.remove('locked');
                    dot.style.cursor = 'pointer';
                    dot.style.color = ''; // Reset to default color
                    
                    // Set filled state based on current value
                    if (dotValue <= currentValue) {
                        dot.classList.add('filled');
                    } else {
                        dot.classList.remove('filled');
                    }
                }
            });
            
            // If current value exceeds the new limit, reduce it
            if (currentValue > maxValue) {
                character.data[field] = maxValue;
                this.setDotsValue(container, maxValue);
            }
        }
    }
    
    showCharacter(index) {
        // Hide all character sheets
        document.querySelectorAll('.character-sheet').forEach(sheet => {
            sheet.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.character-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected character sheet
        const sheet = document.getElementById(`character-${this.characters[index].id}`);
        if (sheet) {
            sheet.classList.add('active');
        }
        
        // Activate selected tab
        const tab = document.querySelectorAll('.character-tab')[index];
        if (tab) {
            tab.classList.add('active');
        }
        
        this.currentCharacterIndex = index;
    }
    
    openTab(characterId, tabName) {
        const sheet = document.getElementById(`character-${characterId}`);
        if (!sheet) return;
        
        // Hide all tab content
        const tabContents = sheet.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        const tabButtons = sheet.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Show the selected tab content
        const selectedContent = sheet.querySelector(`#${tabName}-${characterId}`);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Add active class to the clicked button
        event.target.classList.add('active');
    }
    
    closeCharacter(index) {
        if (this.characters.length <= 1) {
            alert('Нельзя удалить последний персонаж');
            return;
        }
        
        this.characters.splice(index, 1);
        
        if (this.currentCharacterIndex >= this.characters.length) {
            this.currentCharacterIndex = this.characters.length - 1;
        }
        
        this.saveToStorage();
        this.renderCharacterTabs();
        this.renderCharacterSheets();
        this.showCharacter(this.currentCharacterIndex);
    }
    
    // Update dot limits for all character sheets
    updateDotLimits() {
        this.characters.forEach(character => {
            const sheet = document.getElementById(`character-${character.id}`);
            if (!sheet) return;
            
            const dotsContainers = sheet.querySelectorAll('.dots');
            dotsContainers.forEach(container => {
                const field = container.getAttribute('data-field');
                if (field === 'lethalDamage' || field === 'stupidDamage' || field === 'rerolls') {
                    this.applyDotLimits(container, character);
                }
            });
        });
    }

    saveToStorage() {
        // Update character data from form inputs
        this.characters.forEach(character => {
            const sheet = document.getElementById(`character-${character.id}`);
            if (!sheet) return;
            
            // Update text inputs
            const inputs = sheet.querySelectorAll('input[data-field]');
            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                const index = input.getAttribute('data-index');
                
                if (index !== null) {
                    // Array field (specialties, notes)
                    if (!character.data[field]) {
                        character.data[field] = [];
                    }
                    character.data[field][parseInt(index)] = input.value;
                } else {
                    // Simple field
                    character.data[field] = input.value;
                }
            });
            
            // Update character name from character name field
            const characterNameInput = sheet.querySelector('input[data-field="characterName"]');
            if (characterNameInput) {
                character.name = characterNameInput.value || `Персонаж ${character.id}`;
            }
        });
        
        // Update dot limits after saving
        this.updateDotLimits();
        
        localStorage.setItem('characterSheets', JSON.stringify({
            characters: this.characters,
            nextId: this.nextId
        }));
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('characterSheets');
        if (saved) {
            const data = JSON.parse(saved);
            this.characters = data.characters || [];
            this.nextId = data.nextId || 1;
            
            // Ensure all characters have the figureParts property
            this.characters.forEach(character => {
                if (!character.data.figureParts) {
                    character.data.figureParts = {
                        head: false,
                        leftArm: false,
                        rightArm: false,
                        body: false,
                        leftLeg: false,
                        rightLeg: false
                    };
                }
                
                // Ensure damage fields exist
                if (character.data.stupidDamage === undefined) {
                    character.data.stupidDamage = 0;
                }
                if (character.data.lethalDamage === undefined) {
                    character.data.lethalDamage = 0;
                }
                
                // Ensure mental damage fields exist
                if (character.data.mentalDamageBig === undefined) {
                    character.data.mentalDamageBig = 0;
                }
                if (character.data.mentalDamageSmall === undefined) {
                    character.data.mentalDamageSmall = 0;
                }
                
                // Ensure additional tracking fields exist
                if (character.data.permanentWill === undefined) {
                    character.data.permanentWill = 0;
                }
                if (character.data.rerolls === undefined) {
                    character.data.rerolls = 0;
                }
                
                // Ensure experience field exists
                if (character.data.experience === undefined) {
                    character.data.experience = 0;
                }
            });
        }
    }
    
    exportData() {
        const data = {
            characters: this.characters,
            nextId: this.nextId,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `character-sheets-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    importData() {
        document.getElementById('file-input').click();
    }
    
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.characters && Array.isArray(data.characters)) {
                    this.characters = data.characters;
                    this.nextId = data.nextId || this.nextId;
                    
                    this.saveToStorage();
                    this.renderCharacterTabs();
                    this.renderCharacterSheets();
                    this.showCharacter(0);
                    
                    alert(`Импортировано ${this.characters.length} персонажей`);
                } else {
                    alert('Неверный формат файла');
                }
            } catch (error) {
                alert('Ошибка при импорте файла');
                console.error(error);
            }
        };
        reader.readAsText(file);
        
        // Clear the input
        event.target.value = '';
    }
    
    printCharacter() {
        if (this.characters.length === 0) return;
        
        const currentCharacter = this.characters[this.currentCharacterIndex];
        const sheet = document.getElementById(`character-${currentCharacter.id}`);
        
        if (sheet) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${currentCharacter.name}</title>
                    <link rel="stylesheet" href="style.css">
                    <style>
                        body { margin: 0; padding: 20px; }
                        .character-sheet { box-shadow: none; border: none; }
                    </style>
                </head>
                <body>
                    ${sheet.outerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }
}

// Initialize the character manager when the page loads
let characterManager;
document.addEventListener('DOMContentLoaded', function() {
    characterManager = new CharacterManager();
});
