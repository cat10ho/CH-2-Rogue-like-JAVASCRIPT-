//2024-11-14
//그 뒤에는 엔딩이겠다. 아마 스테이지 1만 만들듯. 
// 진짜로 우선 상인을 만들어 보자꾸나.
//그 뒤 이벤트 2개만 만들자. 미믹 이벤트와 아오 장비추가를 무조건 해야하잖아.
// 그리고 사람 만나는 이벤트. 1/2로 좋은사람 나쁜사람임. 좋은사람이면 지도공유로 진척도 올라가고 나쁜사람이면 뒤통수 맞고 hp까임
// 먼저 선공도 가능. 그럼 피깍고 무조건 싸움.

//3. 상인이 물건을 판다면 살수 있도록.

//그리고 보스도 만들어 보자꾸나. 보스는 특수 스킬이 있으면 좋겠다.
// 뭐 간단하게 반격으로 해보자. 속도가 빨라지고, 반격하는. 그럼 방어가 있어야 겠네.. 아. 에효.. 반격때는 공격을 하면 안되게. 이것만 하고 끝내자.
//보스는 내일 만들고.

//.v13. 플레이어 공격선택 바꿈 이제 1,2명 됨. 아마 3명도 될듯 상점구현함. 이벤트 상점까지 총 4개임
// 보스만 하면 될듯. 데스엔딩이랑. 버그로는 아이템 있는 상태에서 아이템 먹으면 먹어지는데 벗고 입으면 사라짐. 귀여운 버그라 놔두려나.



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

    const event1dialogues1 = [
        `당신은 던전의 어두운 길을 더듬거리며 조심스레 전진하던 중, 갑작스러운 기척을 느꼈다. 
        순간, 음산한 기운과 함께 괴물들이 당신 앞에 모습을 드러냈다. 
        피할 수도 없는 상황에서, 당신은 싸울 준비를 한다. 이곳에서 살아남기 위해선 반드시 이겨야만 한다.`
    ];
    await showDialogue(event1dialogues1, 1000);

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

async function event2(stage, player) {
    const event2dialogues1 = [`당신은 던전의 길을 찾던 중. 인기척에 몸을 숨겼다.
던전에 들어온 사람들 인가 보다.

그들과 접촉하면 던전의 지리에 대해 거래를 할 수 있을지도 모른다.`];
    await showDialogue(event2dialogues1, 1000);
    console.log(`1.지나갈 때까지 기다린다. 2.대화를 시도한다. 3.선공을 한다.`)
    let addprogress = 0;
    let validChoice = false;
    while (!validChoice) {
        const choice = await readlineSync.question();

        switch (choice) {
            case '1':
                console.clear;
                const event2dialogues2 = [`저들이 어떤이인지 알아보는건 좋은일이 아니다.
이곳은 던전이고, 오로지 경쟁자만 있다.

당신은 인기척이 없어질 때까지 기다렸다.`];
                await showDialogue(event2dialogues1, 1000);
                validChoice = true;
                addprogress = 5;
                break;
            case '2':
                console.clear;
                const randomnum = Math.random();
                if (randomnum < 1 / 3) {
                    const event2dialogues3 = [`상대는 당신을 보자 친절히 웃으며 인사한다.
당신은 속으로 경계하며, 던전의 정보를 아냐고 물었고, 놀랍게도 상대는 던전의 정보에 대해 친절히 알려주고 떠났다.`];
                    await showDialogue(event2dialogues3, 1000);
                    addprogress = 20;
                } else {
                    const event2dialogues4 = [`상대는 당신을 보자 비릿히 웃으며 다가온다. 
당신은 직감적으로 싸워야 함을 알았다.`]
                    await showDialogue(event2dialogues3, 1000);

                    let badAdventurer = new Monster('모험가', 100, 0, 30, 10, 0, 2, 20, 1, 5, 100, 200, { HPpotion: 1, MPpotion: 1 }, { plateArmor: { name: '단단한 판금갑옷', pldef: 5, rarity: 5 } }, {
                        slash: function () {
                            return { skillName: "powerful attack", damage: this.atk };
                        }
                    });

                    let monsters = [badAdventurer];

                    const playerWon = await battle(stage, player, monsters);

                    if (!playerWon) {
                        gameover(stage, false); // 엔딩 2
                    } else {
                        addprogress = 20;
                    }
                }
                validChoice = true;
                break;
            case '3':
                console.clear;
                const event2dialogues4 = [`저들은 경쟁자고, 잠재적인 적이다. 언젠간 붙이칠 운명이니. 
유리한 지금 공격하기로 한다.`];
                await showDialogue(event2dialogues4, 1000);
                const event2dialogues5 = [`퍽!.. 뭐 뭐야!;
                                            
상대를 일격에 죽이지 못했으나 처리하기 쉬운 환경이 되었다. 당신은 마무리 짓기위해 달려들었다.`];
                await showDialogue(event2dialogues5, 1000);
                let hurtAdventurer = new Monster('상처입은 모험가', 30, 0, 7, 2, 0, 1, 0, 1, 5, 30, 200, { HPpotion: 1, MPpotion: 1 }, { BloodyplateArmor: { name: '피묻은 판금갑옷', pldef: 3, rarity: 3 } }, {
                    slash: function () {
                        return { skillName: "weak attackk", damage: this.atk };
                    }
                });
                let monsters = [hurtAdventurer];
                const playerWon = await battle(stage, player, monsters);

                if (!playerWon) {
                    gameover(stage, false); // 엔딩 2
                } else {
                    addprogress = 20;
                }
                validChoice = true;
                break;
            default:
            //logs.push(chalk.red('올바른 선택을 하세요.'));
        }
    }
    return addprogress;
}

