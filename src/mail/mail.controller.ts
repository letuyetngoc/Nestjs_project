import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schema/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/jobs.schema';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>

  ) { }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {

    const subscribers = await this.subscriberModel.find({})
    for (const sub of subscribers) {
      const subSkills = sub.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subSkills } })
      if (jobWithMatchingSkills.length > 0) {
        const jobs = jobWithMatchingSkills.map(job => ({
          name: job.name,
          company: job.company.name,
          salary: `${job.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
          skills: job.skills
        }))

        await this.mailerService.sendMail({
          to: "letuyetngocksh@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job', // HTML body content
          context: {
            receiver: "ngocle",
            jobs
          }
        });
      }
    }
  }
}
