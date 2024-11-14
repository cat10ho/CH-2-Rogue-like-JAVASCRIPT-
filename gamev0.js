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


async function intro(name) {
    const dialogues1 = [
        '준비해라.',
        `\n당신의 아버지의 목소리는 차분하고 묵직했다.
그 목소리를 들은 당신은 때가 되었다고 생각한다.`,
        `\n당신은 사형집행인의 아들이고, 오늘이 당신의 첫 실습날이다.`,
        `\n당신은 겨우 열네 살이었지만, 이미 처형은 몇번이고 보아왔었다.`
    ];

    const dialogues2 = [
        '당신의 실습 상대는 도둑질 혐의로 3번의 유죄선고를 받은 ㅇㅇㅇ이다.',
        `\n형은 익사형으로, 팔다리를 묶고, 올가미를 쒸운뒤 호수에 빠뜨리기만 하면 됬다.`,
        `\n실수할 일이 없어야 하겠지만, 실수 하더라도 큰일로 이어지지 않기에, 
첫 실습일로는 제격이었다.`
    ];

    const dialogues3 = [
        `당신은 집에서 나오기전. 짐마차에 물품을 올리는걸 잊어버렸다는게 떠올랐다.`,
        `\n당신은 빠르게 창고로 왔으나, 물품이 전부 챙겨 마차에 오른다면
당신이 미리 물품을 준비하지 않았다는 것을 알고 벌을 줄 것이기 때문에
당신은 물품 몇개를 숨겨서 마차에 가기로 한다.`,
        `\n1. 밧줄을 챙긴다. 2. 올가미를 챙긴다. 3.마취약을 챙긴다.`
    ];

    const dialogues4 = [
        ` ${name}뭐하느냐`,
        `\n당신은 아버지가 부르는 소리에 빠르게 물건을 빠르게 몸에 숨긴뒤
집 밖으로 나와 짐마차에 도착했다.`,
        `\n쥐가 있어서 잡고 왔어요.`,
         `\n사람보다 쥐를 잡는걸 좋아하는구나.`
         `뭐라고 대꾸할 말이 없어 당신은 짐마차를 이끌고 처형장으로 간다.`
    ];

    await showDialogue(dialogues1, 1000);
    await showDialogue(dialogues2, 1000);
    await showDialogue(dialogues3, 1000);

    let validChoice = false; //옳은 선택지 넣으면 바뀜
    while (!validChoice) {
        const choice = await readlineSync.question('당신은.. ');

        switch (choice) {
            case '1':
                dialogues = [`익사를 위해서는 묶어야 하니까..`, `\n당신은 밧줄을 챙겼다.`];
                await showDialogue(dialogues, 1000);
                validChoice = true;
                break;

            case '2':
                dialogues = [`얼굴을 가리면 두려워하지 않겠지..`, `\n당신은 올가미를 챙겼다.`];
                await showDialogue(dialogues, 1000);
                validChoice = true;
                break;

            case '3':
                dialogues = [`마취를 하면 편하게 끝낼 수 있겠지`, `\n당신은 마취약을 챙겼다.`];
                await showDialogue(dialogues, 1000);
                validChoice = true;
                break;

            default:
                console.log(chalk.red('올바른 선택을 하세요.'));
        }
    }
    await showDialogue(dialogues4, 1000);
}


export async function startGame() {
    let name;
    name = await createName();
    await intro(name);
    const player = new Player(name, 100, 10, 6);
}

startGame()

