import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchPostDto } from './dto/search-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
  ) {}
  create(createPostDto: CreatePostDto) {
    return this.repository.save(createPostDto);
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('p');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);
    if (dto.orderBy) {
      qb.orderBy('views', dto.orderBy);
    }
    if (dto.body) {
      qb.andWhere(`p.body ILIKE :body`, { body: `%${dto.body}%` });
    }
    if (dto.title) {
      qb.andWhere(`p.title ILIKE :title`, { title: `%${dto.title}%` });
    }
    if (dto.tag) {
      qb.andWhere(`p.tags ILIKE :tag`, { tag: `%${dto.tag}%` });
    }
    const [posts, count] = await qb.getManyAndCount();
    return {
      posts,
      count,
    };
  }

  async findOne(id: number) {
    const find = await this.repository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException('Post not found');
    }
    await this.repository.update(id, {
      views: find.views + 1,
    });
    return find;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const find = await this.repository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException('Post not found');
    }
    return this.repository.update(id, updatePostDto);
  }
  async popular() {
    const qb = this.repository.createQueryBuilder('p');
    qb.orderBy('views', 'DESC');
    qb.limit(10);
    const [posts, count] = await qb.getManyAndCount();
    return {
      posts,
      count,
    };
    // return this.repository.find({
    //   order: {
    //     views: 'DESC',
    //   },
    // });
  }

  async remove(id: number) {
    const find = await this.repository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException('Post not found');
    }
    return this.repository.delete(id);
  }
}
