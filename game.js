import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.attack_power =80;
  }

  attack(monsterHp) {
    monsterHp=(monsterHp-this.attack_power);
    return monsterHp
  }
}

class Monster {
  constructor() {
    this.hp = 100;
    this.attack_power =10;
  }

  attack(playerHp) {
    playerHp=(playerHp-this.attack_power);
    return playerHp
  }
}

async function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(`| 플레이어 정보   hp : ${player.hp} |`) +
    chalk.redBright(`| 몬스터 정보     hp : ${monster.hp} |`)
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  var logs = [];
  while(player.hp > 0 && monster.hp> 0) {
    console.clear();
    displayStatus(stage, player, monster);

    while(logs.length>4){logs.shift()};
    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다.`,),);
    const choice = await readlineSync.question('당신의 선택은? ');
    switch (choice) {
        case '1':
            logs.push(chalk.green(`몬스터에게 ${player.attack_power}의 피해를 입혓습니다.`));
            logs.push(chalk.red(`몬스터가 ${monster.attack_power}의 피해를 입혓습니다.`));
            monster.hp=player.attack(monster.hp);
            player.hp=monster.attack(player.hp);
            break;
        case '2':
            logs.push(chalk.green(`아무것도 하지않는다. 를 선택하셨습니다.`));
            player.hp=monster.attack(player.hp);
            break;
        default:
            logs.push(chalk.red('올바른 선택을 하세요.'));
            await battle(stage, player, monster);
            return ;
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) { 
    const monster = new Monster(stage);
    await battle(stage, player, monster);
    
    stage++;
  }
}