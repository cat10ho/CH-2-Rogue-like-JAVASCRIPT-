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
} //플레이어 클래스

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
} //몬스터 클래스.

function isHit(attacker, defender) {
    const hitChance = Math.random() * 100;
    return hitChance <= attacker.hit - defender.dodge;
}// 빗나감 계산 함수.

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
}//데미지 계산 함수. 적중율에 따라 빗나감.

async function createName() {
    console.clear();
    console.log('이름을 입력해 주세요.')
    let name = readlineSync.question('입력: ');
    return name;
};// 이름 넣는 함수. 히로인 넣을때 추가하려 했는데 일주일은 너무 짧다.

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
}// 대사 나오고 아무키 누르면 넘어가는 함수. 너무 오래전에 만들어서 정확히는 기억이 안남 ㅋㅋ

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
}//인트로

async function gameover(stage) {
   const gameoverdialogues1 =[
    `전투에서 패배한 당신은 결국 쓰러지고 말았다. 
    
던전의 어두운 구석에 쓰러진 당신의 목표는 무너져 버렸고, 
그 흔적조차 사라져버렸다. 이제 던전은 당신의 마지막 집이 되었고, 
당신을 기억해줄 사람도 없을 것이다. 
그저 던전의 한 부분으로, 어둠 속에 묻힌 채 끝이 난다.`
];

   await showDialogue(gameoverdialogues1,1000)
   process.exit(); 
}//게임오버

async function gameend(stage){
    const gameenddialogues1 =[
        `골렘은 육중한 소리를 내며 무너져 내렸고, 그 뒤로 숨겨져 있던 계단이 모습을 드러냈다. 
계단은 마치 악몽 속에서 본 듯한 불길한 어둠에 휩싸여 있었고, 그 끝이 어디로 이어지는지 알 수 없었다.
`];
const gameenddialogues2 =[
    `하지만 당신은 한 치의 망설임도 없이 앞으로 나아간다. 
이 여정을 시작할 때부터 각오했던 바였다. 어떤 적이 나타나더라도, 어떤 고난이 기다리고 있더라도 당신은 멈추지 않을 것이다.
`];

const gameenddialogues3 =[
    `최하층에 숨겨진 소원을 이루어줄 보물이 있다는 전설을 가슴에 새기며, 
당신은 천천히 그러나 결연한 발걸음으로 계단을 내려가기 시작한다. 깊어지는 어둠 속으로 한 걸음 한 걸음 나아가는 당신의 결의는 더욱 단단해져만 갔다.
`];

const gameenddialogues4 =[
    `플레이 해주셔서 감사합니다.
`];

    
       await showDialogue(gameenddialogues1,1000);
       await showDialogue(gameenddialogues2,1000);
       await showDialogue(gameenddialogues3,1000);
       await showDialogue(gameenddialogues4,1000);
       process.exit(); 
}//엔딩

