//2024-11-14
//그 뒤에는 엔딩이겠다. 아마 스테이지 1만 만들듯. 
// 진짜로 우선 상인을 만들어 보자꾸나.
//그 뒤 이벤트 2개만 만들자. 미믹 이벤트와 아오 장비추가를 무조건 해야하잖아.
// 그리고 사람 만나는 이벤트. 1/2로 좋은사람 나쁜사람임. 좋은사람이면 지도공유로 진척도 올라가고 나쁜사람이면 뒤통수 맞고 hp까임
// 먼저 선공도 가능. 그럼 피깍고 무조건 싸움.

//1. 얻은 아이템이 같다면 얻지 않도록.
//2. 골드를 먹을수 있도록.
//3. 상인이 물건을 판다면 살수 있도록.

//그리고 보스도 만들어 보자꾸나. 보스는 특수 스킬이 있으면 좋겠다.
// 뭐 간단하게 반격으로 해보자. 속도가 빨라지고, 반격하는. 그럼 방어가 있어야 겠네.. 아. 에효.. 반격때는 공격을 하면 안되게. 이것만 하고 끝내자.
//보스는 내일 만들고.

//.v11 1. 창과 대사 정리중... 정리 끝.


import chalk from 'chalk';
import readlineSync from 'readline-sync';

var logs = [];

class Player {
    constructor(name, hp = 100, mp = 100, atk = 10, def = 5, dodge = 5, speed = 3, critical = 20, level = 0, exp = 0, hit = 95, gold = 200) {
        this.name = name;
        this.hp = hp; //체력
        this.mp = mp; // 마나
        this.atk = atk; // 공격력1
        this.def = def; // 방어력
        this.dodge = dodge; // 회피력
        this.speed = speed; //속도
        this.critical = critical; //크리티컬 
        this.level = level; // 레벨
        this.exp = exp; //경험 
        this.hit = hit; //적중률
        this.gold = gold;
        this.wear = { ClothArmor: { name: '천갑옷.', pldef: 2, rarity: 1 } }
        this.item = { HPpotion: 1, MPpotion: 1 }
        this.Equipment = {}
        this.skills = {
            effects: () => {
                const mpCost = 30; // 스킬 사용 시 마나 소모량
                return {
                    skillName: "Effects",
                    damage: 2 * this.atk, // 공격력의 두 배 데미지
                    mpCost: mpCost
                };
            }
        };

    }

    attack(atk) {
        return atk
    }
}

class Monster {
    constructor(name, hp = 100, mp = 100, atk = 10, def = 5, dodge = 5, speed = 2, critical = 20, level = 0, exp = 0, hit = 95, gold = 0, item = {}, Equipment = {}, skills = {}) {
        this.name = name;
        this.hp = hp; //체력
        this.mp = mp; // 마나
        this.atk = atk; // 공격력
        this.def = def; // 방어력
        this.dodge = dodge; // 회피력
        this.speed = speed; //속도
        this.critical = critical; //크리티컬 
        this.level = level; // 레벨
        this.exp = exp; //경험 
        this.hit = hit; //적중률
        this.gold = gold;
        this.item = item
        this.Equipment = Equipment
        this.skills = skills; // 몬스터가 배울 스킬들
    }

    attack() {
        return this.atk;
    }

    useSkill(skillName) {
        const skill = this.skills.find(s => s.skillName === skillName);
        if (skill) {
            return skill.damage;
        }
        return 0;
    }
}

function isHit(attacker, defender) {
    const hitChance = Math.random() * 100;
    return hitChance <= attacker.hit - defender.dodge;
}//

async function damageCalculation(attacker, defender, damage) {
    if (!isHit(attacker, defender)) {
        logs.push(chalk.red(`${attacker.name}의 공격이 빗나갔다!`));
        return 0;
    } else {
        let AttackDamage = damage - defender.def;
        if (AttackDamage < 0) AttackDamage = 0;

        if (Math.random() * 100 < attacker.critical) {
            AttackDamage *= 2;
            logs.push(chalk.red(`${attacker.name}의 크리티컬 히트!
${defender.name}에게 ${AttackDamage}의 데미지!`));
        } else {
            logs.push(chalk.green(`${attacker.name}이 ${defender.name}에게 ${AttackDamage}의 데미지!`));
        }
        return AttackDamage;
    }
}//

