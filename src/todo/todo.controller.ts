/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todo')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('create')
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    const userId: number = req.user.id;
    console.log(req.user.id);

    return this.todoService.create(userId, createTodoDto);
  }

  @Get('AllTodo')
  findAll(@Req() req: any) {
    const id: number = req.user.id;
    return this.todoService.findAll(id);
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: CreateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }
}
