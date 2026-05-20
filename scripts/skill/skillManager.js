export class skillManager {
    static skills = new Map()

    static register(skill) {
        this.skills.set(skill.id, skill)
    }

    static get(id) {
        return this.skills.get(id)
    }
}