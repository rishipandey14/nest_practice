import { InjectQueue } from "@nestjs/bullmq";
import { Controller, Post } from "@nestjs/common";
import { seconds, SkipThrottle, Throttle } from "@nestjs/throttler";
import { Queue } from "bullmq";

@Controller('video')
export class VideoController {
    constructor(@InjectQueue('video') private readonly videoQueue: Queue) {}

    @Throttle({'short': {ttl: seconds(5)}, 'medium': {ttl: seconds(20)}})
    @Post('process')
    async processVideo() {
        await this.videoQueue.add("process", {fileName: 'best-video', fileType: 'mp4'});
        return {
            message: 'Video processsing job added to queue',
        };
    }


    @SkipThrottle({'short' : true, 'medium' : true})
    @Post('compress')
    async compressVideo() {
        await this.videoQueue.add("compress", {fileName: 'best-video', fileType: 'mp4'});
        return {
            message: 'Video compressing job added to queue'
        };
    }
}