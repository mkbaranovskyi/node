import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job, Queue } from "bull";
import { DateTime } from "luxon";

@Processor('audio')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);

  constructor(
    // @InjectQueue('audio') private readonly audioQueue: Queue,
  ) { }

  @Process({ name: 'transcode', concurrency: 2 })
  async handleTranscode(job: Job) {
    const result = await new Promise((resolve, reject) => setTimeout(() => reject('loh'), 3000));
    this.logger.debug(`jobId: ${job.id}, sec: ${DateTime.utc().get('second').toString()}`);
    return result;
  }

  // @OnGlobalQueueCompleted({ name: 'transcode' })
  // async onHandleTranscode(jobId: number, result: any) {
  //   const job = await this.audioQueue.getJob(jobId);
  //   this.logger.debug('finished!', jobId);
  //   return result;
  // }

  @Process('encode')
  async handleEncode(job: Job) {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    this.logger.debug('encode done');
  }
}
