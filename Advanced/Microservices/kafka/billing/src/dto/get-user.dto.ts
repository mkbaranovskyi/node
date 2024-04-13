export class GetUserDto {
  constructor(readonly userId: string) {}

  toString() {
    return JSON.stringify(this);
  }
}
