import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
    constructor(name, hp = 100, attack_power = 10, speed = 6) {
        this.name = name;
        this.hp = hp;
        this.attack_power = attack_power;
        this.speed = speed;
    }
    effects() {
        return
    }

    attack() {
        return
    }
}



class Monster {
    constructor(name, hp = 100, attack_power = 10, speed = 6) {
        this.name = name;
        this.hp = hp;
        this.attack_power = attack_power;
        this.speed = speed;
    }

    effects() {
        return
    }

    attack() {
        return
    }
}

function gmaeover(stage, playerWon) {
    console.clear();
    if (!playerWon) {
        //엔딩 1.
        console.log(chalk.yellow("게임을 종료합니다."));
    process.exit(); // 게임 종료.
    } 
};

async function intro() {
    console.clear();
    console.log('이름을 입력해 주세요.')
    let name = readlineSync.question('입력: ');
    return name;
};


function intro2() {
    return new Promise((resolve) => {
        console.clear();
        setTimeout(() => console.log('인트로.'), 1000);
        setTimeout(() => console.log('인트로2.'), 2000);

        setTimeout(() => {
            readlineSync.question('다음으로 넘어가기.');
            resolve();
        }, 3000);
    });
}

async function event1(stage, player) {
    let monster1 = new Monster('monstername', 100, 10, 6);
    let monster2 = new Monster('monstername2', 100, 10, 6);
    let monsters = [monster1, monster2];
    const playerWon =await battle(stage, player, monsters);
    if (!playerWon) {
        gameover(stage, false); // 엔딩 1
    } else {
        gameover(stage, true);  // 스테이지 이동.
    }
    return stage;
};

const battle = async (stage, player, monsters) => {
    var logs = [];
    while (player.hp > 0 && monsters.some(monster => monster.hp > 0)) { // 몬스터 구성원들이 hp가 0이 아니라면.
        console.clear();

        //
        console.log(`Player: ${player.name}, HP: ${player.hp}`);
        monsters.forEach((monster, index) => {
            console.log(`Monster ${index + 1}: ${monster.name}, HP: ${monster.hp}`);
        }); //임시 디스플레이임. 

        while (logs.length > 4) { logs.shift() };
        logs.forEach((log) => console.log(log)); //콘솔에 추가함.

        console.log(chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다.`,),);
        const target = await readlineSync.question('당신의 선택은? ');

        switch (choice) {
            case '1':
                console.log(chalk.green(`\n1. ${monster[0].name} 2. ${monster[1].name}`,),);
                const target = await readlineSync.question('공격할 몬스터를 선택하세요:');

                if (target === '1' && monsters[0].hp > 0) {
                    monsters[0].hp -= player.attack_power;
                    logs.push(chalk.green(`${monsters[0].name}에게 ${player.attack_power}의 피해를 입혔습니다.`));
                } else if (target === '2' && monsters[1].hp > 0) {
                    monsters[1].hp -= player.attack_power;
                    logs.push(chalk.green(`${monsters[1].name}에게 ${player.attack_power}의 피해를 입혔습니다.`));
                } else {
                    logs.push(chalk.red('올바른 몬스터를 선택하세요.'));
                    await battle(stage, player, monster);
                    return e;
                }
                break;

            case '2':
                logs.push(chalk.green(`아무것도 하지않는다. 를 선택하셨습니다.`));
                break;
            default:
                logs.push(chalk.red('올바른 선택을 하세요.'));
                await battle(stage, player, monster);
                return;
        }
    }// 전투가 끝나면 둘중 하나는 피가 0임. 하나의 경우인 게임 오버만 확인하고 아니라면 다음 이벤트로 가게 하기.

    monsters.forEach(monster => {
        if (monster.hp > 0) {
            player.hp -= monster.attack_power;
            logs.push(chalk.red(`${monster.name}이(가) ${monster.attack_power}의 피해를 입혔습니다.`));
        }
    });

    if (player.hp <= 0) {
        return false; 
    }

    return true; 
}

export async function startGame() {
    let name;
    name = await intro();
    await intro2();
    const player = new Player(name, 100, 10, 6);

    let stage = 1;
    stage = event1(stage, player); //이벤트를 통해 다음 스테이지로.

    if(stage===2) {
        event2() 
    };

    if(stahe===3) {
        event2()
    }
}

startGame()