async function createName() {
    console.clear();
    console.log('이름을 입력해 주세요.')
    let name = readlineSync.question('입력: ');
    return name;
};//

function showDialogue(dialogues, delay = 1000) {
    return new Promise(async (resolve) => {
        console.clear();
        for (const line of dialogues) {
            console.log(line);
            await new Promise((res) => setTimeout(res, delay));
        }
        readlineSync.question('\n 다음으로 넘어가기.');
        resolve();
    });
}//

async function intro() {
    const dialogues1 = [`당신은 깊은 숨을 내쉬며, 던전의 입구 앞에 섰다.
그곳은 마치 오래된 비밀을 간직한 채, 어둠 속에 숨어있는 듯한 기운이 느껴지는 장소였다.

입구로 들어서기 전, 잠시 동안 당신은 목표를 되새겼다. 
이 던전의 최하층에는 소원을 이루어주는 보물이 있다고 한다. 
수많은 사람들이 그 보물을 찾기 위해 목숨을 걸었지만, 그 누구도 무사히 돌아오지 못했다는 전설이 있었다.`
    ];
    const dialogues2 = [
        `하지만 당신은 다른 사람들과 다르다. 이 소원을 이루어야만 한다.
더 이상 주저할 시간이 없다. 그 어떤 고난도 이겨낼 각오가 되어 있었다. 
그 어떤 어둠도, 그 어떤 괴물도 당신의 목표를 방해할 수 없다.`
    ];

    const dialogues3 = [
        `마음속에 굳은 결심을 품고, 당신은 던전의 입구를 향해 발을 내딛는다. 
어두운 통로는 깊고 음침하지만, 당신은 멈추지 않는다. 

최하층에 숨겨진 그 보물이 기다리고 있음을 알고 있기에, 
한 발 한 발 내딛는 발걸음은 결코 흔들리지 않는다.`
    ];
    const dialogues4 = [
        `이제 당신은 더 이상 되돌아갈 길이 없다. 
보물이 있는 곳, 소원을 이루어줄 그곳을 향해, 깊은 던전 속으로 나아간다.
`
    ];
    await showDialogue(dialogues1, 1000);
    await showDialogue(dialogues2, 1000);
    await showDialogue(dialogues3, 1000);
    await showDialogue(dialogues4, 1000);
}//

async function event1(stage, player) {
    let addprogress = 0;

    let Goblin = new Monster('Goblin', 30, 0, 9, 5, 0, 1, 20, 1, 5, 100, 20, { HPpotion: 1, MPpotion: 1 }, { ShabbyClothArmor: { name: '허름한 천갑옷', pldef: 1, rarity: 1 } }, {
        slash: function () {
            return { skillName: "slash", damage: this.atk };
        }
    });
    let Skeleton = new Monster('Skeleton', 50, 0, 15, 10, 0, 1, 20, 1, 20, 100, 100, { HPpotion: 1, MPpotion: 1 }, { Solidbonearmor: { name: '단단한 뼈갑옷', pldef: 3, rarity: 3 } }, {
        boneThrow: function () {
            return { skillName: "boneThrow", damage: this.atk }
        }
    });
    let slime = new Monster('slime', 10, 0, 8, 0, 0, 1, 20, 1, 20, 100, 0, {}, {}, {
        slimeattack: function () {
            return { skillName: "slimeattack", damage: this.atk }
        }
    });

    let monsters = [Goblin, Skeleton];
    const playerWon = await battle(stage, player, monsters);

    if (!playerWon) {
        gameover(stage, false); // 엔딩 1
    } else {
        addprogress = 50;
    }
    return addprogress;
}
async function event2(stage, player){

}