async function event3(stage, player) {
    const event3dialogues1 = [`지다가다 구석진 곳에 상자가 있다.
        사람이 보기 힘든 곳이라 당신이 처음 발견한것 같다.`];
    await showDialogue(event3dialogues1, 1000);
    console.log(`1.지나간다. 2.상자를 열어본다.`)
    let addprogress = 0;
    let validChoice = false;
    while (!validChoice) {
        const choice = await readlineSync.question();

        switch (choice) {
            case '1':
                console.clear;
                const event3dialogues2 = [`수상한 곳에 상자가 있다는 건 함정일 가능성이 높다.
                    
당신은 그냥 지나가기로 했다.`];
                await showDialogue(event3dialogues2, 1000);
                validChoice = true;
                addprogress = 5;
                break;
            case '2':
                console.clear;
                const randomnum = Math.random();
                if (randomnum < 1 / 3) {
                    const event3dialogues3 = [`상자 안에는 약간의 물품이 있었다.`];
                    await showDialogue(event3dialogues3, 1000);

                    player.gold += 100;
                    console.log(chalk.green(`100 gold를 얻었다.`));

                    const potionType = Math.random() < 0.5 ? 'HPpotion' : 'MPpotion';

                    if (player.item[potionType]) {
                        player.item[potionType] += 1;
                    } else {
                        player.item[potionType] = 1;
                    }

                    console.log(chalk.green(`${potionType}을 1개 얻었다.`));

                    readlineSync.question('\n다음으로 넘어가기');
                    console.clear()

                    addprogress = 10;
                } else {
                    const event3dialogues4 = [`당신은 상자를 열어보려 손을 뻗은 순간. 
상자에 이빨이 돋아나더니 당신에게 달려들었다.`]
                    await showDialogue(event3dialogues4, 1000);

                    let mimic = new Monster('미믹', 200, 0, 20, 20, 0, 1, 20, 1, 5, 100, 300, { HPpotion: 2, MPpotion: 1 }, { plateArmor: { name: '단단한 판금갑옷', pldef: 5, rarity: 5 } }, {
                        slash: function () {
                            return { skillName: "powerful bite", damage: this.atk };
                        }
                    });

                    let monsters = [mimic];

                    const playerWon = await battle(stage, player, monsters);

                    if (!playerWon) {
                        gameover(stage, false); // 엔딩 2
                    } else {
                        addprogress = 20;
                    }
                }
                validChoice = true;
                break;
            default:
            //logs.push(chalk.red('올바른 선택을 하세요.'));
        }
    }
    return addprogress;
}