async function event1(stage, player) {

    const event1dialogues1 = [
        `당신은 던전의 어두운 길을 더듬거리며 조심스레 전진하던 중, 갑작스러운 기척을 느꼈다. 
        순간, 음산한 기운과 함께 괴물들이 당신 앞에 모습을 드러냈다. 
        피할 수도 없는 상황에서, 당신은 싸울 준비를 한다. 이곳에서 살아남기 위해선 반드시 이겨야만 한다.`
    ];
    await showDialogue(event1dialogues1, 1000);

    let addprogress = 0;

    let Goblin = new Monster('Goblin', 30, 0, 9, 5, 0, 1, 20, 1, 5, 100, 20, { HPpotion: 1, MPpotion: 1 }, { ShabbyClothArmor: { name: '허름한 천갑옷', pldef: 1, rarity: 1 } }, {
        slash: {
            mpCost: 0,
            execute: function () {
                return { skillName: "slash", damage: this.atk, mpCost: this.mpCost };
            }
        }
    });

    let Skeleton = new Monster('Skeleton', 50, 0, 15, 10, 0, 1, 20, 1, 20, 100, 100, { HPpotion: 1, MPpotion: 1 }, { Solidbonearmor: { name: '단단한 뼈갑옷', pldef: 3, rarity: 3 } }, {
        boneThrow: {
            mpCost: 0,
            execute: function () {
                return { skillName: "boneThrow", damage: this.atk, mpCost: this.mpCost };
            }
        }
    });
    let slime = new Monster('slime', 10, 0, 8, 0, 0, 1, 20, 1, 20, 100, 0, {}, {}, {
        slimeattack:{
            mpCost: 0,
            execute: function () {
                return { skillName: "slimeattack", damage: this.atk, mpCost: this.mpCost }
            }

        } 
    });

    let monsters = [Goblin, Skeleton];
    const playerWon = await battle(stage, player, monsters);

    if (!playerWon) {
        await gameover(stage);
    } else {
        addprogress = 20;
    }
    return addprogress;
}// 습격 이벤트

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
                await showDialogue(event2dialogues2, 1000);
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
                    await showDialogue(event2dialogues4, 1000);

                    let badAdventurer = new Monster('모험가', 100, 0, 30, 10, 0, 2, 20, 1, 5, 100, 200, { HPpotion: 1, MPpotion: 1 }, { plateArmor: { name: '단단한 판금갑옷', pldef: 5, rarity: 5 } }, {
                        slash: {
                            mpCost: 0,
                            execute: function () {
                            return { skillName: "powerful attack", damage: this.atk, mpCost: this.mpCost };
                        }
                        }
                    });

                    let monsters = [badAdventurer];

                    const playerWon = await battle(stage, player, monsters);

                    if (!playerWon) {
                        await gameover(stage);  // 엔딩 2
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
                    slash:{ mpCost: 0,
                        execute:function () {
                            return { skillName: "weak attackk", damage: this.atk, mpCost: this.mpCost };
                        }
                    } 
                });
                let monsters = [hurtAdventurer];
                const playerWon = await battle(stage, player, monsters);

                if (!playerWon) {
                    await gameover(stage); // 엔딩 2
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
}//지나가는 모험가 이벤트.

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
                        slash:{  mpCost: 0,
                            execute: function () {
                                return { skillName: "powerful bite", damage: this.atk, mpCost:  this.mpCost };
                            }

                        } 
                    });

                    let monsters = [mimic];

                    const playerWon = await battle(stage, player, monsters);

                    if (!playerWon) {
                        await gameover(stage);
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
} //미믹 이벤트 별거 없다.

async function shop(player) {
    const items = [
        { name: 'HP 포션', type: 'item', effect: 'HPpotion', amount: 1, gold: 50 },
        { name: 'MP 포션', type: 'item', effect: 'MPpotion', amount: 1, gold: 50 },
        { name: '나무 갑옷', type: 'equipment', details: { name: '나무 갑옷', pldef: 2, rarity: 2 }, gold: 100 }
    ]; //판매 물품 배열.

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
            if (selectedItem.type === 'item') {// 아이템일때.
                const potionKey = selectedItem.effect;
                player.item[potionKey] = (player.item[potionKey] || 0) + selectedItem.amount; // 기존 값에 추가
            } else if (selectedItem.type === 'equipment') {//장비일때.
                player.Equipment[selectedItem.details.name] = selectedItem.details; //장비칸에 추가.
            }
            console.clear()
            console.log(`${selectedItem.name}을(를) 구매하였습니다. 남은 골드: ${player.gold}`);
        } else {
            console.clear()
            console.log("골드가 부족하여 아이템을 구매할 수 없습니다.");
        }
    }
} //물건을 사는 이벤트. 물건은 추가할 수 있긴 한데. 일단 아이템과 장비만.

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
                    slash:{ mpCost: 0,
                        execute:function () {
                            return { skillName: "dath", damage: this.atk, mpCost: this.mpCost };
                        }
                    }
                });

                let monsters = [shopkeeper];

                const playerWon = await battle(stage, player, monsters);

                if (!playerWon) {
                    await gameover(stage);
                } else {
                    addprogress = 50;
                }
                validChoice = true;
                break;
            default:
            //logs.push(chalk.red('올바른 선택을 하세요.'));
        }
    }
    return addprogress;
}// 상인 이벤트. 물건을 살 수 있다. 

