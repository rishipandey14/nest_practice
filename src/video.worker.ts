import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('video', { concurrency: 2 })
export class VideoProcessor extends WorkerHost {
  async process(job: Job) {
    // Task processing logic here
    const totalSteps = 5;

    switch(job.name){
        case 'compress':
            console.log("Starting compress task");
            await this.runTaskWithProgress(job, totalSteps);
            break;
        case 'process':
            console.log("Starting process task");
            await this.runTaskWithProgress(job, totalSteps);
            break;
        default:
            console.log(`Unknown job name: ${job.name} `);
            break;
    }
  }

  async runTaskWithProgress(job: Job, totalSteps: number) {
    for(let step=1; step <= totalSteps; step++){
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const progress = Math.round((step / totalSteps) * 100);
        await job.updateProgress(progress);
    }
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    console.log(`job with job id: ${job.id}, ${job.progress}% completed`);
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    console.log(`Picked up job with job id: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job with job id: ${job.id} is completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`job with job id: ${job.id} failed to execute.`);
    console.log(`Attempt number : ${job.attemptsMade}.`);
  }
}