/* A basic note class
*/

export class Note {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }

    toString() {
        return `${this.title}: ${this.content}`;
    }
}