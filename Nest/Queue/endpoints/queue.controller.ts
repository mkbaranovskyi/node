import { InjectQueue } from "@nestjs/bull";
import { Controller, Logger, Post } from '@nestjs/common';
import { Queue } from "bull";
import { DateTime } from "luxon";

@Controller({ path: 'queue' })
export class QueueController {
  private readonly logger = new Logger('QueueController');

  constructor(
    @InjectQueue('audio') private readonly audioQueue: Queue,
  ) { }

  @Post('transcode')
  async transcode() {
    this.logger.debug(`start, sec: ${DateTime.utc().get('second').toString()}`);

    await Promise.all([
      this.audioQueue
        .add('transcode', { name: 'max1' })
        .then((res) => res.finished())
        // .then((res) => new Promise((res, rej) => setTimeout(() => res('resolve'), 2000)))
        // .then((res) => this.logger.debug(`sec: ${DateTime.utc().get('second').toString()}`))
        .catch((err) => this.logger.error(DateTime.utc().get('second').toString())),
      this.audioQueue
        .add('transcode', { name: 'max1' })
        .then((res) => res.finished())
        // .then((res) => new Promise((res, rej) => setTimeout(() => res('resolve'), 2000)))
        // .then((res) => this.logger.debug(`sec: ${DateTime.utc().get('second').toString()}`))
        .catch((err) => this.logger.error(DateTime.utc().get('second').toString())),
      this.audioQueue
        .add('transcode', { name: 'max1' })
        .then((res) => res.finished())
        // .then((res) => new Promise((res, rej) => setTimeout(() => res('resolve'), 2000)))
        // .then((res) => this.logger.debug(`sec: ${DateTime.utc().get('second').toString()}`))
        .catch((err) => this.logger.error(DateTime.utc().get('second').toString())),
      this.audioQueue
        .add('transcode', { name: 'max1' })
        .then((res) => res.finished())
        // .then((res) => new Promise((res, rej) => setTimeout(() => res('resolve'), 2000)))
        // .then((res) => this.logger.debug(`sec: ${DateTime.utc().get('second').toString()}`))
        .catch((err) => this.logger.error(DateTime.utc().get('second').toString())),
      this.audioQueue
        .add('transcode', { name: 'max1' })
        .then((res) => res.finished())
        // .then((res) => new Promise((res, rej) => setTimeout(() => res('resolve'), 2000)))
        // .then((res) => this.logger.debug(`sec: ${DateTime.utc().get('second').toString()}`))
        .catch((err) => this.logger.error(DateTime.utc().get('second').toString())),
      this.audioQueue
        .add('transcode', { name: 'max1' })
        .then((res) => res.finished())
        // .then((res) => new Promise((res, rej) => setTimeout(() => res('resolve'), 2000)))
        // .then((res) => this.logger.debug(`sec: ${DateTime.utc().get('second').toString()}`))
        .catch((err) => this.logger.error(DateTime.utc().get('second').toString())),
    ])



    // return result;
  }
}