async function stageboss(stage, player) {
    const bossdialogues1 = [`당신은 던전 깊숙한 곳으로 향하던 중, 갑자기 거대한 구조물을 발견한다. 
그 구조물은 마치 이 던전의 오랜 비밀을 숨기고 있는 듯한 인상을 준다. 
구조물 뒤에는 보물을 향한 마지막 단서처럼, 더 깊은 곳으로 내려갈 수 있는 계단이 있다.`];

    const bossdialogues2 =[`당신은 목표를 되새기며 그 계단을 향해 한 걸음씩 다가간다. 
소원을 이루어줄 보물이 기다리고 있는 그곳으로. 
그러나, 계단 앞에 다다르려는 순간, 구조물이 갑자기 움직이기 시작한다.`];

    const bossdialogues3 =[`그 구조물은 골렘이었다. 거대한 몸체와 날카로운 돌로 이루어진 골렘은 
침입자를 막기 위해 일어섰고, 그 몸에서 흘러나오는 차가운 기운은 
마치 던전의 모든 어둠을 품고 있는 듯하다. `];

    const bossdialogues4 =[`당신은 이 싸움이 결코 쉬운 싸움이 아님을 직감한다.
그러나 당신은 자신의 목표를 상기하며, 마음속에 굳은 결심을 다진다.
         
골렘은 무시무시한 속도로 다가오며, 땅을 울리며 발걸음을 내디딘다. 
당신은 숨을 깊이 들이쉬며, 단단히 고정된 발을 뗀다.`];


    await showDialogue(bossdialogues1, 1000);
    await showDialogue(bossdialogues2, 1000);
    await showDialogue(bossdialogues3, 1000);
    await showDialogue(bossdialogues4, 1000);

    let stage1boss = new Monster('골렘', 500, 0, 10, 20, 0, 5, 0, 1, 5, 100, 500, { HPpotion: 2, MPpotion: 1 }, { plateArmor: { name: '강력한 갑옷', pldef: 10, rarity: 5 } }, {

        attack: {
            mpCost: 0,
            execute: function () {
                logs.push(chalk.red('기본공격을 하였다.'));
                return { skillName: "attack", damage: this.atk, mpCost: this.mpCost };
            }
        },
    
        readiness: {
            mpCost: 0,
            execute: function () {
                this.mp += 30;
                this.speed -= 4;
                logs.push(chalk.red('강력한 공격을 준비한다., 속도가 느려졌다.'));
                return { skillName: "readiness", damage: 0, mpCost: this.mpCost };
            }
        },
    
        counteroffensive: {
            mpCost: 30,
            execute: function () {
                this.speed += 4;
                logs.push(chalk.red('쾅!!!!!'));
                return { skillName: "counteroffensive", damage: 20 * this.atk, mpCost: this.mpCost };
            }
        }
    });

    let monsters = [stage1boss];

    const playerWon = await battle(stage, player, monsters);

    if (!playerWon) {
        await gameover(stage); // 엔딩 1
    } else {
        await gameend(stage);
    }
    return addprogress;


} //보스 이벤트임. 끝나면 엔딩.

function updateDisplay(player, monsters) {
    console.clear();
    console.log(`Player: ${player.name}, HP: ${player.hp},  MP: ${player.mp}`);
    monsters.forEach((monster, index) => {
        console.log(`Monster ${index + 1}: ${monster.name}, HP: ${monster.hp}, MP: ${monster.mp}`);
    });

    while (logs.length > 4) { logs.shift() };
    logs.forEach((log) => console.log(log));
} //전투용 창 적 정보가 보인다.