function updateDisplay(player, monsters) {
    console.clear();
    console.log(`Player: ${player.name}, HP: ${player.hp},  MP: ${player.mp}`);
    monsters.forEach((monster, index) => {
        console.log(`Monster ${index + 1}: ${monster.name}, HP: ${monster.hp}`);
    });

    while (logs.length > 4) { logs.shift() };
    logs.forEach((log) => console.log(log));
}

function playereDisplay(player) {
    console.clear();
    const wearItemName = Object.values(player.wear)[0]?.name || "장비 없음";
    console.log(`Player: ${player.name}, HP: ${player.hp}, MP: ${player.mp}, def:${player.def},
       착용중인 장비: ${wearItemName} gold: ${player.gold} `);

    while (logs.length > 4) { logs.shift() };
    logs.forEach((log) => console.log(log));
}//

async function playerAttackmethod(player, monsters) {

    let validChoice = false; //옳은 선택지 넣으면 바뀜
    while (!validChoice) {
        console.log(chalk.green(`\n1. 일반공격 2. 스킬을 사용한다.`));
        const choice = await readlineSync.question('당신의 선택은? ');
        switch (choice) {
            case '1': // 일반공격
                console.log(chalk.green(`1. ${monsters[0].name} 2. ${monsters[1].name}`));
                const target = await readlineSync.question('공격할 몬스터를 선택하세요: ');

                let damage;
                if (target === '1' && monsters[0].hp > 0) {
                    damage = player.attack(player.atk);
                    const dealtDamage = await damageCalculation(player, monsters[0], damage);
                    monsters[0].hp -= dealtDamage;
                    validChoice = true;
                } else if (target === '2' && monsters[1].hp > 0) {
                    damage = player.attack(player.atk);
                    const dealtDamage = await damageCalculation(player, monsters[1], damage);
                    monsters[1].hp -= dealtDamage;
                    validChoice = true;
                } else {
                    logs.push(chalk.red('올바른 몬스터를 선택하세요.'));
                    updateDisplay(player, monsters)
                }
                break;

            case '2': // 스킬 사용
                const skillList = Object.keys(player.skills).map((skill, index) => `${index + 1}. ${skill}`).join(' ');
                console.log(chalk.green(`\n스킬 선택: ${skillList}`));
                const skillChoice = await readlineSync.question('사용할 스킬을 선택하세요 (번호): ');

                const skillIndex = parseInt(skillChoice) - 1; // 번호 입력을 인덱스로 변환
                if (skillIndex >= 0 && skillIndex < Object.keys(player.skills).length) {
                    const skill = player.skills[Object.keys(player.skills)[skillIndex]];
                    const { mpCost, damage } = skill(); // 스킬의 마나 소모량을 가져옴

                    if (player.mp >= mpCost) {
                        player.mp -= mpCost; // 마나 차감
                        console.log(chalk.green(`\n스킬이 발동되었습니다!`));
                        console.log(chalk.green(`1. ${monsters[0].name} 2. ${monsters[1].name}`));
                        const target = await readlineSync.question('공격할 몬스터를 선택하세요: ');

                        let dealtDamage;
                        if (target === '1' && monsters[0].hp > 0) {
                            dealtDamage = await damageCalculation(player, monsters[0], damage);
                            monsters[0].hp -= dealtDamage;
                            validChoice = true;
                        } else if (target === '2' && monsters[1].hp > 0) {
                            dealtDamage = await damageCalculation(player, monsters[1], damage);
                            monsters[1].hp -= dealtDamage;
                            validChoice = true;
                        } else {
                            logs.push(chalk.red('올바른 몬스터를 선택하세요.'));
                        }
                    } else {
                        logs.push(chalk.red('마나가 부족합니다.'));
                    }
                } else {
                    logs.push(chalk.red('잘못된 번호입니다.'));
                }
                break;

            default:
                logs.push(chalk.red('올바른 선택을 하세요.'));

                updateDisplay(player, monsters)
        }
    }
}//

