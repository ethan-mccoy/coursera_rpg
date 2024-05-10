

export class Player {
    constructor(scene, xp = 0, level = 1, gold = 0) {
        this.scene = scene;
        this.xp = xp;
        this.level = level;
        this.gold = gold;
    }

    addXp(amount) {
        this.xp += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        const xpNeeded = this.level * 100;
        if (this.xp >= xpNeeded) {
            this.level += 1;
            this.xp -= xpNeeded;
        }
    }

    addGold(amount) {
        this.gold += amount;
    }

    getInfo() {
        return `Level: ${this.level}\nXP: ${this.xp}/${this.level * 100}\nGold: ${this.gold}`;
    }
}