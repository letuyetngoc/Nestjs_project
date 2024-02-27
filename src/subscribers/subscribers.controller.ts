import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/schemas/user.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage('Create a new subscriber')
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage('Update a subscriber')
  update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @Param() id: string,
    @User() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Get()
  @ResponseMessage('Fetch Subscriber with paginate')
  getAllPermissions(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string
  ) {
    return this.subscribersService.getAllRoles(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch subscriber by ID')
  getPermissionById(@Param('id') id: string) {
    return this.subscribersService.getRoleById(id);
  }

  @Delete(':id')
  @ResponseMessage('Delete a subscriber')
  delete(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.delete(id, user);
  }

  @Post('skills')
  @SkipCheckPermission()
  @ResponseMessage('Get subscriber skills')
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user);
  }
}