async function monsterAttackmethod(player, monster) {
    if (monster.hp <= 0) return;

    let selectedSkill;
    const skillNames = monster.skills ? Object.keys(monster.skills) : [];
    if (skillNames.length > 0) {
        const randomIndex = Math.floor(Math.random() * skillNames.length);
        selectedSkill = monster.skills[skillNames[randomIndex]](monster.atk);
    } else {
        selectedSkill = null;
    }

    let damage;
    if (selectedSkill && monster.mp >= selectedSkill.mpCost) {
        monster.mp -= selectedSkill.mpCost;
        damage = selectedSkill.damage;
    } else {
        damage = monster.atk;
    }

    const dealtDamage = await damageCalculation(monster, player, damage);
    player.hp -= dealtDamage;
}//

async function getItem(player, monsters) {
    console.clear()
    console.log(chalk.green('\n몬스터를 쓰러트렸다.'))
    monsters.forEach(monster => {
        console.log(chalk.green(`\n${monster.name}에게서`))
        player.gold += monster.gold;
        console.log(chalk.green(`${monster.gold} gold를 얻었다.`));

        // 아이템 처리
        for (let item in monster.item) {
            if (player.item[item]) {
                player.item[item] += monster.item[item];
                console.log(chalk.green(`${item} 을 ${monster.item[item]}개 만큼 얻었다.`));
            } else {
                player.item[item] = monster.item[item];
                console.log(chalk.green(`${item} 을 ${monster.item[item]}개 만큼 얻었다.`));
            }
        }

        for (let equipment in monster.Equipment) {
            const rarity = monster.Equipment[equipment].rarity;
            const dropRate = 1 / rarity;


            if (Math.random() < dropRate) {
                if (player.Equipment.hasOwnProperty(equipment)) {
                    console.log(chalk.red(`${monster.Equipment[equipment].name} 를 획득했으나 이미 있다.`));
                } else {
                    player.Equipment[equipment] = monster.Equipment[equipment];
                    console.log(chalk.green(`${monster.Equipment[equipment].name} 를 획득했다.`));
                }
            }
        }
        readlineSync.question('\n다음으로 넘어가기');
        console.clear()
    });
 
}//

async function battle(stage, player, monsters) {
    const orderOfBattle = [{ ...player, type: 'player' }];

    // 원본 monsters 배열의 각 객체에 직접 type 속성을 추가
    monsters.forEach(monster => {
        monster.type = 'monster';
        orderOfBattle.push(monster);
    });

    orderOfBattle.sort((a, b) => {
        if (b.speed === a.speed) {
            return Math.random() < 0.5 ? 1 : -1; // 속도가 같으면 랜덤하게 순서 결정
        }
        return b.speed - a.speed; // 속도에 따라 내림차순 정렬
    });

    while (player.hp > 0 && monsters.some(monster => monster.hp > 0)) { // 몬스터가 살아있는 동안
        updateDisplay(player, monsters);

        for (let i = 0; i < orderOfBattle.length; i++) {
            const unit = orderOfBattle[i];
            if (unit.type === 'player' && unit.hp > 0) {
                await playerAttackmethod(player, monsters); // 플레이어 공격 처리
            } else if (unit.type === 'monster' && unit.hp > 0) {
                await monsterAttackmethod(player, unit); //몬스터 공격 처리
            }
        }
    }

    logs = [];
    if (player.hp <= 0) {
        return false;
    } else {
        getItem(player, monsters);
        return true;
    }

}// 

async function useItem(player, itemName) {
    if (player.item[itemName] > 0) {
        switch (itemName) {
            case 'HPpotion':
                player.hp = Math.min(player.hp + 50, 100);
                player.item[itemName]--;
                logs.push(chalk.green(`${player.name} 의 hp가 회복됬다.`));
                break;
                case 'MPpotion':
                player.hp = Math.min(player.mp + 50, 100);
                player.item[itemName]--;
                logs.push(chalk.green(`${player.name} 의 mp가 회복됬다.`));
                break;
        }
    } else {
        logs.push(chalk.red(`아이템 없음.`));
    }
}//