function playereDisplay(player) {
    console.clear();
    const wearItemName = Object.values(player.wear)[0]?.name || "장비 없음";
    console.log(`Player: ${player.name}, HP: ${player.hp}, MP: ${player.mp}, def:${player.def},
       착용중인 장비: ${wearItemName} gold: ${player.gold} `);

    while (logs.length > 4) { logs.shift() };
    logs.forEach((log) => console.log(log));
}// 플레이어 창. 메인 화면에 띄우는 용도.

async function playerAttackmethod(player, monsters) {

    let validChoice = false; //while을 위한 변수 옳은 선택을 하면 ture로 바뀌면서 탈출함.
    while (!validChoice) {
        console.log(chalk.green(`\n1. 일반공격 2. 스킬을 사용한다. 3. 방어`));
        const choice = await readlineSync.question('당신의 선택은? ');

        switch (choice) {//공격 방식 선택.
            case '1': 
                monsters.forEach((monster, index) => {
                    console.log(chalk.green(`${index + 1}. ${monster.name}`));
                });// 몬스터 배열만큼 나옴.
                const targetIndex = await readlineSync.question('공격할 몬스터를 선택하세요: ');
                const target = monsters[parseInt(targetIndex) - 1]; // 공격할 몬스터 선택.

                if (target && target.hp > 0) {
                    let damage = player.attack(player.atk);
                    const dealtDamage = await damageCalculation(player, target, damage); //데미지 계산 함수로 계산.
                    target.hp -= dealtDamage; //몬스터 체력 즉시 까기.
                    validChoice = true; //탈출.
                    return false; //이건 방어 안하면 무조건 false 나오게 함.
                } else {
                    logs.push(chalk.red('올바른 몬스터를 선택하세요.'));
                    updateDisplay(player, monsters); //화면 갱신. 다시 올라가니까. 위에 경고문 뛰우려면 이렇게 해야함.
                }
                break;

            case '2': // 스킬 사용
                const skillList = Object.keys(player.skills).map((skill, index) => `${index + 1}. ${skill}`).join(' '); // 스킬수 만큼 전개.
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
                            target.hp -= dealtDamage;  //몬스터 체력 즉시 까기.
                            validChoice = true;
                            return false;//방어하면 트루
                        } else {
                            logs.push(chalk.red('올바른 몬스터를 선택하세요.'));
                            updateDisplay(player, monsters);
                        }
                    } else {
                        logs.push(chalk.red('마나가 부족합니다.'));
                        updateDisplay(player, monsters);
                    }
                } else {
                    logs.push(chalk.red('잘못된 번호입니다.'));
                    updateDisplay(player, monsters);
                }
                break;

            case '3': //방어. 
                logs.push(chalk.red('당신은 방어를 시도했다.'));
                validChoice = true;
                return true; //방어하면 트루

            default:
                logs.push(chalk.red('올바른 선택을 하세요.'));
                updateDisplay(player, monsters);
        }
    }
}// 플레이어가 공격하는 대상을 정하고, 공격하는 방식도 정하는 함수. 적과 플레이어의 스킬이 추가되도 선택이 가능하다.

