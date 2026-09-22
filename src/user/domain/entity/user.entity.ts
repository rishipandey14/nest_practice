export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly age: number,
        public readonly email: string,
        public readonly roleId: number,
        public readonly password: string,
    ) {}
}