async function itemstage(player) {

    logs.push(chalk.green(`무엇을 사용할까.`));
    while (true) {
        playereDisplay(player)

        const items = Object.keys(player.item);
        const itemList = items.map((item, index) => `${index + 1}. ${item} (x${player.item[item]})`).join(' ') + ` ${items.length + 1}. 되돌아 가기`;
        console.log(chalk.green(`\n아이템 선택: ${itemList}`));

        const itemNumber = parseInt(await readlineSync.question('사용할 아이템을 선택해 주세요: '), 10);

        if (itemNumber === items.length + 1) {
            break;
        }

        const itemName = items[itemNumber - 1];

        if (itemName) {
            await useItem(player, itemName);
        } else {
            logs.push(chalk.red("잘못된 선택입니다. 다시 선택해 주세요."));
            console.clear();
        }
    }
    logs = [];
}//

async function clothEquipment(player) {
    const equipment = Object.keys(player.wear)[0];
    if (!equipment) {
        logs.push(chalk.red('벗을 장비가 없습니다.'));
    } else {
        const item = player.wear[equipment];
        player.def -= item.pldef;

        player.Equipment[equipment] = item;

        delete player.wear[equipment];

        logs.push(chalk.red(`${item.name}을 벗었습니다. 방어력이 ${item.pldef}만큼 감소했습니다.`));
    }


}//

async function useEquipment(player, EquipmentName) {
    if (player.Equipment[EquipmentName]) {
        if (Object.keys(player.wear).length > 0) {
            await clothEquipment(player);
        }

        const newItem = player.Equipment[EquipmentName];

        player.def += newItem.pldef;
        player.wear[EquipmentName] = newItem;

        delete player.Equipment[EquipmentName];

        logs.push(chalk.green(`${newItem.name}을 착용했습니다. 방어력이 ${newItem.pldef}만큼 증가했습니다.`));
    } else {
        logs.push(chalk.red("해당 장비가 없습니다."));
    }
}//

async function Equipmentstage(player) {

    logs.push(chalk.green(`\n무엇을 입을까.`));

    while (true) {
        playereDisplay(player)

        const Equipments = Object.keys(player.Equipment);
        const EquipmentList = Equipments.map((name, index) => `${index + 1}. ${player.Equipment[name].name}`).join(' ') + ` ${Equipments.length + 1}. 되돌아 가기`;
        console.log(chalk.green(`\n아이템 선택: ${EquipmentList}`));

        const EquipmentNumber = parseInt(await readlineSync.question('사용할 아이템을 선택해 주세요: '), 10);

        if (EquipmentNumber === Equipments.length + 1) {
            break;
        }

        const EquipmentName = Equipments[EquipmentNumber - 1];

        if (EquipmentName) {
            console.clear();
            await useEquipment(player, EquipmentName);

        } else {
            logs.push(chalk.red("잘못된 선택입니다. 다시 선택해 주세요."));
            console.clear();
        }
    }
    logs = [];
}//

async function main(player, stage) {
    let progress = 0;
    while (progress < 100) {
        console.clear()
        playereDisplay(player);
        console.log(`던전 ${stage} 층`);
        console.log(`탐험도 : ${progress}`);
        console.log(`1.길을 찾는다. 2.아이템을 사용한다. 3.장비를 변경한다.`)

        let validChoice = false;
        while (!validChoice) {
            const choice = await readlineSync.question();

            switch (choice) {
                case '1':
                    console.clear;
                    const events = [event1];// 여기에 이벤트 개수 추가.
                    const randomEvent = events[Math.floor(Math.random() * events.length)];
                    progress +=await randomEvent(stage, player);
                    validChoice = true;
                    break;
                case '2':
                    console.clear;
                    await itemstage(player)
                    validChoice = true;
                    break;
                case '3':
                    console.clear;
                    await Equipmentstage(player)
                    validChoice = true;
                    break;
                default:
                //logs.push(chalk.red('올바른 선택을 하세요.'));
            }
        }
    }
} //

export async function startGame() {
    let name;
    await intro();
    name = await createName();
    const player = new Player(name, 100, 100, 100, 5, 5, 2, 10, 0, 0, 95);
    let stage = 1;
    let progress = 0;
    logs = [];
    main(player, stage, progress);
} //

startGame()