async function shop(player) {
    const items = [
        { name: 'HP 포션', type: 'item', effect: 'HPpotion', amount: 1, gold: 50 },
        { name: 'MP 포션', type: 'item', effect: 'MPpotion', amount: 1, gold: 50 },
        { name: '나무 갑옷', type: 'equipment', details: { name: '나무 갑옷', pldef: 2, rarity: 2 }, gold: 100 }
    ];

    while (true) {
        items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name} - ${item.gold} 골드`);
        });
        console.log(`${items.length + 1}. 나가기`);

        const choice = await readlineSync.question('구매할 아이템 번호를 입력하세요: ');

        if (parseInt(choice) === items.length + 1) {
            console.log("상점을 나갑니다.");
            break;
        }

        const selectedItem = items[parseInt(choice) - 1];

        if (!selectedItem) {
            console.log("잘못된 선택입니다.");
            return;
        }

        if (player.gold >= selectedItem.gold) {
            player.gold -= selectedItem.gold;
            if (selectedItem.type === 'item') {
                // item의 경우 'potion'을 추가
                const potionKey = selectedItem.effect;
                player.item[potionKey] = (player.item[potionKey] || 0) + selectedItem.amount; // 기존 값에 추가
            } else if (selectedItem.type === 'equipment') {
                // equipment의 경우 wear에 추가
                player.Equipment[selectedItem.details.name] = selectedItem.details;
            }
            console.clear()
            console.log(`${selectedItem.name}을(를) 구매하였습니다. 남은 골드: ${player.gold}`);
        } else {
            console.clear()
            console.log("골드가 부족하여 아이템을 구매할 수 없습니다.");
        }
    }
}








async function event4(stage, player) {
    const event4dialogues1 = [`던전을 지나 어두운 길을 따라가는 중, 갑자기 당신 앞에 수상하게 생긴 남자가 나타난다. 
그의 옷은 낡고 먼지투성이지만, 그 눈빛은 어딘가 날카롭고 계산적이었다. 그가 입가에 미소를 띠며 말을 건다.

“물건 사고 가시지요. 던전을 탐험하신다면 필요하실 겁니다.”`];
    await showDialogue(event4dialogues1, 1000);
    console.log(`1.지나간다. 2.물건을 둘러본다. 3. 공격한다.`)
    let addprogress = 0;
    let validChoice = false;
    while (!validChoice) {
        const choice = await readlineSync.question();

        switch (choice) {
            case '1':
                console.clear;
                const event4dialogues2 = [`당신은 그냥 지나가기로 했다.
                    
남자는 미소를 지으며 어디론가 사라진다. 그의 마지막 말이 어둠 속에서 희미하게 들려온다.
"결국 다시 찾게 될 겁니다… 그때까지 무사하시길."`];
                await showDialogue(event4dialogues2, 1000);
                validChoice = true;
                addprogress = 5;
                break;
            case '2':
                console.clear;
                const event4dialogues3 = [`천천히 보시길.`];
                await showDialogue(event4dialogues3, 1000);

                await shop(player);

                console.clear()
                const event4dialogues4 = [`살펴 가십시오.`];
                await showDialogue(event4dialogues4, 1000);

                validChoice = true;
                break;

            case '3':
                const event4dialogues5 = [`당신은 욕망에 휩사여 남자를 공격했다.`]
                await showDialogue(event4dialogues5, 1000);

                let shopkeeper = new Monster('상점주인', 100, 0, 700, 20, 0, 1, 20, 1, 5, 100, 300, { HPpotion: 2, MPpotion: 1 }, { plateArmor: { name: '단단한 판금갑옷', pldef: 5, rarity: 5 } }, {
                    slash: function () {
                        return { skillName: "dath", damage: this.atk };
                    }
                });

                let monsters = [shopkeeper];

                const playerWon = await battle(stage, player, monsters);

                if (!playerWon) {
                    gameover(stage, false); // 엔딩 2
                } else {

                }
                validChoice = true;
                break;
            default:
            //logs.push(chalk.red('올바른 선택을 하세요.'));
        }
    }
    return addprogress;
}

async function event5(stage, player) {

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
                // 몬스터 목록 출력
                monsters.forEach((monster, index) => {
                    console.log(chalk.green(`${index + 1}. ${monster.name}`));
                });
                const targetIndex = await readlineSync.question('공격할 몬스터를 선택하세요: ');
                const target = monsters[parseInt(targetIndex) - 1]; // 선택한 몬스터

                if (target && target.hp > 0) {
                    let damage = player.attack(player.atk);
                    const dealtDamage = await damageCalculation(player, target, damage);
                    target.hp -= dealtDamage;  // 몬스터 객체의 체력을 바로 수정
                    validChoice = true;
                } else {
                    logs.push(chalk.red('올바른 몬스터를 선택하세요.'));
                    updateDisplay(player, monsters);
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
                        monsters.forEach((monster, index) => {
                            console.log(chalk.green(`${index + 1}. ${monster.name}`));
                        });
                        const targetIndex = await readlineSync.question('공격할 몬스터를 선택하세요: ');
                        const target = monsters[parseInt(targetIndex) - 1]; // 선택한 몬스터

                        if (target && target.hp > 0) {
                            const dealtDamage = await damageCalculation(player, target, damage);
                            target.hp -= dealtDamage;  // 몬스터 객체의 체력을 바로 수정
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
                updateDisplay(player, monsters);
        }
    }
}

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
                    const events = [event1,event2,event3,event4];// 여기에 이벤트 개수 추가.
                    const randomEvent = events[Math.floor(Math.random() * events.length)];
                    progress += await randomEvent(stage, player);
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


