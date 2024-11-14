//해결할 문제점. 1.체력이 0이되면 공격하지 않기. 2. 선택이 되지않게. 다시 돌리기. 이건 while문 쓰면됨.
// 1번만 해결되면 배틀문제는 끝날듯.
//문제점 발견. 1. 몬스터 hp랑 불러온 unithp랑 별개로 지정된듯. 그래서 몬스터 다 까여도 유닛은 그대로라 그럼.
// 해결. 타입도 개별적으로 넣어줌.
// 드디어 끝남.

import chalk from 'chalk';
import readlineSync from 'readline-sync';

var logs = [];

class Player {
    constructor(name, hp = 100, mp = 100, atk = 10, def = 5, dodge = 5, speed = 3, critical = 20, level = 0, exp = 0, hit = 95) {
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
    constructor(name, hp = 100, mp = 100, atk = 10, def = 5, dodge = 5, speed = 2, critical = 20, level = 0, exp = 0, hit = 95, skills = {}) {
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
}

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
}


function randnum(max, min) {
    let randnum = (Math.floor(Math.random() * (max - min + 1)) + min) //이러면 최댓값, 최솟값 정수가 나온다.
    return randnum;
}

async function createName() {
    console.clear();
    console.log('이름을 입력해 주세요.')
    let name = readlineSync.question('입력: ');
    return name;
};

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
}

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
}

async function event1(stage, player) {
    let addprogress=0;

    let Goblin = new Monster('Goblin', 30, 0, 9, 5, 0, 1, 20, 1, 5, 90, {
        slash: function() {
            return { skillName: "slash", damage: this.atk };
        }
    });
    let Skeleton = new Monster('Skeleton', 50, 0, 15, 10, 0, 1, 20, 1, 20, 50, {
        boneThrow: function() { return {skillName: "boneThrow", damage:this.atk} 
        }
    });

    let monsters = [Goblin, Skeleton];
    const playerWon = await battle(stage, player, monsters);
    if (!playerWon) {
        gameover(stage, false); // 엔딩 1
    } else {
        addprogress=50; // 보상과 진척도 획득.
    }
    return addprogress;
};

async function playerAttackmethod(player, monsters) {
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
            } else if (target === '2' && monsters[1].hp > 0) {
                damage = player.attack(player.atk);
                const dealtDamage = await damageCalculation(player, monsters[1], damage);
                monsters[1].hp -= dealtDamage;
            } else {
                logs.push(chalk.red('올바른 몬스터를 선택하세요.'));
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
                    } else if (target === '2' && monsters[1].hp > 0) {
                        dealtDamage = await damageCalculation(player, monsters[1], damage);
                        monsters[1].hp -= dealtDamage;
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
        // Use skill if enough MP
        monster.mp -= selectedSkill.mpCost;
        damage = selectedSkill.damage;
    } else {
        // Use basic attack if not enough MP
        damage = monster.atk;
    }

    const dealtDamage = await damageCalculation(monster, player, damage);
    player.hp -= dealtDamage;  // Correctly reduce player's HP
}

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
        console.clear();
        console.log(`Player: ${player.name}, HP: ${player.hp}`);
        monsters.forEach((monster, index) => {
            console.log(`Monster ${index + 1}: ${monster.name}, HP: ${monster.hp}`);
        });

        while(logs.length>4){logs.shift()};
        logs.forEach((log) => console.log(log));

        for (let i = 0; i < orderOfBattle.length; i++) {
            const unit = orderOfBattle[i];
            if (unit.type === 'player' && unit.hp > 0) {
                await playerAttackmethod(player, monsters); // 플레이어 공격 처리
            } else if (unit.type === 'monster' && unit.hp > 0) {
                await monsterAttackmethod(player, unit);
            }
        }
    }


    if (player.hp <= 0) {
        return false;
    } else {
        return true;
    }

}








async function main(player, stage) {
    let progress = 0;
    while(progress<100){
        console.clear()
        console.log(`던전 ${stage} 층`);
        console.log(`탐험도 : ${progress}`);
        console.log(`1.길을 찾는다. 2.아이템을 사용한다. 3.장비를 변경한다.`)

        let validChoice = false;
        while (!validChoice) {
            const choice = await readlineSync.question();
    
            switch (choice) {
                case '1':
                    progress += await event1(stage, player);
                    validChoice = true;
                    break;
                // case '2':
                //     //아이템 창으로. 회복아이템 사용 가능.
                //     validChoice = true;
                //     break;
                // case '3':
                //     //장비 변경 창으로.
                //     validChoice = true;
                //     break;
                default:
                    logs.push(chalk.red('올바른 선택을 하세요.'));
            }
        }
    }
}



export async function startGame() {
    let name;
    await intro();
    name = await createName();
    const player = new Player(name, 100, 100, 10, 5, 5, 2, 10, 0, 0, 95);
    let stage = 1;
    let progress = 0;
    main(player, stage, progress);
}

startGame()

//할일 1. 몬스터 전투, 스킬 적용, 2. 배틀시스템 정리 3. 장비 아이템 적용. 4. 사용아이템. 스킬추가와 회복. 적용
//5. 보스 잡고 다음으로 넘어가는거. 6. 특수 이벤트 적용. 7. 결말.