async function monsterAttackmethod(player, monster, defenseattempt) {
    if (monster.hp <= 0) return;

    let selectedSkill;
    const skillNames = monster.skills ? Object.keys(monster.skills) : []; //monster.skills의 키를 가진 객체를 만듬. 없으면 뭐 없는거 생성해서 밑에 기본공격함. 
    const skillsWithManaCost = skillNames.filter(skill => monster.skills[skill].mpCost > 0); //마나코스트 1이상인거 구별
    const skillsWithoutManaCost = skillNames.filter(skill => monster.skills[skill].mpCost === 0); // 0인거 구별

    if (skillsWithManaCost.length > 0) {
        const sortedSkills = skillsWithManaCost.sort((a, b) => monster.skills[b].mpCost - monster.skills[a].mpCost); //마나 코스트 높은대로 배열.
        for (const skillName of sortedSkills) { //높은것중 쓸수있는거 먼저 사용.
            const skill = monster.skills[skillName]; 
            if (monster.mp >= skill.mpCost) {
                selectedSkill = skill;
                break;
            }
        }
    }

    if (!selectedSkill && skillsWithoutManaCost.length > 0) { //못쓰면 여기까지 내려와서 무작위로 사용.
        const randomIndex = Math.floor(Math.random() * skillsWithoutManaCost.length);
        selectedSkill = monster.skills[skillsWithoutManaCost[randomIndex]];
    }

    let damage; //이제 데미지 계산.
    if (selectedSkill) {
        const skillResult = selectedSkill.execute.call(monster); //함수 불러보기. 이름, 데미지 마나소모 가져옴.
        skillResult.mpCost = selectedSkill.mpCost; //이건 그냥 따로있는 마나소모임. 이거 정해줘야 하드라. 데미지는 가져오는거 같은데..
        damage = skillResult.damage;// 스킬에 있는 데미지 넣기.

    
        if (skillResult.mpCost > 0) {
            monster.mp -= skillResult.mpCost; //마나 코스트가 있으면 빼주기.
        }
    } else {
        damage = monster.atk; //아니면 기본공격 ->이건 위에 selectedSkill이 없을때. 그니까 스킬이 없으면  하는 기본공격임.
    }

    if (defenseattempt) {
        logs.push(chalk.green('방어에 성공했다. 몬스터의 공격을 막았다.'));
        return; //방어선공하면 그냥 여기서 나감. 데미지는 계산 안하는것.
    }
    const dealtDamage = await damageCalculation(monster, player, damage); //데미지 계산함수.
    player.hp -= dealtDamage;//데미지 넣기.
}// 몬스터 공격방식임. 마나를 사용하는 스킬을 먼저 시도하고, 안되면 안쓰는 스킬중 무작위로 사용.

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

}//아이템과 장비를 획득하는 함수. 장비는 중복이면 안얻음. 

async function battle(stage, player, monsters) {
    const orderOfBattle = [{ ...player, type: 'player' }]; //플레이어 타입 추가.

    let defenseattempt = false; //방어 하면 트루로 바뀜.

    monsters.forEach(monster => {
        monster.type = 'monster';
        orderOfBattle.push(monster);
    }); //각 객체에 몬스터 타입 추가

    while (player.hp > 0 && monsters.some(monster => monster.hp > 0)) { //플레이어가 살아있고, 몬스터도 하나라도 살아있으면 반복.
        updateDisplay(player, monsters); //전투 전용창. 위에 나옴.

        orderOfBattle.sort((a, b) => {
            if (b.speed === a.speed) {
                return Math.random() < 0.5 ? 1 : -1; // 속도가 같으면 랜덤하게 순서 결정
            }
            return b.speed - a.speed; // 속도에 따라 내림차순 정렬
        });

        for (let i = 0; i < orderOfBattle.length; i++) {
            const unit = orderOfBattle[i];
            if (unit.type === 'player' && unit.hp > 0) {
                defenseattempt = await playerAttackmethod(player, monsters); // 플레이어 공격 처리 이때 방어하면 트루로.
            } else if (unit.type === 'monster' && unit.hp > 0) {
                await monsterAttackmethod(player, unit, defenseattempt); //몬스터 공격 처리 방어했다면 데미지0임. 근데 속도 느리면 맞음.
            }
        }

        defenseattempt = false; //다시 방어 모드 풀기.

    }

    logs = [];
    if (player.hp <= 0) {
        return false;
    } else {
        getItem(player, monsters);
        return true;
    }

}// 전투 함수. 플레이어와 몬스터 배열을 넣고(스테이지는 추가하려다 귀찮아서 놔둠.) 속도에 따라 순서를 정하고 공격이 진행된다
//플레이어는 공격방식을 선택하고 데미지를 주는 layerAttackmethod(player, monsters)함수로 가고
//몬스터는 자신이 가진 스킬을 사용하는걸 선택하는 함수인 monsterAttackmethod(player, monster, defenseattempt) 를 통해 
//공격한다. 이때 방어를 사용하면 데미지를 입지 않는다. 
//다 끝나면 몬스터가 지닌 아이템과 장비를 획득하며 아이템은 100확율로, 장비는 레어도에 따라 획득함.

