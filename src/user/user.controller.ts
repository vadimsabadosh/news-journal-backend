import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.email);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/search')
  search(@Query() dto: SearchUserDto) {
    return this.userService.search(dto);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+req.user.sub, updateUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }
}
