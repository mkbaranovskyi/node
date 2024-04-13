export class OrderCreatedEvent {
  constructor(
    readonly orderId: string,
    readonly userId: string,
    readonly price: number,
  ) {}

  /**
   * This method is needed because the `emit` method will only stringify plain object be default. For class instances it will implicitly call the `toString` method.
   */
  toString() {
    return JSON.stringify(this);
  }
}
