export class skillManager {
    static skills = new Map()
    static tickSKills = new Map()

    static register(skill) {
        this.skills.set(skill.id, skill)
    }

    static get(id) {
        return this.skills.get(id)
    }

    static tickSkillRegister(skill) {
        this.tickSKills.set(skill.id, skill)
        this.skills.set(skill.id, skill)
    }

    static tickSkillGet(id) {
        return this.tickSKills.get(id)
    }
}