/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  async create(userId: number, createTodoDto: CreateTodoDto) {
    console.log(userId, createTodoDto.title);
    const title: string = createTodoDto.title;
    const user = await this.prisma.todo.create({
      data: {
        userId,
        title,
      },
    });
    return user;
  }

  async findAll(userId: number) {
    const user = await this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
    return user;
  }

  async update(id: number, updateTodoDto: CreateTodoDto) {
    const user = await this.prisma.todo.update({
      where: {
        id,
      },
      data: updateTodoDto,
    });
    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.todo.delete({
      where: {
        id,
      },
    });
    return user;
  }
}