async function useItem(player, itemName) {
    if (player.item[itemName] > 0) {
        switch (itemName) {
            case 'HPpotion':
                player.hp = Math.min(player.hp + 50, 100); // 최대 100까지만.
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
}// 아이템을 사용하는 함수. hp와 mp뿐이지만 다른것도 추가 가능하다.

async function itemstage(player) {

    logs.push(chalk.green(`무엇을 사용할까.`));
    while (true) {
        playereDisplay(player)

        const items = Object.keys(player.item);
        const itemList = items.map((item, index) => `${index + 1}. ${item} (x${player.item[item]})`).join(' ') + ` ${items.length + 1}. 되돌아 가기`;
        //선택창 만드는거. 밑의 장비와 같다.
        console.log(chalk.green(`\n아이템 선택: ${itemList}`));

        const itemNumber = parseInt(await readlineSync.question('사용할 아이템을 선택해 주세요: '), 10); //문자열을 정수로 바꾸는거임. 10진법

        if (itemNumber === items.length + 1) {
            break; //나가기.
        }

        const itemName = items[itemNumber - 1]; //아이템 배열 확인해서 이름넣어주기.

        if (itemName) {
            await useItem(player, itemName); //아이템 사용창으로.
        } else {
            logs.push(chalk.red("잘못된 선택입니다. 다시 선택해 주세요."));
            console.clear();
        }
    }
    logs = []; //로그 초기화.
}// 아이템을 보고 사용할수 있는 함수인 useItem 창으로 갈수 있다.

async function clothEquipment(player) {
    const equipment = Object.keys(player.wear)[0];//칸은 하나니까~
    if (!equipment) {
        logs.push(chalk.red('벗을 장비가 없습니다.'));//당연히 없으면 안벗는다. 근데 벗기창 안만들어서 이거 쓸일은 없음.
    } else {
        const item = player.wear[equipment];
        player.def -= item.pldef;

        player.Equipment[equipment] = item;

        delete player.wear[equipment]; //장비를 벗는 함수와 메커니즘은 같다.

        logs.push(chalk.red(`${item.name}을 벗었습니다. 방어력이 ${item.pldef}만큼 감소했습니다.`));
    }


}// 장비를 벗는 함수.

async function useEquipment(player, EquipmentName) {
    if (player.Equipment[EquipmentName]) {
        if (Object.keys(player.wear).length > 0) { //만약 착용중인 장비가 있다면~~
            await clothEquipment(player);//장비 벗기 함수를 실행.
        }

        const newItem = player.Equipment[EquipmentName]; //장비창의 장비를 참조.

        player.def += newItem.pldef; //올려주고
        player.wear[EquipmentName] = newItem; //장비창에 착용

        delete player.Equipment[EquipmentName]; //그리고 삭제.

        logs.push(chalk.green(`${newItem.name}을 착용했습니다. 방어력이 ${newItem.pldef}만큼 증가했습니다.`));
    } else {
        logs.push(chalk.red("해당 장비가 없습니다."));
    }
}// 장비를 입는 합수로 먼저 벋는 함수인 clothEquipment을 통해 장비를 벋고 착용한다.

async function Equipmentstage(player) {

    logs.push(chalk.green(`\n무엇을 입을까.`));

    while (true) {
        playereDisplay(player)

        const Equipments = Object.keys(player.Equipment); // 플레이어가 가진 장비의 키값을 가진 배열 생성.      공백을 기중으로 하나의 문자열로 합치는 조인.
        const EquipmentList = Equipments.map((name, index) => `${index + 1}. ${player.Equipment[name].name}`).join(' ') + ` ${Equipments.length + 1}. 되돌아 가기`;
        //위에 만든 배열을 맵을 통해 이름과 인덱스에 대한 문자열 생성. ^번호붙히는거. 0번부터 시작.  ^애는 장비. 동적으로 추가되므로 []표기법 사용.(정확히는 모르겠네..) 끝에는 되돌아가기 추가.
        console.log(chalk.green(`\n아이템 선택: ${EquipmentList}`));

        const EquipmentNumber = parseInt(await readlineSync.question('사용할 아이템을 선택해 주세요: '), 10);

        if (EquipmentNumber === Equipments.length + 1) {
            break;//나가기 선택
        }

        const EquipmentName = Equipments[EquipmentNumber - 1];

        if (EquipmentName) {
            console.clear();
            await useEquipment(player, EquipmentName);// 장비착용 함수로.

        } else {
            logs.push(chalk.red("잘못된 선택입니다. 다시 선택해 주세요."));
            console.clear();
        }
    }
    logs = [];//로그 초기화. 이건 함수 공간에서 나가면. 한번씩 해줘야함. 함수 공간이 .. 그 장비공간, 아이템공간, 배틀공간 같은 큼지막한 함수 말하는거.
}//장비를 보고 입는 함수인 useEquipment로 향하는 함수. 

async function main(player, stage) {
    let progress = 0;
    while (progress < 100) {
        console.clear()
        playereDisplay(player);
        console.log(`던전 ${stage} 층`);
        console.log(`탐험도 : ${progress}`);
        console.log(`1.길을 찾는다. 2.아이템을 사용한다. 3.장비를 변경한다.`)

        let validChoice = false; //와일문 반복을 위한 변수.
        while (!validChoice) {
            const choice = await readlineSync.question();

            switch (choice) {
                case '1':
                    console.clear;
                    const events = [event1,event2,event3,event4];// 여기에 이벤트 개수 추가.
                    const randomEvent = events[Math.floor(Math.random() * events.length)];//이벤트길이만큼 1~0변수를 곱하고 나온 1~4숫자를 이벤트 함수로 뽑는것.
                    progress += await randomEvent(stage, player);
                    validChoice = true; //whle문 깨짐.
                    break;
                case '2':
                    console.clear;
                    await itemstage(player) //아이템창으로.
                    validChoice = true;
                    break;
                case '3':
                    console.clear;
                    await Equipmentstage(player) //장비창으로.
                    validChoice = true;
                    break;
                default:
            }
        }
    }

    let bossclear = false;
    while (!bossclear) {
        progress = 100;
        console.clear()
        playereDisplay(player);
        console.log(`던전 ${stage} 층`);
        console.log(`탐험도 : ${progress}`);
        console.log(`1.다음층으로 간다.(주의 보스몬스터.) . 2.아이템을 사용한다. 3.장비를 변경한다.`)

        let validChoice = false;
        while (!validChoice) {
            const choice = await readlineSync.question();

            switch (choice) {
                case '1':
                    console.clear;
                    bossclear = await stageboss(stage, player);
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


} // 이곳에서 이벤트, 아이템창, 장비창으로 갈수 있다. 또한 진척도가 100이면 보스이벤트를 한다.

export async function startGame() {
    let name;
    await intro();
    name = await createName();
    const player = new Player(name, 100, 100, 100, 5, 5, 2, 10, 0, 0, 95);
    let stage = 1;
    let progress = 0;
    logs = [];
    main(player, stage, progress);
} // 게임을 시작하고, 플레이어를 새로 만듬. 진척도와 스테이지를 받는다. main함수로 간다. (세이브 만들려고 한 흔적임.)

startGame()



